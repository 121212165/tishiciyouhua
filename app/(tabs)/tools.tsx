import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import VoiceToTextSection from '../../src/components/tools/VoiceToTextSection';
import ClipboardSection from '../../src/components/tools/ClipboardSection';
import VideoSection from '../../src/components/tools/VideoSection';
import { colors, spacing, fontSize } from '../../src/constants/theme';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
