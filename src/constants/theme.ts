export const colors = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  surface: '#F9FAFB',
  background: '#FFFFFF',
  backgroundAlt: '#F3F4F6',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#374151',
  textTertiary: '#6B7280',
  textMuted: '#9CA3AF',
  tagBg: '#EEF2FF',
  tagBgSelected: '#6366F1',
  tagTextSelected: '#FFFFFF',
  micBg: '#EEF2FF',
  micBgRecording: '#FEE2E2',
  shadow: '#000',
  chartColors: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'],
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 28,
} as const;

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
