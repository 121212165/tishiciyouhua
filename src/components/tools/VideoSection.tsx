import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Upload, Video as VideoIcon } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

// react-native-document-picker is a native module; lazy import to avoid web crash
let DocumentPicker: any = null;
async function getDocumentPicker() {
  if (!DocumentPicker) {
    try {
      DocumentPicker = await import('react-native-document-picker');
    } catch {
      // Web or unsupported environment — file picking not available
    }
  }
  return DocumentPicker;
}

export default function VideoSection() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const isNative = Platform.OS !== 'web';

  const pickVideo = async () => {
    setLoading(true);
    try {
      const DP = await getDocumentPicker();
      if (!DP) {
        return;
      }
      const result = await DP.default.pick({
        type: [DP.default.types.videos],
      });
      if (result && result[0]) {
        setVideoUri(result[0].uri);
      }
    } catch (error: any) {
      if (error?.code !== 'DOCUMENT_PICKER_CANCELED') {
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
        {isNative && (
          <TouchableOpacity style={styles.videoButton} onPress={pickVideo}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Upload size={20} color={colors.primary} />
                <Text style={styles.videoButtonText}>选择视频</Text>
              </>
            )}
          </TouchableOpacity>
        )}
        <View style={styles.urlInputContainer}>
          <TextInput
            style={styles.urlInput}
            value={urlInput}
            onChangeText={setUrlInput}
            placeholder={isNative ? '或输入视频URL...' : '输入视频URL...'}
            placeholderTextColor={colors.textMuted}
            onSubmitEditing={handleUrlSubmit}
          />
        </View>
      </View>

      {/* Placeholder when no video */}
      {!videoUri ? (
        <View style={styles.videoPlaceholder}>
          <VideoIcon size={48} color={colors.textMuted} />
          <Text style={styles.placeholderText}>
            {isNative ? '选择视频或输入URL' : '输入视频URL加载字幕'}
          </Text>
        </View>
      ) : (
        <View style={styles.videoInfo}>
          <VideoIcon size={24} color={colors.primary} />
          <Text style={styles.videoUrl} numberOfLines={1}>
            {videoUri}
          </Text>
        </View>
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
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  videoInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tagBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  videoButtonText: {
    fontSize: fontSize.base,
    color: colors.primary,
    fontWeight: '500',
  },
  urlInputContainer: {
    flex: 1,
  },
  urlInput: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  videoPlaceholder: {
    height: 160,
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  placeholderText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  videoUrl: {
    flex: 1,
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
});
