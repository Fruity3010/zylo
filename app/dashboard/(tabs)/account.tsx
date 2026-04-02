import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';

// Mock errander data - Replace with actual API call
const ERRANDER_DATA = {
  tier: 2, // 1-4
  errandsCompleted: 45,
  averageRating: 4.8,
  completionRate: 95,
  totalEarnings: 125000,
  dailyFee: 300,
  advanceLimit: 7000,
  nextTier: {
    tier: 3,
    errandsRequired: 60,
    ratingRequired: 4.2,
    benefits: ['₦25,000 advance limit', 'Same-day payout', 'Corporate errands access'],
  },
};

const TIER_CONFIG = {
  1: { emoji: '🔵', name: 'Starter', color: '#2196F3' },
  2: { emoji: '🟢', name: 'Trusted', color: '#4CAF50' },
  3: { emoji: '🟡', name: 'Verified', color: '#FFC107' },
  4: { emoji: '⭐', name: 'Elite', color: '#FF9800' },
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const isErrander = user?.role === 'errander' || user?.role === 'both';
  const tierConfig = TIER_CONFIG[ERRANDER_DATA.tier as keyof typeof TIER_CONFIG];
  const nextTierConfig = TIER_CONFIG[(ERRANDER_DATA.tier + 1) as keyof typeof TIER_CONFIG];
  const progressPercent = (ERRANDER_DATA.errandsCompleted / ERRANDER_DATA.nextTier.errandsRequired) * 100;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Account</Text>
      </View>

      {/* Profile Section */}
      <View style={[styles.profileSection, { backgroundColor: colors.surface }]}>
        <View style={[styles.avatar, { backgroundColor: colors.surfaceSecondary }]}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{user?.full_name || 'User'}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>

        {isErrander ? (
          <View style={[styles.tierBadge, { backgroundColor: tierConfig.color }]}>
            <Text style={styles.tierEmoji}>{tierConfig.emoji}</Text>
            <Text style={styles.tierText}>{tierConfig.name}</Text>
          </View>
        ) : (
          <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
          </View>
        )}

        {isErrander && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {ERRANDER_DATA.errandsCompleted}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Errands</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.ratingRow}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {ERRANDER_DATA.averageRating}
                </Text>
                <Ionicons name="star" size={18} color="#FFC107" />
              </View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {ERRANDER_DATA.completionRate}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Complete</Text>
            </View>
          </View>
        )}
      </View>

      {/* Tier Progress Card - Only for Erranders */}
      {isErrander && ERRANDER_DATA.tier < 4 && (
        <View style={[styles.tierProgressCard, { backgroundColor: colors.surface }]}>
          <View style={styles.tierProgressHeader}>
            <Text style={[styles.tierProgressTitle, { color: colors.text }]}>
              Tier Progress
            </Text>
            <View style={[styles.nextTierBadge, { backgroundColor: nextTierConfig.color }]}>
              <Text style={styles.nextTierText}>
                {nextTierConfig.emoji} {nextTierConfig.name}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: nextTierConfig.color, width: `${Math.min(progressPercent, 100)}%` },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {ERRANDER_DATA.errandsCompleted} / {ERRANDER_DATA.nextTier.errandsRequired} errands
            </Text>
          </View>

          {/* Requirements */}
          <View style={styles.requirementsBox}>
            <Text style={[styles.requirementsTitle, { color: colors.text }]}>
              To unlock Tier {ERRANDER_DATA.tier + 1}:
            </Text>
            <View style={styles.requirementRow}>
              <Ionicons
                name={ERRANDER_DATA.errandsCompleted >= ERRANDER_DATA.nextTier.errandsRequired ? 'checkmark-circle' : 'radio-button-off'}
                size={18}
                color={ERRANDER_DATA.errandsCompleted >= ERRANDER_DATA.nextTier.errandsRequired ? '#4CAF50' : colors.textTertiary}
              />
              <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
                Complete {ERRANDER_DATA.nextTier.errandsRequired} errands
              </Text>
            </View>
            <View style={styles.requirementRow}>
              <Ionicons
                name={ERRANDER_DATA.averageRating >= ERRANDER_DATA.nextTier.ratingRequired ? 'checkmark-circle' : 'radio-button-off'}
                size={18}
                color={ERRANDER_DATA.averageRating >= ERRANDER_DATA.nextTier.ratingRequired ? '#4CAF50' : colors.textTertiary}
              />
              <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
                Maintain {ERRANDER_DATA.nextTier.ratingRequired}+ star rating
              </Text>
            </View>
            <View style={styles.requirementRow}>
              <Ionicons name="radio-button-off" size={18} color={colors.textTertiary} />
              <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
                Complete KYC verification
              </Text>
            </View>
          </View>

          {/* Benefits Preview */}
          <View style={[styles.benefitsBox, { backgroundColor: colors.surfaceSecondary }]}>
            <Text style={[styles.benefitsTitle, { color: colors.text }]}>
              Unlock these benefits:
            </Text>
            {ERRANDER_DATA.nextTier.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <Ionicons name="star" size={14} color={nextTierConfig.color} />
                <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Errander-specific Settings */}
      {isErrander && (
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>
            ERRANDER SETTINGS
          </Text>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <Ionicons name="wallet-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>Bank Account</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <Ionicons name="card-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>Payout History</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <Ionicons name="document-text-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>KYC Documents</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      )}

      {/* General Settings */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>
          GENERAL
        </Text>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <Ionicons name="person-outline" size={24} color={colors.primary} />
          <Text style={[styles.menuText, { color: colors.text }]}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          <Text style={[styles.menuText, { color: colors.text }]}>Notifications</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
          <Text style={[styles.menuText, { color: colors.text }]}>Privacy & Security</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={[styles.menuText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  profileSection: {
    alignItems: 'center',
    padding: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    marginBottom: 10,
  },
  roleBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 15,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 20,
  },
  tierEmoji: {
    fontSize: 16,
  },
  tierText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tierProgressCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  tierProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierProgressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextTierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  nextTierText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  requirementsBox: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
  },
  benefitsBox: {
    padding: 12,
    borderRadius: 8,
  },
  benefitsTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 12,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
});
