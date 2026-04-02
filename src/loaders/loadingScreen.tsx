import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Flow } from 'react-native-animated-spinkit';

const { height } = Dimensions.get('window');

const LoadingScreen = ({ isLoading }: { isLoading: boolean }) => {
  const [visible, setVisible] = useState(isLoading);
  const animationProgress = useSharedValue(0);
  const borderRadius = useSharedValue(0);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      animationProgress.value = 0;
      borderRadius.value = 0;
    } else {
      animationProgress.value = withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }, (finished) => {
        if (finished) runOnJS(setVisible)(false);
      });

      borderRadius.value = withTiming(height / 2, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [isLoading]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -animationProgress.value * height }],
    borderRadius: borderRadius.value / 5,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.centerText}>Zylo</Text>
      <Text style={styles.text}>Making Life Easy One Errand at a time</Text>
      <Flow size={30} color="honeydew" style={{ marginTop: 20 }} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerText: {
    position: 'absolute',
    color: 'darkgreen',
    fontSize: 32,
    fontFamily: 'Bodwars',
  },
  text: {
    marginTop: 80,
    color: 'honeydew',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Bodwars',
  },
});

export default LoadingScreen;
