import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";

interface JyverCardProps {
  imageSrc: any;
  title1: string;
  title2: string;
  description: string;
  onPress?: () => void;
}

const JyverCard = ({
  imageSrc,
  title1,
  title2,
  description,
  onPress,
}: JyverCardProps) => {
  const { width } = useWindowDimensions();
  const cardWidth = width >= 600 ? width / 2 - 30 : width - 40;

  const [isNavigating, setIsNavigating] = useState(false);

  const handlePress = () => {
    if (isNavigating) return; 
    setIsNavigating(true);
    onPress?.();
    setTimeout(() => setIsNavigating(false), 500); 
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      disabled={isNavigating} 
    >
      <View style={[styles.card, { width: cardWidth }]}>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, { backgroundColor: "#ff5f56" }]} />
          <View style={[styles.dot, { backgroundColor: "#ffbd2e" }]} />
          <View style={[styles.dot, { backgroundColor: "#27c93f" }]} />
        </View>

        <View style={styles.content}>
          <View style={styles.imageWrapper}>
            <Image source={imageSrc} style={styles.image} resizeMode="cover" />
          </View>
          <Text style={styles.title}>{title1}</Text>
          <Text style={styles.title2}>{title2}</Text>
          <Text style={styles.desc}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    maxWidth: "100%",
    minHeight: 300,
    margin: 8,
    alignItems: "center",
    shadowColor: "rgba(144, 238, 144, 0.19)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 12,
    left: 12,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    alignItems: "center",
    marginTop: 20,
  },
  imageWrapper: {
    maxWidth: 100,
    maxHeight: 100,
    minWidth: 100,
    minHeight: 100,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#F0FFF0",
    marginTop: 2,
    textAlign: "center",
  },
  title2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "lightgreen",
    marginTop: 2,
    textAlign: "center",
  },
  desc: {
    fontSize: 14,
    color: "#708090",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 8,
  },
});

export default JyverCard;
