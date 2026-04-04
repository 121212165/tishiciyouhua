import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Mic, MicOff, Copy, Trash2, Upload, Link, Video as VideoIcon } from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'react-native-document-picker';
import { useSpeechToText } from '../../src/hooks/useSpeechToText';
import {
  getClipboardHistory,
  addToClipboardHistory,
  deleteFromClipboardHistory,
  clearClipboardHistory,
  copyToClipboard,
  initClipboardListener,
} from '../../src/lib/clipboard';
import type { ClipboardItem } from '../../src/types';

export default function ToolsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>工具箱</Text>
      </View>

      <VoiceToTextSection />
      <ClipboardSection />
      <VideoSection />
    </ScrollView>
  );
}

// ========== Voice to Text Section ==========
function VoiceToTextSection() {
  const { text, isListening, startListening, stopListening, isSupported, error } =
    useSpeechToText('zh-CN');
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);

  const handlePressIn = async () => {
    setShowPermissionAlert(false);
    try {
      await startListening();
    } catch (e) {
      setShowPermissionAlert(true);
    }
  };

  const handlePressOut = async () => {
    await stopListening();
  };

  const handleCopy = async () => {
    if (text.trim()) {
      await copyToClipboard(text);
      await addToClipboardHistory(text, 'voice');
      Alert.alert('已复制', '文字已复制到剪贴板并保存');
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>语音转文字</Text>
      <Text style={styles.supportText}>
        {isSupported ? '支持语音识别' : '暂不支持'}
      </Text>
      {showPermissionAlert && (
        <Text style={styles.errorText}>需要麦克风权限</Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.voiceContainer}>
        <TextInput
          style={styles.voiceInput}
          value={text}
          placeholder="按住麦克风说话..."
          placeholderTextColor="#9CA3AF"
          multiline
          editable={false}
        />
        <View style={styles.voiceActions}>
          <TouchableOpacity
            style={[styles.micButton, isListening && styles.recording]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            {isListening ? (
              <Mic size={28} color="#fff" />
            ) : (
              <MicOff size={28} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.copyButton, !text && styles.disabled]}
            onPress={handleCopy}
            disabled={!text}
          >
            <Copy size={20} color={text ? '#6366F1' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ========== Clipboard Section ==========
function ClipboardSection() {
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
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>剪贴板历史</Text>
        <TouchableOpacity onPress={handleClear}>
          <Trash2 size={20} color="#EF4444" />
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

// ========== Video Section ==========
function VideoSection() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const pickVideo = async () => {
    setLoading(true);
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.videos],
      });
      if (result && result[0]) {
        setVideoUri(result[0].uri);
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Pick video error:', error);
      }
    }
    setLoading(false);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setVideoUri(urlInput.trim());
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>视频字幕</Text>

      {/* Video Source Input */}
      <View style={styles.videoInputRow}>
        <TouchableOpacity style={styles.videoButton} onPress={pickVideo}>
          {loading ? (
            <ActivityIndicator size="small" color="#6366F1" />
          ) : (
            <>
              <Upload size={20} color="#6366F1" />
              <Text style={styles.videoButtonText}>选择视频</Text>
            </>
          )}
        </TouchableOpacity>
        <View style={styles.urlInputContainer}>
          <TextInput
            style={styles.urlInput}
            value={urlInput}
            onChangeText={setUrlInput}
            placeholder="或输入视频URL..."
            placeholderTextColor="#9CA3AF"
            onSubmitEditing={handleUrlSubmit}
          />
        </View>
      </View>

      {/* Placeholder when no video */}
      {!videoUri ? (
        <View style={styles.videoPlaceholder}>
          <VideoIcon size={48} color="#9CA3AF" />
          <Text style={styles.placeholderText}>选择视频或输入URL</Text>
        </View>
      ) : (
        <View style={styles.videoInfo}>
          <VideoIcon size={24} color="#6366F1" />
          <Text style={styles.videoUrl} numberOfLines={1}>
            {videoUri}
          </Text>
        </View>
      )}
    </View>
  );
}

// ========== Styles ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  supportText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginBottom: 8,
  },
  // Voice styles
  voiceContainer: {
    position: 'relative',
  },
  voiceInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 100,
    paddingRight: 80,
  },
  voiceActions: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    gap: 8,
  },
  micButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recording: {
    backgroundColor: '#EF4444',
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  // Clipboard styles
  clipboardItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  clipboardContent: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  clipboardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clipboardTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 20,
  },
  // Video styles
  videoInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  videoButtonText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  urlInputContainer: {
    flex: 1,
  },
  urlInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  videoPlaceholder: {
    height: 160,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  videoUrl: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
  },
});