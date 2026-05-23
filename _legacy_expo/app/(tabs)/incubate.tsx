import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Clock, CheckCircle } from 'lucide-react-native';
import { useStore } from '../../src/store';
import { colors, spacing, borderRadius, fontSize } from '../../src/constants/theme';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width * 0.75;

const COLUMNS = [
  { id: 'raw', title: '待验证', icon: Clock, color: colors.warning },
  { id: 'refined', title: '已定义', icon: CheckCircle, color: colors.primary },
];

export default function IncubateScreen() {
  const { painPoints } = useStore();

  const getColumnItems = (status: string) => {
    return painPoints.filter((pp) =>
      status === 'raw' ? pp.status === 'raw' || pp.status === 'refining' :
      pp.status === 'refined'
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {COLUMNS.map((column) => {
          const items = getColumnItems(column.id);
          const Icon = column.icon;

          return (
            <View key={column.id} style={[styles.column, { width: COLUMN_WIDTH }]}>
              <View style={styles.columnHeader}>
                <Icon size={18} color={column.color} />
                <Text style={[styles.columnTitle, { color: column.color }]}>
                  {column.title}
                </Text>
                <View style={[styles.badge, { backgroundColor: column.color }]}>
                  <Text style={styles.badgeText}>{items.length}</Text>
                </View>
              </View>

              <ScrollView
                style={styles.columnContent}
                showsVerticalScrollIndicator={false}
              >
                {items.length === 0 ? (
                  <View style={styles.emptyColumn}>
                    <Text style={styles.emptyText}>暂无数据</Text>
                  </View>
                ) : (
                  items.map((pp) => (
                    <View key={pp.id} style={styles.card}>
                      <Text style={styles.cardContent} numberOfLines={2}>
                        {pp.raw_content}
                      </Text>
                      {pp.tags && pp.tags.length > 0 && (
                        <View style={styles.cardTags}>
                          {pp.tags.slice(0, 2).map((tag) => (
                            <View key={tag} style={styles.cardTag}>
                              <Text style={styles.cardTagText}>#{tag}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      <View style={styles.cardFooter}>
                        <Text style={styles.cardDate}>
                          {new Date(pp.created_at).toLocaleDateString()}
                        </Text>
                        {pp.refined_story && (
                          <Text style={styles.cardStatus}>已提炼</Text>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  column: {
    flex: 1,
    marginHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    maxHeight: '100%',
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  columnTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  badge: {
    marginLeft: 'auto',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: fontSize.sm,
    color: colors.tagTextSelected,
    fontWeight: '600',
  },
  columnContent: {
    flex: 1,
    padding: spacing.sm,
  },
  emptyColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  cardTag: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  cardTagText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  cardStatus: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
});
