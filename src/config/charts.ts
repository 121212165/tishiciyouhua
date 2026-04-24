import { colors } from '../constants/theme';

export const CHART_COLORS = colors.chartColors;

export const defaultChartConfig = {
  backgroundColor: colors.background,
  backgroundGradientFrom: colors.background,
  backgroundGradientTo: colors.background,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  style: { borderRadius: 16 },
  propsForLabels: {
    fontSize: 11,
  },
};
