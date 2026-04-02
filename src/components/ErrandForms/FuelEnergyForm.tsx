import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Colors from "../../../constants/colors";

interface GasStation {
  latitude: number;
  longitude: number;
  name: string;
}

interface FuelEnergyFormProps {
  step: number;
  pickupAddress: string;
  gasStations: GasStation[];
  errandDescription: string;
  setErrandDescription: (text: string) => void;
  onSelectStation: (station: GasStation) => void;
  onNext: () => void;
  onBack: () => void;
  onPost: () => void;
  useCurrentLocation: () => void;
}

export default function FuelEnergyForm({
  step,
  pickupAddress,
  gasStations,
  errandDescription,
  setErrandDescription,
  onSelectStation,
  onNext,
  onBack,
  onPost,
  useCurrentLocation,
}: FuelEnergyFormProps) {
  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Location</Text>
        <Text style={styles.subtitle}>Where should we pick up the fuel?</Text>

        <View style={styles.locationDisplay}>
          <Icon name="map-pin" size={20} color={Colors.lightGreen} />
          <Text style={styles.locationText}>
            {pickupAddress || "Getting location..."}
          </Text>
        </View>

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

  if (step === 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Select Gas Station</Text>
        <Text style={styles.subtitle}>Choose a station or tap the map</Text>

        <ScrollView style={styles.stationList} showsVerticalScrollIndicator={false}>
          {gasStations.map((station, index) => (
            <TouchableOpacity
              key={index}
              style={styles.stationItem}
              onPress={() => {
                onSelectStation(station);
                onNext();
              }}
            >
              <Icon name="map-pin" size={18} color={Colors.lightGreen} />
              <Text style={styles.stationName}>{station.name}</Text>
            </TouchableOpacity>
          ))}
          {gasStations.length === 0 && (
            <Text style={styles.noStations}>
              Tap any gas station on the map to select
            </Text>
          )}
        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-left" size={20} color={Colors.honeydew} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={onNext}>
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === 3) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Fuel Details</Text>

        <TextInput
          style={styles.descriptionInput}
          placeholder="e.g., Fill tank, 20 liters of petrol"
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginBottom: 16,
  },
  locationDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffffff6d",
    marginBottom: 12,
  },
  locationText: {
    color: Colors.honeydew,
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
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
  nextButtonFlex: {
    flex: 1,
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
  stationList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  stationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ffffff6d",
  },
  stationName: {
    color: Colors.honeydew,
    fontSize: 14,
    marginLeft: 12,
  },
  noStations: {
    color: Colors.mediumGrey,
    fontSize: 14,
    textAlign: "center",
    padding: 20,
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
  skipButton: {
    flex: 1,
    backgroundColor: Colors.darkerGrey,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGreen,
  },
  postButton: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    paddingVertical: 14,
    borderRadius: 10,
  },
});
