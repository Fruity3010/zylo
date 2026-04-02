import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface NoResponsesModalProps {
  visible: boolean;
  errand: {
    id: string;
    title: string;
    workmanship: number;
    views: number;
  };
  onIncreasePrice: (newPrice: number) => void;
  onMarkUrgent: () => void;
  onExtend: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export default function NoResponsesModal({
  visible,
  errand,
  onIncreasePrice,
  onMarkUrgent,
  onExtend,
  onCancel,
  onClose,
}: NoResponsesModalProps) {
  const { colors } = useTheme();

  const suggestedPrice = Math.ceil(errand.workmanship * 1.3); // +30%

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
            <Ionicons name="time-outline" size={40} color={colors.warning} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            No Responses Yet
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your errand has been up for 8 minutes
          </Text>

          {/* Stats */}
          <View style={[styles.statsContainer, { backgroundColor: colors.background }]}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {errand.views} viewed
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="chatbox-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                0 offers
              </Text>
            </View>
          </View>

          {/* Errand Title */}
          <Text style={[styles.errandTitle, { color: colors.textSecondary }]}>
            "{errand.title}"
          </Text>

          {/* Suggestions */}
          <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
            Suggestions:
          </Text>

          {/* Option 1: Increase Price */}
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: colors.primary }]}
            onPress={() => onIncreasePrice(suggestedPrice)}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="arrow-up-circle" size={24} color="white" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Increase Workmanship</Text>
                <Text style={styles.optionSubtitle}>
                  Try ₦{suggestedPrice.toLocaleString()} (+₦{(suggestedPrice - errand.workmanship).toLocaleString()})
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>

          {/* Option 2: Mark Urgent */}
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: colors.error }]}
            onPress={onMarkUrgent}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="flash" size={24} color="white" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Mark as Urgent</Text>
                <Text style={styles.optionSubtitle}>
                  Add urgency badge (+₦500 fee)
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>

          {/* Option 3: Extend */}
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border }]}
            onPress={onExtend}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="time" size={24} color={colors.primary} />
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Wait 10 More Minutes</Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                  Extend timer once (max 20 min total)
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.border }]}
              onPress={onCancel}
            >
              <Ionicons name="close-circle-outline" size={20} color={colors.error} />
              <Text style={[styles.secondaryButtonText, { color: colors.error }]}>
                Cancel & Refund
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>
                Keep Waiting
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#333',
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
  },
  errandTitle: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  suggestionsTitle: {
    fontSize: 15,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  optionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
