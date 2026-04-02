import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Colors from "../../../constants/colors";
import MapLocationSearch from "../MapLocationSearch/MapLocationSearch";

interface FuelEnergyFormProps {
  step: number;
  userLocation: { latitude: number; longitude: number } | null;
  onNext: () => void;
  onBack: () => void;
  onPost: (data: any) => void;
}

export default function FuelEnergyFormNew({
  step,
  userLocation,
  onNext,
  onBack,
  onPost,
}: FuelEnergyFormProps) {
  // Step 1: Task Type
  const [taskType, setTaskType] = useState<"fuel" | "gas" | null>(null);

  // Step 2: Task Details
  const [fuelType, setFuelType] = useState<"petrol" | "diesel">("petrol");
  const [quantity, setQuantity] = useState("");
  const [preferredStation, setPreferredStation] = useState("");
  const [cylinderSize, setCylinderSize] = useState("12.5kg");
  const [taskNote, setTaskNote] = useState("");

  // Step 3: Pickup & Delivery
  const [useNearbyVendor, setUseNearbyVendor] = useState(true);
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupLandmark, setPickupLandmark] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryLandmark, setDeliveryLandmark] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Step 4: Price
  const [offerPrice, setOfferPrice] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [allowCounterOffer, setAllowCounterOffer] = useState(true);

  // STEP 1: Choose Task Type
  if (step === 1) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose Errand Type</Text>
        <Text style={styles.subtitle}>What do you need?</Text>

        <TouchableOpacity
          style={[
            styles.taskTypeCard,
            taskType === "fuel" && styles.taskTypeCardActive,
          ]}
          onPress={() => setTaskType("fuel")}
        >
          <View style={styles.taskTypeIcon}>
            <Text style={styles.taskTypeEmoji}>⛽</Text>
          </View>
          <View style={styles.taskTypeContent}>
            <Text style={styles.taskTypeTitle}>Buy Fuel</Text>
            <Text style={styles.taskTypeDesc}>Petrol or Diesel</Text>
          </View>
          {taskType === "fuel" && (
            <Icon name="check-circle" size={24} color={Colors.honeydew} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.taskTypeCard,
            taskType === "gas" && styles.taskTypeCardActive,
          ]}
          onPress={() => setTaskType("gas")}
        >
          <View style={styles.taskTypeIcon}>
            <Text style={styles.taskTypeEmoji}>🔥</Text>
          </View>
          <View style={styles.taskTypeContent}>
            <Text style={styles.taskTypeTitle}>Refill Gas Cylinder</Text>
            <Text style={styles.taskTypeDesc}>Cooking gas</Text>
          </View>
          {taskType === "gas" && (
            <Icon name="check-circle" size={24} color={Colors.honeydew} />
          )}
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-left" size={20} color={Colors.honeydew} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextButton, !taskType && styles.buttonDisabled]}
            onPress={onNext}
            disabled={!taskType}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // STEP 2: Task Details
  if (step === 2) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Task Details</Text>

        {taskType === "fuel" ? (
          <>
            <Text style={styles.label}>Fuel Type</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioOption,
                  fuelType === "petrol" && styles.radioOptionActive,
                ]}
                onPress={() => setFuelType("petrol")}
              >
                <Text
                  style={[
                    styles.radioText,
                    fuelType === "petrol" && styles.radioTextActive,
                  ]}
                >
                  ⛽ Petrol
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioOption,
                  fuelType === "diesel" && styles.radioOptionActive,
                ]}
                onPress={() => setFuelType("diesel")}
              >
                <Text
                  style={[
                    styles.radioText,
                    fuelType === "diesel" && styles.radioTextActive,
                  ]}
                >
                  🛢️ Diesel
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Quantity (litres)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 20"
              placeholderTextColor={Colors.mediumGrey}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Preferred Station (Optional)</Text>
            <MapLocationSearch
              value={preferredStation}
              onChangeText={setPreferredStation}
              onSelectLocation={(loc) => setPreferredStation(loc.name)}
              mapCenter={userLocation}
              locationFilter="fuel"
              placeholder="Search for fuel stations nearby"
            />

            <Text style={styles.label}>Extra Note (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., Bring 20L jerrycan"
              placeholderTextColor={Colors.mediumGrey}
              value={taskNote}
              onChangeText={setTaskNote}
              multiline
              numberOfLines={3}
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>Cylinder Size</Text>
            <View style={styles.radioGroup}>
              {["6kg", "12.5kg", "25kg"].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.radioOption,
                    cylinderSize === size && styles.radioOptionActive,
                  ]}
                  onPress={() => setCylinderSize(size)}
                >
                  <Text
                    style={[
                      styles.radioText,
                      cylinderSize === size && styles.radioTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Note (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., My cylinder is empty, call when close"
              placeholderTextColor={Colors.mediumGrey}
              value={taskNote}
              onChangeText={setTaskNote}
              multiline
              numberOfLines={3}
            />
          </>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-left" size={20} color={Colors.honeydew} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // STEP 3: Pickup & Delivery
  if (step === 3) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Pickup & Delivery</Text>

        <Text style={styles.sectionTitle}>Pickup Location</Text>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setUseNearbyVendor(!useNearbyVendor)}
        >
          <Icon
            name={useNearbyVendor ? "check-square" : "square"}
            size={20}
            color={Colors.honeydew}
          />
          <Text style={styles.checkboxText}>
            Runner should buy from any nearby vendor
          </Text>
        </TouchableOpacity>

        {!useNearbyVendor && (
          <>
            <Text style={styles.label}>Vendor Address</Text>
            <MapLocationSearch
              value={pickupAddress}
              onChangeText={setPickupAddress}
              onSelectLocation={(loc) => setPickupAddress(loc.name)}
              mapCenter={userLocation}
              placeholder="Enter vendor address"
            />

            <Text style={styles.label}>Landmark (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Opposite Mobil filling station"
              placeholderTextColor={Colors.mediumGrey}
              value={pickupLandmark}
              onChangeText={setPickupLandmark}
            />
          </>
        )}

        <Text style={styles.sectionTitle}>Delivery Location</Text>
        <MapLocationSearch
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
          onSelectLocation={(loc) => setDeliveryAddress(loc.name)}
          mapCenter={userLocation}
          placeholder="Where should we deliver?"
        />

        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={() => setDeliveryAddress("Current Location")}
        >
          <Icon name="navigation" size={16} color={Colors.honeydew} />
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Landmark (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., White gate, third floor"
          placeholderTextColor={Colors.mediumGrey}
          value={deliveryLandmark}
          onChangeText={setDeliveryLandmark}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+234"
          placeholderTextColor={Colors.mediumGrey}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-left" size={20} color={Colors.honeydew} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // STEP 4: Offer Price
  if (step === 4) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Offer Price</Text>
        <Text style={styles.subtitle}>How much will you pay the runner?</Text>

        <Text style={styles.label}>Your Offer (₦)</Text>
        <View style={styles.priceInputContainer}>
          <Text style={styles.currencySymbol}>₦</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="0"
            placeholderTextColor={Colors.mediumGrey}
            value={offerPrice}
            onChangeText={setOfferPrice}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>Add Tip (Optional)</Text>
        <View style={styles.priceInputContainer}>
          <Text style={styles.currencySymbol}>₦</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="0"
            placeholderTextColor={Colors.mediumGrey}
            value={tipAmount}
            onChangeText={setTipAmount}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAllowCounterOffer(!allowCounterOffer)}
        >
          <Icon
            name={allowCounterOffer ? "check-square" : "square"}
            size={20}
            color={Colors.honeydew}
          />
          <Text style={styles.checkboxText}>Runner can counter-offer</Text>
        </TouchableOpacity>

        <View style={styles.tipBox}>
          <Icon name="info" size={16} color={Colors.honeydew} />
          <Text style={styles.tipText}>
            ⚖️ Typical errands cost ₦1000–₦2500 depending on distance.
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-left" size={20} color={Colors.honeydew} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.buttonText}>Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // STEP 5: Review & Post
  if (step === 5) {
    const totalPrice =
      (parseInt(offerPrice) || 0) + (parseInt(tipAmount) || 0);

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Review & Post</Text>

        <View style={styles.reviewCard}>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Task Type:</Text>
            <Text style={styles.reviewValue}>
              {taskType === "fuel" ? "Buy Fuel" : "Refill Gas Cylinder"}
            </Text>
          </View>

          {taskType === "fuel" ? (
            <>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Fuel Type:</Text>
                <Text style={styles.reviewValue}>{fuelType}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Quantity:</Text>
                <Text style={styles.reviewValue}>{quantity} litres</Text>
              </View>
              {preferredStation && (
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Station:</Text>
                  <Text style={styles.reviewValue}>{preferredStation}</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Cylinder Size:</Text>
              <Text style={styles.reviewValue}>{cylinderSize}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Pickup:</Text>
            <Text style={styles.reviewValue}>
              {useNearbyVendor ? "Any nearby vendor" : pickupAddress}
            </Text>
          </View>

          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Delivery:</Text>
            <Text style={styles.reviewValue}>{deliveryAddress}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Your Offer:</Text>
            <Text style={styles.reviewValueBold}>₦{totalPrice}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-left" size={20} color={Colors.honeydew} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => {
              onPost({
                taskType,
                fuelType,
                quantity,
                preferredStation,
                cylinderSize,
                taskNote,
                useNearbyVendor,
                pickupAddress,
                pickupLandmark,
                deliveryAddress,
                deliveryLandmark,
                phoneNumber,
                offerPrice,
                tipAmount,
                allowCounterOffer,
              });
            }}
          >
            <Text style={styles.buttonText}>Post Errand</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    fontSize: 22,
    color: Colors.honeydew,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.honeydew,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: Colors.honeydew,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  taskTypeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#2a2a2a",
  },
  taskTypeCardActive: {
    borderColor: Colors.honeydew,
    backgroundColor: "#252525",
  },
  taskTypeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  taskTypeEmoji: {
    fontSize: 32,
  },
  taskTypeContent: {
    flex: 1,
  },
  taskTypeTitle: {
    fontSize: 16,
    color: Colors.honeydew,
    fontWeight: "600",
    marginBottom: 4,
  },
  taskTypeDesc: {
    fontSize: 13,
    color: Colors.mediumGrey,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  radioOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    alignItems: "center",
  },
  radioOptionActive: {
    backgroundColor: Colors.honeydew,
    borderColor: Colors.honeydew,
  },
  radioText: {
    color: Colors.honeydew,
    fontSize: 14,
    fontWeight: "600",
  },
  radioTextActive: {
    color: Colors.textDark,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 10,
    marginBottom: 12,
    color: Colors.honeydew,
    fontSize: 16,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  checkboxText: {
    color: Colors.honeydew,
    fontSize: 14,
    flex: 1,
  },
  currentLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 12,
  },
  currentLocationText: {
    color: Colors.honeydew,
    fontSize: 14,
    marginLeft: 6,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  currencySymbol: {
    color: Colors.honeydew,
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    height: 48,
    color: Colors.honeydew,
    fontSize: 18,
    fontWeight: "600",
  },
  tipBox: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    marginTop: 8,
    marginBottom: 16,
    gap: 10,
  },
  tipText: {
    color: Colors.honeydew,
    fontSize: 13,
    flex: 1,
  },
  reviewCard: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  reviewLabel: {
    color: Colors.mediumGrey,
    fontSize: 14,
  },
  reviewValue: {
    color: Colors.honeydew,
    fontSize: 14,
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  reviewValueBold: {
    color: Colors.honeydew,
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ffffff1a",
    marginVertical: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.darkerGrey,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.honeydew,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    flex: 1,
    backgroundColor: Colors.honeydew,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  postButton: {
    flex: 1,
    backgroundColor: Colors.honeydew,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: Colors.mediumGrey,
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: "600",
  },
});
