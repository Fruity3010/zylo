import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CountdownTimerProps {
  expiresAt: Date;
  onExpire?: () => void;
  warningThreshold?: number; // seconds - when to show warning color
  color?: string;
  warningColor?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function CountdownTimer({
  expiresAt,
  onExpire,
  warningThreshold = 120, // 2 minutes default
  color = '#666',
  warningColor = '#FF6B6B',
  size = 'medium',
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = Math.max(0, expiry - now);

      setTimeRemaining(Math.floor(diff / 1000)); // Convert to seconds

      if (diff === 0 && !isExpired) {
        setIsExpired(true);
        onExpire?.();
      }
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, isExpired, onExpire]);

  const formatTime = (seconds: number): string => {
    if (seconds === 0) return 'Expired';

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarning = timeRemaining <= warningThreshold && timeRemaining > 0;
  const textColor = isExpired ? '#999' : isWarning ? warningColor : color;

  const fontSize = size === 'small' ? 11 : size === 'medium' ? 13 : 15;
  const iconSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;

  return (
    <View style={styles.container}>
      <Ionicons
        name={isExpired ? "time-outline" : isWarning ? "warning" : "time"}
        size={iconSize}
        color={textColor}
      />
      <Text style={[styles.timeText, { color: textColor, fontSize }]}>
        {isExpired ? 'Expired' : `Expires in ${formatTime(timeRemaining)}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontWeight: '600',
  },
});
