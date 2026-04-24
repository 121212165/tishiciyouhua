import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import {
  getClipboardHistory,
  addToClipboardHistory,
  deleteFromClipboardHistory,
  clearClipboardHistory,
  copyToClipboard,
  initClipboardListener,
} from '../../lib/clipboard';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import type { ClipboardItem } from '../../types';

export default function ClipboardSection() {
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    loadHistory();
    cleanupRef.current = initClipboardListener(async (content) => {
      await addToClipboardHistory(content, 'system');
      loadHistory();
    });

    return () => {
      cleanupRef.current?.();
    };
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await getClipboardHistory();
    setHistory(data);
    setLoading(false);
  };

  const handleCopy = async (item: ClipboardItem) => {
    await copyToClipboard(item.content);
    Alert.alert('已复制', '内容已复制到剪贴板');
  };

  const handleDelete = async (id: string) => {
    await deleteFromClipboardHistory(id);
    loadHistory();
  };

  const handleClear = async () => {
    Alert.alert('确认', '确定清空所有剪贴板历史？', [
      { text: '取消', style: 'cancel' },
      {
        text: '清空',
        style: 'destructive',
        onPress: async () => {
          await clearClipboardHistory();
          loadHistory();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: ClipboardItem }) => (
    <TouchableOpacity style={styles.clipboardItem} onPress={() => handleCopy(item)}>
      <Text style={styles.clipboardContent} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.clipboardActions}>
        <Text style={styles.clipboardTime}>
          {new Date(item.created_at).toLocaleTimeString()}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Trash2 size={16} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>剪贴板历史</Text>
        <TouchableOpacity onPress={handleClear}>
          <Trash2 size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : history.length === 0 ? (
        <Text style={styles.emptyText}>暂无记录</Text>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  clipboardItem: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  clipboardContent: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  clipboardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clipboardTime: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: 'center',
    padding: spacing.xl,
  },
});
