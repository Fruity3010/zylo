import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import * as Font from 'expo-font';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Flow } from 'react-native-animated-spinkit'

const { width, height } = Dimensions.get('window');

const LoadingScreen = ({ loading }: { loading: boolean }) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const animationProgress = useSharedValue(0);
  const borderRadius = useSharedValue(0);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        Bodwars: require('../../assets/fonts/bodwars.otf'),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);

  useEffect(() => {
    if (loading) {
      animationProgress.value = 0;
      borderRadius.value = 0;
    } else {
      animationProgress.value = withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      });
      borderRadius.value = withTiming(height / 2, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [loading]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -animationProgress.value * height }],
    borderRadius: borderRadius.value / 5,
  }));

  if (!fontLoaded) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.centerText}>Zylo</Text>
      <Text style={styles.text}>Making Life Easy One Errand at a time</Text>
      <Flow  size={30} color="honeydew" style={{ marginTop: 20 }} />
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
