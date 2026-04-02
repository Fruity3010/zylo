import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import MapView, { Marker, UrlTile, Polyline } from "react-native-maps";
import Icon from "react-native-vector-icons/Feather";
import Colors from "../../../constants/colors";
import { useRouter } from "expo-router";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useTheme } from "../../../contexts/ThemeContext";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { TouchableWithoutFeedback } from "react-native";
import LocationAutocomplete from "../../../src/components/LocationAutocomplete/LocationAutocomplete";
import CategorySelector from "../../../src/components/ErrandForms/CategorySelector";
import FuelEnergyFormNew from "../../../src/components/ErrandForms/FuelEnergyFormNew";
import CourierDeliveryForm from "../../../src/components/ErrandForms/CourierDeliveryForm";
import OthersCustomForm from "../../../src/components/ErrandForms/OthersCustomForm";

const { height } = Dimensions.get("window");

export default function Dashboard() {
  const { colors } = useTheme();

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [pickupLocation, setPickupLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [destinationLocation, setDestinationLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  const [errandTitle, setErrandTitle] = useState("");
  const [errandDescription, setErrandDescription] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [errandImage, setErrandImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["35%", "50%", "85%"], []);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const recenterMap = (coords: { latitude: number; longitude: number }) => {
    const LATITUDE_OFFSET = 0.03;

    mapRef.current?.animateToRegion(
      {
        latitude: coords.latitude - LATITUDE_OFFSET,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1000
    );
  };

  const fetchRoute = async (
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number }
  ) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map(
          (coord: [number, number]) => ({
            latitude: coord[1],
            longitude: coord[0],
          })
        );

        setRouteCoordinates(coords);

        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationMin = Math.round(route.duration / 60);

        setRouteInfo({
          distance: `${distanceKm} km`,
          duration: `${durationMin} min`,
        });
      }
    } catch (error) {
      console.error("Route fetch error:", error);
    }
  };


  const handlePickupSelect = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setPickupLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setPickupAddress(location.address);

    if (destinationLocation) {
      fetchRoute(
        { latitude: location.latitude, longitude: location.longitude },
        destinationLocation
      );
    }
  };

  const handleDestinationSelect = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setDestinationAddress(location.address);

    if (pickupLocation) {
      fetchRoute(pickupLocation, {
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }

    recenterMap({ latitude: location.latitude, longitude: location.longitude });
  };

  const useCurrentLocation = async () => {
    if (!userLocation) {
      console.warn("User location not available");
      return;
    }

    setPickupLocation(userLocation);
    setPickupAddress("Current Location");
    recenterMap(userLocation);

    if (destinationLocation) {
      fetchRoute(userLocation, destinationLocation);
    }
  };

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert(
        "Permission to access media library is required to upload an image."
      );
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setErrandImage(pickerResult.assets[0].uri);
    }
  };


  useEffect(() => {
    if (isInputFocused) {
      bottomSheetRef.current?.snapToIndex(1);
    }
  }, [isInputFocused]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(coords);
      setPickupLocation(coords);
      setPickupAddress("Current Location");
      recenterMap(coords);
    })();
  }, []);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setCurrentStep(1);
    bottomSheetRef.current?.snapToIndex(2); // Expand to 85%
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep === 1) {
      setActiveCategory(null);
      setCurrentStep(0);
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePostErrand = () => {
    console.log("Posting errand with data:", {
      title: errandTitle,
      description: errandDescription,
      pickup: { location: pickupLocation, address: pickupAddress },
      destination: { location: destinationLocation, address: destinationAddress },
      image: errandImage,
      category: activeCategory,
      routeInfo,
    });

    setErrandTitle("");
    setErrandDescription("");
    setPickupAddress("");
    setDestinationAddress("");
    setErrandImage(null);
    setActiveCategory(null);
    setCurrentStep(0);
    setDestinationLocation(null);
    setRouteCoordinates([]);
    setRouteInfo(null);

    bottomSheetRef.current?.snapToIndex(0);
    Keyboard.dismiss();
    setIsInputFocused(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: userLocation?.latitude || 6.5244,
            longitude: userLocation?.longitude || 3.3792,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <UrlTile
            urlTemplate={`https://tiles.stadiamaps.com/tiles/${colors.mapTileTheme}/{z}/{x}/{y}{r}.png`}
            maximumZ={20}
            tileSize={256}
          />
          {userLocation && (
            <Marker coordinate={userLocation}>
              <Image
                source={{
                  uri: "https://cdn3d.iconscout.com/3d/premium/thumb/delivery-man-holding-package-box-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--carrying-parcel-lifting-cardboard-courier-pack-e-commerce-shopping-illustrations-7629778.png",
                }}
                style={{ width: 60, height: 60 }}
                resizeMode="contain"
              />
            </Marker>
          )}
          {pickupLocation && pickupLocation !== userLocation && (
            <Marker coordinate={pickupLocation}>
              <View style={styles.pickupMarker}>
                <Icon name="map-pin" size={20} color="white" />
              </View>
            </Marker>
          )}
          {destinationLocation && (
            <Marker coordinate={destinationLocation} pinColor={colors.primary} />
          )}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={colors.primary}
              strokeWidth={4}
            />
          )}
        </MapView>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          backgroundStyle={{ backgroundColor: colors.surface }}
          handleIndicatorStyle={{ backgroundColor: colors.primary }}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            {!activeCategory && (
              <CategorySelector
                activeCategory={activeCategory}
                onSelectCategory={handleCategorySelect}
              />
            )}

            {activeCategory === "Fuel & Energy" && (
              <FuelEnergyFormNew
                step={currentStep}
                userLocation={userLocation}
                onNext={handleNextStep}
                onBack={handlePreviousStep}
                onPost={handlePostErrand}
              />
            )}

            {activeCategory === "Courier & Deliveries" && (
              <CourierDeliveryForm
                step={currentStep}
                errandTitle={errandTitle}
                pickupAddress={pickupAddress}
                destinationAddress={destinationAddress}
                errandDescription={errandDescription}
                routeInfo={routeInfo}
                setErrandTitle={setErrandTitle}
                setPickupAddress={setPickupAddress}
                setDestinationAddress={setDestinationAddress}
                setErrandDescription={setErrandDescription}
                onPickupSelect={handlePickupSelect}
                onDestinationSelect={handleDestinationSelect}
                useCurrentLocation={useCurrentLocation}
                onNext={handleNextStep}
                onBack={handlePreviousStep}
                onPost={handlePostErrand}
              />
            )}

            {(activeCategory === "Office & Work Errands" ||
              activeCategory === "Others/Custom") && (
              <OthersCustomForm
                step={currentStep}
                errandTitle={errandTitle}
                destinationAddress={destinationAddress}
                errandDescription={errandDescription}
                setErrandTitle={setErrandTitle}
                setDestinationAddress={setDestinationAddress}
                setErrandDescription={setErrandDescription}
                onDestinationSelect={handleDestinationSelect}
                onNext={handleNextStep}
                onBack={handlePreviousStep}
                onPost={handlePostErrand}
              />
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.darkBackground },
  map: { width: "100%", height: "100%" },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderRadius: 20,
    paddingBottom: 40,
    backgroundColor: "#181F20",
  },
  sheetText: {
    fontSize: 20,
    color: Colors.honeydew,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#ffffff6d",
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 10,
    marginBottom: 12,
    color: "white",
    fontSize: 16,
    textAlignVertical: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  borderColor: "#ffffff6d",
    paddingHorizontal: 12,
    height: 48,
  },
  inputText: { marginLeft: 10, color: Colors.textDark, fontSize: 16 },
  budgetInput: {
    marginLeft: 10,
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: Colors.lightGreen,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  sendButtonText: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  categoriesRowFixed: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  categoryCardFixed: {
    width: "24%",
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeCategoryCard: {
    backgroundColor: "#092241a9",
    ...Platform.select({
      ios: {
        shadowColor: "#6aff6a65",
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        shadowColor: "#6aff6a65",
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
    }),
  },
  categoryIconFixed: {
    width: "100%",
    height: 70,
    marginBottom: 6,
  },
  categoryTextFixed: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 12,
    color: "white",
  },
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.lightGreen,
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    backgroundColor: Colors.darkBackground,
  },
  imageUploadText: {
    color: Colors.lightGreen,
    marginLeft: 10,
    fontSize: 16,
  },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: "center",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    backgroundColor: Colors.darkerGrey,
    width: 48, // A fixed width is needed for a circle
    height: 48, // Height must match width
    borderRadius: 24,
    borderWidth: 1, // Add this line
    borderColor: Colors.lightGreen, // Add this line
    paddingVertical: 0,
  },

  postButton: {
    backgroundColor: Colors.lightGreen,
    width: "75%",
  },
  routeInfoContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGreen,
  },
  routeInfoText: {
    color: Colors.honeydew,
    fontSize: 14,
    textAlign: "center",
  },
  labelText: {
    color: Colors.honeydew,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  currentLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  currentLocationText: {
    color: Colors.lightGreen,
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
  pickupMarker: {
    backgroundColor: "#4169E1",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
});
