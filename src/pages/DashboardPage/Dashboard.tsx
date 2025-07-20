import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Keyboard,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import Icon from "react-native-vector-icons/Feather";

const { height } = Dimensions.get("screen");

const Dashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [budget, setBudget] = useState("");

  const toggleSheet = () => {
    setIsInputFocused(!isInputFocused);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.5244,
          longitude: 3.3792,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <UrlTile
          urlTemplate="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maximumZ={19}
          tileSize={256}
        />
        <Marker coordinate={{ latitude: 6.5244, longitude: 3.3792 }}>
          <Image
            source={{
              uri: "https://cdn3d.iconscout.com/3d/premium/thumb/delivery-man-holding-package-box-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--carrying-parcel-lifting-cardboard-courier-pack-e-commerce-shopping-illustrations-7629778.png",
            }}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </Marker>
      </MapView>

      <TouchableOpacity style={styles.menuButton}>
        <Icon name="menu" size={24} color="white" />
      </TouchableOpacity>

      {isModalVisible && (
        <View
          style={[
            styles.fakeBottomSheet,
            { minHeight: isInputFocused ? height * 0.85 : height * 0.5 },
          ]}
        >
          <TouchableOpacity onPress={toggleSheet}>
            <View style={styles.handle} />
          </TouchableOpacity>

          <Text style={styles.sheetText}>Create New Errand</Text>

          <TouchableOpacity style={styles.inputRow}>
            <Icon name="map-pin" size={20} color="lightgreen" />
            <Text style={styles.inputText}>Pickup Location</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputRow}>
            <Icon name="map-pin" size={20} color="lightgreen" />
            <Text style={styles.inputText}>Delivery Location</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#999"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />

          <View style={styles.inputRow}>
            <Icon name="credit-card" size={20} color="lightgreen" />
            <TextInput
              style={styles.budgetInput}
              placeholder="₦0"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={budget}
              onChangeText={setBudget}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
          </View>

          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Post Errand</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#111",
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  fakeBottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    zIndex: 20,
  },
  handle: {
    width: 60,
    height: 5,
    backgroundColor: "lightgreen",
    alignSelf: "center",
    borderRadius: 3,
    marginBottom: 16,
  },
  sheetText: {
    fontSize: 20,
    color: "honeydew",
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "honeydew",
    borderWidth: 1,
    borderColor: "lightgreen",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: "#000",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "honeydew",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "lightgreen",
  },
  inputText: {
    marginLeft: 10,
    color: "#111",
    fontSize: 16,
  },
  budgetInput: {
    marginLeft: 10,
    flex: 1,
    color: "#111",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "lightgreen",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  sendButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Dashboard;
