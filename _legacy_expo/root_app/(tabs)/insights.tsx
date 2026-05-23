import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useStore } from '../../src/store';
import { colors, spacing, borderRadius, fontSize } from '../../src/constants/theme';
import { CHART_COLORS, defaultChartConfig } from '../../src/config/charts';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;

export default function InsightsScreen() {
  const { painPoints } = useStore();

  // Calculate tag distribution
  const tagDistribution = useMemo(() => {
    const tagCount: Record<string, number> = {};
    painPoints.forEach((pp) => {
      pp.tags?.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return tagCount;
  }, [painPoints]);

  // Prepare pie chart data
  const pieData = useMemo(() => {
    const entries = Object.entries(tagDistribution);
    return entries.map(([tag, count], index) => ({
      name: tag,
      population: count,
      color: CHART_COLORS[index % CHART_COLORS.length],
      legendFontColor: colors.textTertiary,
      legendFontSize: 12,
    }));
  }, [tagDistribution]);

  // Calculate daily trend (last 7 days)
  const dailyTrend = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = `${date.getMonth() + 1}/${date.getDate()}`;
      days[key] = 0;
    }
    painPoints.forEach((pp) => {
      const date = new Date(pp.created_at);
      const key = `${date.getMonth() + 1}/${date.getDate()}`;
      if (days[key] !== undefined) {
        days[key] = (days[key] || 0) + 1;
      }
    });
    return {
      labels: Object.keys(days),
      datasets: [{ data: Object.values(days) }],
    };
  }, [painPoints]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: painPoints.length,
      refined: painPoints.filter((pp) => pp.status === 'refined').length,
      avgTags: painPoints.length > 0
        ? (painPoints.reduce((acc, pp) => acc + (pp.tags?.length || 0), 0) / painPoints.length).toFixed(1)
        : 0,
    };
  }, [painPoints]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>数据洞察</Text>
        <Text style={styles.subtitle}>发现你的高频痛点</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>总记录</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.refined}</Text>
          <Text style={styles.statLabel}>已提炼</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.avgTags}</Text>
          <Text style={styles.statLabel}>平均标签</Text>
        </View>
      </View>

      {/* Tag Distribution */}
      {pieData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>标签分布</Text>
          <View style={styles.chartCard}>
            <PieChart
              data={pieData}
              width={CHART_WIDTH}
              height={200}
              chartConfig={defaultChartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>
      )}

      {/* Daily Trend */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>最近7天趋势</Text>
        <View style={styles.chartCard}>
          {dailyTrend.datasets[0].data.some((d) => d > 0) ? (
            <BarChart
              data={dailyTrend}
              width={CHART_WIDTH}
              height={200}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={defaultChartConfig}
              verticalLabelRotation={0}
              labelsRotation={0}
              fromZero
              showValuesOnTopOfBars
              style={{ marginLeft: -16 }}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyText}>暂无数据</Text>
            </View>
          )}
        </View>
      </View>

      {/* Tag List */}
      {Object.keys(tagDistribution).length > 0 && (
        <View style={styles.tagListSection}>
          <Text style={styles.chartTitle}>标签详情</Text>
          <View style={styles.tagList}>
            {Object.entries(tagDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([tag, count], index) => (
                <View key={tag} style={styles.tagItem}>
                  <View style={[styles.tagDot, { backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }]} />
                  <Text style={styles.tagName}>#{tag}</Text>
                  <Text style={styles.tagCount}>{count}</Text>
                </View>
              ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  header: {
    padding: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  chartSection: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  chartTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  chartCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  emptyChart: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
  tagListSection: {
    padding: spacing.xl,
    paddingTop: 0,
  },
  tagList: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  tagName: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  tagCount: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.primary,
  },
});
