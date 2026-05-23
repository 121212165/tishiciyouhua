import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Mic, MicOff, Copy } from 'lucide-react-native';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { copyToClipboard, addToClipboardHistory } from '../../lib/clipboard';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

export default function VoiceToTextSection() {
  const { text, isListening, startListening, stopListening, isSupported, error } =
    useSpeechToText('zh-CN');
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);

  const handlePressIn = async () => {
    setShowPermissionAlert(false);
    try {
      await startListening();
    } catch {
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
          placeholderTextColor={colors.textMuted}
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
              <MicOff size={28} color={colors.textMuted} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.copyButton, !text && styles.disabled]}
            onPress={handleCopy}
            disabled={!text}
          >
            <Copy size={20} color={text ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
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
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  supportText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  voiceContainer: {
    position: 'relative',
  },
  voiceInput: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    minHeight: 100,
    paddingRight: 80,
  },
  voiceActions: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  micButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recording: {
    backgroundColor: colors.danger,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.tagBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
