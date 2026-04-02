import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ErrandNotificationProps {
  errand: {
    id: string;
    title: string;
    category: string;
    workmanship: number;
    distance: number;
  };
  onView: () => void;
  onDismiss: () => void;
}

export default function ErrandNotificationBanner({ errand, onView, onDismiss }: ErrandNotificationProps) {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Slide in animation
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-dismiss after 8 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Alert Icon */}
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
        <View style={[styles.icon, { backgroundColor: colors.primary }]}>
          <Ionicons name="flash" size={24} color="white" />
        </View>
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.badge, { color: colors.primary }]}>NEW ERRAND</Text>
          <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {errand.title}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="pricetag" size={14} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {errand.category}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={14} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {errand.distance} km away
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            ₦{errand.workmanship.toLocaleString()}
          </Text>
          <TouchableOpacity
            style={[styles.viewButton, { backgroundColor: colors.primary }]}
            onPress={onView}
          >
            <Text style={styles.viewButtonText}>View Errand</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});
