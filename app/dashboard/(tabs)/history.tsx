import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';

// Mock data - Replace with actual API call
const MOCK_COMPLETED_ERRANDS = [
  {
    id: '1',
    title: 'Buy fuel at Shell station',
    category: 'Fuel & Energy',
    workmanship: 2000,
    itemCost: 10000,
    platformFee: 300,
    netEarnings: 1700,
    completedAt: 'Today, 2:30 PM',
    date: '2026-02-23',
    sender: { name: 'John Doe', rating: 5 },
    myRating: 5,
    status: 'completed',
  },
  {
    id: '2',
    title: 'Grocery shopping at Bodija Market',
    category: 'Shopping & Groceries',
    workmanship: 1500,
    itemCost: 5000,
    platformFee: 300,
    netEarnings: 1200,
    completedAt: 'Yesterday, 11:45 AM',
    date: '2026-02-22',
    sender: { name: 'Mary Jane', rating: 5 },
    myRating: 5,
    status: 'completed',
  },
  {
    id: '3',
    title: 'Banking errand at GT Bank',
    category: 'Banking & Payments',
    workmanship: 1000,
    itemCost: 0,
    platformFee: 300,
    netEarnings: 700,
    completedAt: 'Feb 21, 4:00 PM',
    date: '2026-02-21',
    sender: { name: 'Corporate Ltd', rating: 4 },
    myRating: 5,
    status: 'completed',
  },
];

const EARNINGS_SUMMARY = {
  today: 1700,
  thisWeek: 4600,
  thisMonth: 12500,
  totalErrands: 8,
  averageRating: 4.9,
};

export default function ErrandHistoryPage() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');

  const isErrander = user?.role === 'errander' || user?.role === 'both';

  const getEarningsForPeriod = () => {
    switch (selectedPeriod) {
      case 'today':
        return EARNINGS_SUMMARY.today;
      case 'week':
        return EARNINGS_SUMMARY.thisWeek;
      case 'month':
        return EARNINGS_SUMMARY.thisMonth;
      default:
        return 0;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={14}
        color="#FFC107"
      />
    ));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.primary }]}>History</Text>
      </View>

      {isErrander && MOCK_COMPLETED_ERRANDS.length > 0 && (
        <>
          {/* Earnings Summary Card */}
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Earnings Summary</Text>

            {/* Period Selector */}
            <View style={styles.periodSelector}>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === 'today' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSelectedPeriod('today')}
              >
                <Text
                  style={[
                    styles.periodText,
                    { color: selectedPeriod === 'today' ? 'white' : colors.textSecondary },
                  ]}
                >
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === 'week' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSelectedPeriod('week')}
              >
                <Text
                  style={[
                    styles.periodText,
                    { color: selectedPeriod === 'week' ? 'white' : colors.textSecondary },
                  ]}
                >
                  This Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === 'month' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSelectedPeriod('month')}
              >
                <Text
                  style={[
                    styles.periodText,
                    { color: selectedPeriod === 'month' ? 'white' : colors.textSecondary },
                  ]}
                >
                  This Month
                </Text>
              </TouchableOpacity>
            </View>

            {/* Earnings Amount */}
            <View style={styles.earningsDisplay}>
              <Text style={[styles.earningsLabel, { color: colors.textSecondary }]}>
                Net Earnings
              </Text>
              <Text style={[styles.earningsAmount, { color: colors.primary }]}>
                ₦{getEarningsForPeriod().toLocaleString()}
              </Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {EARNINGS_SUMMARY.totalErrands}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Errands
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <View style={styles.ratingRow}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {EARNINGS_SUMMARY.averageRating}
                  </Text>
                  <Ionicons name="star" size={16} color="#FFC107" />
                </View>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Avg Rating
                </Text>
              </View>
            </View>
          </View>

          {/* Completed Errands List */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Completed Errands
            </Text>

            {MOCK_COMPLETED_ERRANDS.map((errand) => (
              <View
                key={errand.id}
                style={[styles.errandCard, { backgroundColor: colors.surface }]}
              >
                {/* Title & Category */}
                <View style={styles.errandHeader}>
                  <Text style={[styles.errandTitle, { color: colors.text }]} numberOfLines={1}>
                    {errand.title}
                  </Text>
                  <View style={styles.statusBadge}>
                    <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                  </View>
                </View>

                <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                  {errand.category} • {errand.completedAt}
                </Text>

                {/* Earnings Breakdown */}
                <View style={[styles.earningsBreakdown, { backgroundColor: colors.surfaceSecondary }]}>
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                      Workmanship
                    </Text>
                    <Text style={[styles.breakdownValue, { color: colors.text }]}>
                      ₦{errand.workmanship.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                      Platform Fee
                    </Text>
                    <Text style={[styles.breakdownValue, { color: colors.error }]}>
                      -₦{errand.platformFee}
                    </Text>
                  </View>
                  <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                    <Text style={[styles.breakdownLabel, { color: colors.text, fontWeight: 'bold' }]}>
                      Net Earned
                    </Text>
                    <Text style={[styles.netEarnings, { color: colors.primary }]}>
                      ₦{errand.netEarnings.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Sender & Rating */}
                <View style={styles.senderRow}>
                  <View style={[styles.senderAvatar, { backgroundColor: colors.surfaceSecondary }]}>
                    <Ionicons name="person" size={16} color={colors.primary} />
                  </View>
                  <View style={styles.senderInfo}>
                    <Text style={[styles.senderName, { color: colors.text }]}>
                      {errand.sender.name}
                    </Text>
                    <View style={styles.starsRow}>
                      {renderStars(errand.sender.rating)}
                    </View>
                  </View>
                  <View style={styles.myRating}>
                    <Text style={[styles.myRatingLabel, { color: colors.textTertiary }]}>
                      You rated
                    </Text>
                    <View style={styles.starsRow}>
                      {renderStars(errand.myRating)}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Empty State */}
      {MOCK_COMPLETED_ERRANDS.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No errand history yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            {isErrander
              ? 'Complete errands to see your earnings history here'
              : 'Your completed and cancelled errands will appear here'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
  },
  earningsDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  earningsLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  errandCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  errandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  errandTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 12,
    marginBottom: 12,
  },
  earningsBreakdown: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  breakdownTotal: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  breakdownLabel: {
    fontSize: 13,
  },
  breakdownValue: {
    fontSize: 13,
  },
  netEarnings: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  senderInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  myRating: {
    alignItems: 'flex-end',
  },
  myRatingLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
