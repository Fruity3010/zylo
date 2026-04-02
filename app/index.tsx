import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import JyverCard from "../src/components/userCard/userCard";
import LoadingScreen from "../src/loaders/loadingScreen";

export default function Home() {
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.fullScreenContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer} style={styles.scrollView}>
        <Text style={styles.title}>Join Zylo</Text>
        <Text style={styles.subtitle}>Choose how you want to get started</Text>
        <Text style={styles.paragraph}>
          Zylo connects senders and erranders in a secure, fast, and efficient
          way. Whether you're looking to get tasks done or earn money helping
          others, we have a place for you.
        </Text>

        <View style={styles.cardSection}>
          <View style={styles.cardWrapper}>
            <View style={styles.cardBox}>
              <JyverCard
                imageSrc={{
                  uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3dEhoGoc4PwxzAHANRVbYjekHZj1E0HU2BA&s",
                }}
                title1="Sign up as"
                title2="Sender"
                onPress={() => router.push("/signup")}
                description="Post errands and get help from trusted erranders across your city."
              />
            </View>
            <View style={styles.cardBox}>
              <JyverCard
                imageSrc={{
                  uri: "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTEyL3Jhd3BpeGVsb2ZmaWNlMTFfYV9ibGFja19kZWxpdmVyeV9tYW5fcG9pbnRpbmdfdG9fdGhlX3NpZGVfd2l0aF9hZTA0ODM5Yy0wNDZlLTQ4Y2EtOGVhYi1lYzgyMDhjZTZhNWUucG5n.png",
                }}
                onPress={() => router.push("/signup")}
                title1="Sign up as"
                title2="Errander"
                description="Accept posted errands and earn cash for helping others."
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.buttonText}>Already have an account?</Text>
        </TouchableOpacity>
      </ScrollView>

      <LoadingScreen isLoading={isLoading} />
    </View>
  );
}



const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#111",
  },
  loadingContentPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#111",
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 24,
  },
  subtitle: {
    color: "honeydew",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.9,
  },
  paragraph: {
    color: "#708090",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    opacity: 0.8,
    paddingHorizontal: 12,
  },
  cardSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginTop: -20,
  },
  title: {
    color: "lightgreen",
    fontSize: 28,
    fontFamily: "Bodwars",
    marginBottom: 5,
  },
  cardBox: {
    maxWidth: "49%",
    minHeight: "50%",
    maxHeight: "70%",
    alignItems: "center",
  },
  cardWrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "lightgreen",
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "lightgreen",
    fontWeight: "bold",
  },
});
