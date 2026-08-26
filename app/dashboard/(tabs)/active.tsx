import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useRouter } from 'expo-router';

// Prototype data until a backend is connected.
const MOCK_ACTIVE_ERRANDS = [
  {
    id: '1',
    title: 'Buy fuel at Shell station',
    status: 'in_progress',
    workmanship: 2000,
    itemCost: 10000,
    pickup: { address: 'Shell Station, Ring Road', latitude: 7.3775, longitude: 3.9470 },
    destination: { address: 'Agodi GRA', latitude: 7.3875, longitude: 3.9570 },
    sender: { name: 'John Doe', phone: '+234 801 234 5678' },
    acceptedAt: '15 mins ago',
    estimatedTime: '45 mins',
  },
];

const STATUS_CONFIG = {
  assigned: {
    color: '#2196F3',
    icon: 'checkmark-circle',
    label: 'Assigned',
    description: 'Head to pickup location',
  },
  in_progress: {
    color: '#FF9800',
    icon: 'hourglass',
    label: 'In Progress',
    description: 'Complete the errand',
  },
  awaiting_confirmation: {
    color: '#9C27B0',
    icon: 'time',
    label: 'Awaiting Confirmation',
    description: 'Waiting for sender to verify',
  },
};

export default function ActiveErrands() {
  const { colors } = useTheme();
  const router = useRouter();

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.assigned;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Active Errands</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {MOCK_ACTIVE_ERRANDS.length} active errand{MOCK_ACTIVE_ERRANDS.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Active Errands List */}
      {MOCK_ACTIVE_ERRANDS.length > 0 ? (
        MOCK_ACTIVE_ERRANDS.map((errand) => {
          const statusConfig = getStatusConfig(errand.status);

          return (
            <View
              key={errand.id}
              style={[styles.errandCard, { backgroundColor: colors.surface, borderLeftColor: statusConfig.color }]}
            >
              {/* Status Badge */}
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
                <Ionicons name={statusConfig.icon as any} size={14} color="white" />
                <Text style={styles.statusText}>{statusConfig.label}</Text>
              </View>

              {/* Title */}
              <Text style={[styles.errandTitle, { color: colors.text }]}>{errand.title}</Text>
              <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
                {statusConfig.description}
              </Text>

              {/* Route Info */}
              <View style={styles.routeContainer}>
                <View style={styles.routeRow}>
                  <View style={styles.pickupDot} />
                  <View style={styles.routeInfo}>
                    <Text style={[styles.routeLabel, { color: colors.textSecondary }]}>Pickup</Text>
                    <Text style={[styles.routeAddress, { color: colors.text }]}>
                      {errand.pickup.address}
                    </Text>
                  </View>
                </View>

                <View style={[styles.routeLine, { backgroundColor: colors.border }]} />

                <View style={styles.routeRow}>
                  <View style={[styles.destinationDot, { backgroundColor: colors.primary }]} />
                  <View style={styles.routeInfo}>
                    <Text style={[styles.routeLabel, { color: colors.textSecondary }]}>Destination</Text>
                    <Text style={[styles.routeAddress, { color: colors.text }]}>
                      {errand.destination.address}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Earnings */}
              <View style={[styles.earningsRow, { backgroundColor: colors.surfaceSecondary }]}>
                <View>
                  <Text style={[styles.earningsLabel, { color: colors.textSecondary }]}>
                    You'll earn
                  </Text>
                  <Text style={[styles.earningsAmount, { color: colors.primary }]}>
                    ₦{errand.workmanship.toLocaleString()}
                  </Text>
                </View>
                {errand.itemCost > 0 && (
                  <View>
                    <Text style={[styles.earningsLabel, { color: colors.textSecondary }]}>
                      Item cost
                    </Text>
                    <Text style={[styles.itemAmount, { color: colors.text }]}>
                      ₦{errand.itemCost.toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Sender Info */}
              <View style={[styles.senderRow, { borderTopColor: colors.border }]}>
                <View style={[styles.senderAvatar, { backgroundColor: colors.surfaceSecondary }]}>
                  <Ionicons name="person" size={20} color={colors.primary} />
                </View>
                <View style={styles.senderInfo}>
                  <Text style={[styles.senderName, { color: colors.text }]}>{errand.sender.name}</Text>
                  <Text style={[styles.senderPhone, { color: colors.textSecondary }]}>
                    {errand.sender.phone}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.callButton, { backgroundColor: colors.primary }]}
                  onPress={() => console.log('Call sender')}
                >
                  <Ionicons name="call" size={16} color="white" />
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.chatButton, { backgroundColor: colors.surfaceSecondary }]}
                  onPress={() => console.log('Chat with sender')}
                >
                  <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
                  <Text style={[styles.buttonText, { color: colors.primary }]}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navigateButton, { backgroundColor: colors.surfaceSecondary }]}
                  onPress={() => console.log('Navigate to location')}
                >
                  <Ionicons name="navigate-outline" size={18} color={colors.primary} />
                  <Text style={[styles.buttonText, { color: colors.primary }]}>Navigate</Text>
                </TouchableOpacity>

                {errand.status === 'in_progress' && (
                  <TouchableOpacity
                    style={[styles.completeButton, { backgroundColor: colors.primary }]}
                    onPress={() => console.log('Mark as complete')}
                  >
                    <Ionicons name="checkmark-done" size={18} color="white" />
                    <Text style={[styles.buttonText, { color: 'white' }]}>Complete</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Time Info */}
              <View style={styles.timeRow}>
                <View style={styles.timeItem}>
                  <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                  <Text style={[styles.timeText, { color: colors.textTertiary }]}>
                    Accepted {errand.acceptedAt}
                  </Text>
                </View>
                <View style={styles.timeItem}>
                  <Ionicons name="hourglass-outline" size={14} color={colors.textTertiary} />
                  <Text style={[styles.timeText, { color: colors.textTertiary }]}>
                    Est. {errand.estimatedTime}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      ) : (
        /* Empty State */
        <View style={styles.emptyState}>
          <Ionicons name="clipboard-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Active Errands
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Browse available errands to get started
          </Text>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/dashboard/(tabs)/browse')}
          >
            <Text style={styles.browseButtonText}>Browse Errands</Text>
          </TouchableOpacity>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  errandCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  errandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 13,
    marginBottom: 16,
  },
  routeContainer: {
    marginBottom: 16,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4169E1',
    marginTop: 4,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  routeLine: {
    width: 2,
    height: 20,
    marginLeft: 5,
    marginVertical: 4,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  earningsLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemAmount: {
    fontSize: 14,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 16,
    borderTopWidth: 1,
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  senderInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  senderPhone: {
    fontSize: 12,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 22,
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 22,
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 22,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 11,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
