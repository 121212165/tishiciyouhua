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
import { Mic, Send, X } from 'lucide-react-native';
import { useStore } from '../../src/store';
import { suggestTags } from '../../src/lib/anthropic';

export default function CaptureScreen() {
  const [content, setContent] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

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

  // Simulated voice recording (for demo - would integrate Speech-to-Text in production)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        setIsRecording(false);
        setContent((prev) => prev + '我的手机总是太慢，浪费时间');
      }, 2000);
    }
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
            <TouchableOpacity
              style={[styles.MicButton, isRecording && styles.recording]}
              onPress={toggleRecording}
            >
              <Mic size={24} color={isRecording ? '#EF4444' : '#6366F1'} />
            </TouchableOpacity>
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
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  inputSection: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    position: 'relative',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 120,
    paddingRight: 60,
  },
  MicButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recording: {
    backgroundColor: '#FEE2E2',
  },
  tagsSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  tagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  tagText: {
    fontSize: 14,
    color: '#6B7280',
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recentSection: {
    padding: 20,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recentContent: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  recentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentStatus: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  recentTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});