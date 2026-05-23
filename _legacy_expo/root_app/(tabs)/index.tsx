import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send } from 'lucide-react-native';
import { useStore } from '../../src/store';
import { suggestTags } from '../../src/lib/tags';
import { colors, spacing, borderRadius, fontSize } from '../../src/constants/theme';

export default function CaptureScreen() {
  const [content, setContent] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { addPainPoint, painPoints } = useStore();

  // Auto-suggest tags when content changes
  useEffect(() => {
    if (content.length > 10) {
      const tags = suggestTags(content);
      setSuggestedTags(tags);
    }
  }, [content]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('提示', '请输入你的痛点');
      return;
    }

    const result = await addPainPoint(content.trim(), selectedTags);
    if (result) {
      Alert.alert('成功', '痛点已记录');
      setContent('');
      setSelectedTags([]);
      setSuggestedTags([]);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>记录你的痛点</Text>
          <Text style={styles.subtitle}>
            3秒内记下你当下的不满，我们来帮你分析
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="例如：每次找优惠券都要浪费好多时间..."
              placeholderTextColor="#9CA3AF"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Tags Section */}
        {suggestedTags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.tagsTitle}>推荐标签</Text>
            <View style={styles.tagsContainer}>
              {suggestedTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    selectedTags.includes(tag) && styles.tagSelected,
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedTags.includes(tag) && styles.tagTextSelected,
                    ]}
                  >
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Send size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.submitText}>提交记录</Text>
        </TouchableOpacity>

        {/* Recent Pain Points */}
        {painPoints.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>最近记录</Text>
            {painPoints.slice(0, 3).map((pp) => (
              <TouchableOpacity key={pp.id} style={styles.recentCard}>
                <Text style={styles.recentContent} numberOfLines={2}>
                  {pp.raw_content}
                </Text>
                <View style={styles.recentMeta}>
                  <Text style={styles.recentStatus}>
                    {pp.status === 'raw' ? '待提炼' : '已完成'}
                  </Text>
                  <Text style={styles.recentTime}>
                    {new Date(pp.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
  },
  inputSection: {
    paddingHorizontal: spacing.xl,
  },
  inputContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  input: {
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    minHeight: 120,
  },
  tagsSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  tagsTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagSelected: {
    backgroundColor: colors.tagBgSelected,
    borderColor: colors.tagBgSelected,
  },
  tagText: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
  },
  tagTextSelected: {
    color: colors.tagTextSelected,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  submitText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.tagTextSelected,
  },
  recentSection: {
    padding: spacing.xl,
  },
  recentTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  recentCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentContent: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  recentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentStatus: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  recentTime: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});
