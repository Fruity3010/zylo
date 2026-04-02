import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Colors from "../../../constants/colors";
import LocationAutocomplete from "../LocationAutocomplete/LocationAutocomplete";

interface CourierDeliveryFormProps {
  step: number;
  errandTitle: string;
  pickupAddress: string;
  destinationAddress: string;
  errandDescription: string;
  routeInfo: { distance: string; duration: string } | null;
  setErrandTitle: (text: string) => void;
  setPickupAddress: (text: string) => void;
  setDestinationAddress: (text: string) => void;
  setErrandDescription: (text: string) => void;
  onPickupSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  onDestinationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  useCurrentLocation: () => void;
  onNext: () => void;
  onBack: () => void;
  onPost: () => void;
}

export default function CourierDeliveryForm({
  step,
  errandTitle,
  pickupAddress,
  destinationAddress,
  errandDescription,
  routeInfo,
  setErrandTitle,
  setPickupAddress,
  setDestinationAddress,
  setErrandDescription,
  onPickupSelect,
  onDestinationSelect,
  useCurrentLocation,
  onNext,
  onBack,
  onPost,
}: CourierDeliveryFormProps) {
  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Package Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Documents, Electronics"
          placeholderTextColor={Colors.mediumGrey}
          value={errandTitle}
          onChangeText={setErrandTitle}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-left" size={20} color={Colors.honeydew} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButtonFlex} onPress={onNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pickup Location</Text>
        <LocationAutocomplete
          value={pickupAddress}
          onChangeText={setPickupAddress}
          onSelectLocation={onPickupSelect}
          placeholder="Where to pick up?"
        />

        <TouchableOpacity style={styles.currentLocationButton} onPress={useCurrentLocation}>
          <Icon name="navigation" size={16} color={Colors.lightGreen} />
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-left" size={20} color={Colors.honeydew} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButtonFlex} onPress={onNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === 3) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Delivery Location</Text>
        <LocationAutocomplete
          value={destinationAddress}
          onChangeText={setDestinationAddress}
          onSelectLocation={onDestinationSelect}
          placeholder="Where to deliver?"
        />

        {routeInfo && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeText}>
              📍 {routeInfo.distance} • ⏱️ {routeInfo.duration}
            </Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-left" size={20} color={Colors.honeydew} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButtonFlex} onPress={onNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === 4) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Package Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Describe the package, special instructions, etc."
          placeholderTextColor={Colors.mediumGrey}
          value={errandDescription}
          onChangeText={setErrandDescription}
          multiline
          numberOfLines={4}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-left" size={20} color={Colors.honeydew} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.postButton} onPress={onPost}>
            <Text style={styles.buttonText}>Post Errand</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    color: Colors.honeydew,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#ffffff6d",
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 10,
    marginBottom: 16,
    color: "white",
    fontSize: 16,
  },
  descriptionInput: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#ffffff6d",
    borderRadius: 10,
    padding: 12,
    color: "white",
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  currentLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 16,
  },
  currentLocationText: {
    color: Colors.lightGreen,
    fontSize: 14,
    marginLeft: 6,
  },
  nextButton: {
    backgroundColor: Colors.lightGreen,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  backButton: {
    backgroundColor: Colors.darkerGrey,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.lightGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonFlex: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    paddingVertical: 14,
    borderRadius: 10,
  },
  postButton: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    paddingVertical: 14,
    borderRadius: 10,
  },
  routeInfo: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.lightGreen,
  },
  routeText: {
    color: Colors.honeydew,
    fontSize: 14,
    textAlign: "center",
  },
});
