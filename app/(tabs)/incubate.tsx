import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LayoutGrid, Clock, CheckCircle, Layers } from 'lucide-react-native';
import { useStore } from '../../src/store';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width * 0.75;

const COLUMNS = [
  { id: 'raw', title: '待验证', icon: Clock, color: '#F59E0B' },
  { id: 'refined', title: '已定义', icon: CheckCircle, color: '#6366F1' },
  { id: 'incubating', title: '开发中', icon: Layers, color: '#8B5CF6' },
  { id: 'done', title: '已完成', icon: CheckCircle, color: '#10B981' },
];

export default function IncubateScreen() {
  const { painPoints } = useStore();
  const router = useRouter();

  // For demo, we'll show raw and refined items
  const getColumnItems = (status: string) => {
    return painPoints.filter((pp) =>
      status === 'raw' ? pp.status === 'raw' || pp.status === 'refining' :
      status === 'refined' ? pp.status === 'refined' :
      status === 'incubating' ? pp.status === 'incubating' :
      pp.status === 'done'
    );
  };

  const handleCardPress = (id: string, status: string) => {
    if (status === 'raw' || status === 'refining') {
      router.push(`/refine/${id}`);
    }
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
                    <TouchableOpacity
                      key={pp.id}
                      style={styles.card}
                      onPress={() => handleCardPress(pp.id, column.id)}
                    >
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
                    </TouchableOpacity>
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
    backgroundColor: '#F3F4F6',
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 16,
    maxHeight: '100%',
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  badge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  columnContent: {
    flex: 1,
    padding: 8,
  },
  emptyColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  cardTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardTagText: {
    fontSize: 10,
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  cardStatus: {
    fontSize: 11,
    color: '#6366F1',
    fontWeight: '500',
  },
});