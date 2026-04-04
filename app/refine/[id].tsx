import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, Sparkles, ArrowLeft, Check } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../../src/store';
import { anthropic, REFINEMENT_SYSTEM_PROMPT, INITIAL_GREETING } from '../../src/lib/anthropic';
import type { Message } from '../../src/types';

export default function RefineScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { painPoints, updatePainPoint } = useStore();

  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const painPoint = painPoints.find((pp) => pp.id === id);

  // Initialize the refinement flow
  useEffect(() => {
    if (painPoint && messages.length === 0) {
      startRefinement();
    }
  }, [painPoint?.id]);

  const startRefinement = async () => {
    if (!painPoint) return;

    setIsLoading(true);
    try {
      // Update status to refining
      await updatePainPoint(id!, { status: 'refining' });

      // Send initial greeting
      const greeting = INITIAL_GREETING.replace(
        '{pain_point_content}',
        painPoint.raw_content
      );
      setMessages([{ role: 'assistant', content: greeting }]);
    } catch (error) {
      console.error('Error starting refinement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!userInput.trim() || isLoading || isComplete) return;

    const userMessage = userInput.trim();
    setUserInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // For demo, simulate AI response
      // In production, use Anthropic API
      const response = await simulateAIResponse(userMessage, messages.length);

      setMessages((prev) => [...prev, { role: 'assistant', content: response.content }]);

      // Check if refinement is complete
      if (response.isComplete) {
        setIsComplete(true);
        await finishRefinement(response.refinedStory, response.mvpFeatures);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (lastUserMessage: string, round: number) => {
    // Simulated AI responses for MVP demo
    // In production, replace with actual Anthropic API call
    const responses = [
      '我理解。我想进一步了解：这个情况对你来说最大的影响是什么？是否经常发生？',
      '明白。除了你之外，你认为还有谁可能有类似的困扰？他们的场景会有什么不同？',
      `很好！现在我们已经了解了背景。让我确认一下核心需求：

**用户故事**：作为[目标用户]，我希望[能够做到某事]，以便[获得某收益]。

**MVP功能**：
1. [核心功能1]
2. [核心功能2]

这个总结是否符合你的预期？点击确认即完成提炼。`,

      // Completion response
      '',
    ];

    const isCompleteResponse = round >= 3;
    return {
      content: responses[Math.min(round, responses.length - 1)] || responses[0],
      isComplete: isCompleteResponse,
      refinedStory:
        '作为用户，我希望能够快速找到优惠券，以便节省购物时间。',
      mvpFeatures: ['优惠券聚合', '自动匹配最优券', '历史下单记录'],
    };
  };

  const finishRefinement = async (refinedStory: string, mvpFeatures: string[]) => {
    await updatePainPoint(id!, {
      status: 'refined',
      refined_story: refinedStory,
      mvp_features: mvpFeatures,
      conversation_history: messages,
    });
  };

  const handleConfirm = () => {
    router.back();
  };

  if (!painPoint) {
    return (
      <View style={styles.container}>
        <Text>痛点不存在</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color="#6366F1" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Sparkles size={16} color="#8B5CF6" />
          <Text style={styles.headerTitle}>AI 提炼</Text>
        </View>
      </View>

      {/* Pain Point Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>原始痛点</Text>
        <Text style={styles.summaryContent}>{painPoint.raw_content}</Text>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd()}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.role === 'user' ? styles.userText : styles.aiText,
              ]}
            >
              {msg.content}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <Text style={[styles.messageText, styles.aiText]}>
              思考中...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        {isComplete ? (
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.confirmText}>确认完成</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="输入你的回答..."
              placeholderTextColor="#9CA3AF"
              value={userInput}
              onChangeText={setUserInput}
              multiline
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={isLoading || !userInput.trim()}
            >
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 6,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryContent: {
    fontSize: 14,
    color: '#111827',
  },
  messagesContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#6366F1',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#374151',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});