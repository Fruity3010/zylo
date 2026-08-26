import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import ErrandNotificationBanner from '../../../components/ErrandNotificationBanner';
import CountdownTimer from '../../../components/CountdownTimer';
import NoResponsesModal from '../../../components/NoResponsesModal';

const { height } = Dimensions.get('window');

// Prototype errand feed with client-side expiry behavior.
const MOCK_ERRANDS = [
  {
    id: '1',
    title: 'Buy fuel at Shell station',
    category: 'Fuel & Energy',
    workmanship: 2000,
    itemCost: 10000,
    distance: 3.2,
    pickup: { latitude: 7.3775, longitude: 3.9470, address: 'Shell Station, Ring Road' },
    destination: { latitude: 7.3875, longitude: 3.9570, address: 'Agodi GRA' },
    sender: { name: 'John Doe', rating: 4.5, tier: 2 },
    views: 12,
    urgency: 'normal' as const,
    createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 mins ago
    expiresAt: new Date(Date.now() + 2 * 60 * 1000), // Expires in 2 mins
    offerCount: 0,
  },
  {
    id: '2',
    title: 'Grocery shopping at Bodija Market',
    category: 'Shopping & Groceries',
    workmanship: 1500,
    itemCost: 5000,
    distance: 1.8,
    pickup: { latitude: 7.4025, longitude: 3.9170, address: 'Bodija Market' },
    destination: { latitude: 7.3975, longitude: 3.9270, address: 'Samonda' },
    sender: { name: 'Mary Jane', rating: 4.8, tier: 3 },
    views: 8,
    urgency: 'normal' as const,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 mins
    offerCount: 0,
  },
  {
    id: '3',
    title: 'Deliver documents to office',
    category: 'Courier & Delivery',
    workmanship: 3000,
    itemCost: 0,
    distance: 5.5,
    pickup: { latitude: 7.3675, longitude: 3.9370, address: 'Challenge' },
    destination: { latitude: 7.4175, longitude: 3.9670, address: 'Jericho' },
    sender: { name: 'Corporate Ltd', rating: 5.0, tier: 4 },
    views: 20,
    urgency: 'urgent' as const,
    createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
    expiresAt: new Date(Date.now() + 8 * 60 * 1000), // Expires in 8 mins
    offerCount: 2,
  },
];

const CATEGORY_COLORS = {
  'Fuel & Energy': '#FF9800',
  'Shopping & Groceries': '#4CAF50',
  'Courier & Delivery': '#2196F3',
  'Banking & Payments': '#9C27B0',
  'Queue Standing': '#F44336',
  'Custom Errand': '#607D8B',
};

export default function BrowseErrands() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [selectedErrand, setSelectedErrand] = useState<string | null>(null);
  const [showAllErrands, setShowAllErrands] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [errandOrder, setErrandOrder] = useState(MOCK_ERRANDS);
  const [counterOfferModal, setCounterOfferModal] = useState(false);
  const [counterOfferErrand, setCounterOfferErrand] = useState<typeof MOCK_ERRANDS[0] | null>(null);
  const [counterOfferAmount, setCounterOfferAmount] = useState('');
  const [counterOfferMessage, setCounterOfferMessage] = useState('');
  const [newErrandNotification, setNewErrandNotification] = useState<typeof MOCK_ERRANDS[0] | null>(null);
  const [noResponseModal, setNoResponseModal] = useState(false);
  const [noResponseErrand, setNoResponseErrand] = useState<typeof MOCK_ERRANDS[0] | null>(null);
  const [userLocation] = useState({
    latitude: 7.3775,
    longitude: 3.9470,
  });

  // Check tier access
  const hasBrowseAccess = user?.tier && user.tier >= 3;

  // Auto-remove expired errands
  useEffect(() => {
    const interval = setInterval(() => {
      setErrandOrder((prevErrands) =>
        prevErrands.filter((errand) => new Date(errand.expiresAt) > new Date())
      );
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  // Check for errands about to expire with no responses (8 min mark / 2 mins remaining)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      errandOrder.forEach((errand) => {
        const timeRemaining = new Date(errand.expiresAt).getTime() - now;
        const twoMinsInMs = 2 * 60 * 1000;

        // If errand has 2 mins left, no offers, and user is sender
        if (
          timeRemaining <= twoMinsInMs &&
          timeRemaining > 0 &&
          errand.offerCount === 0 &&
          user?.id === errand.sender.name // Mock: in real app, check sender_id
        ) {
          setNoResponseErrand(errand);
          setNoResponseModal(true);
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [errandOrder, user?.id]);

  // Simulate new errand notifications when user is an errander
  useEffect(() => {
    const isErrander = user?.role === 'errander' || user?.role === 'both';
    if (!isErrander) return;

    // Simulate a new errand coming in 3 seconds after page load
    const timer = setTimeout(() => {
      const newErrand = {
        id: '99',
        title: '🔥 Urgent: Buy medicine from pharmacy',
        category: 'Shopping & Groceries',
        workmanship: 2500,
        itemCost: 3000,
        distance: 1.2,
        pickup: { latitude: 7.3825, longitude: 3.9520, address: 'Ring Road Pharmacy' },
        destination: { latitude: 7.3900, longitude: 3.9600, address: 'Bodija Estate' },
        sender: { name: 'Sarah Johnson', rating: 4.9, tier: 3 },
        views: 0,
        urgency: 'urgent' as const,
        createdAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        offerCount: 0,
      };

      setNewErrandNotification(newErrand);
    }, 3000);

    return () => clearTimeout(timer);
  }, [user?.role]);

  const snapPoints = useMemo(() => ['30%', '60%', '90%'], []);

  // Filter errands based on category and price
  const filteredErrands = useMemo(() => {
    return errandOrder.filter((errand) => {
      const matchesCategory = selectedCategory === 'all' || errand.category === selectedCategory;
      const matchesPrice = errand.workmanship >= priceRange.min && errand.workmanship <= priceRange.max;
      return matchesCategory && matchesPrice;
    });
  }, [errandOrder, selectedCategory, priceRange]);

  const handleErrandPress = (errandId: string) => {
    setSelectedErrand(errandId);
    setShowAllErrands(false);

    // Move selected errand to the front of the list
    const selectedErrandData = errandOrder.find((e) => e.id === errandId);
    if (selectedErrandData) {
      const reorderedErrands = [
        selectedErrandData,
        ...errandOrder.filter((e) => e.id !== errandId),
      ];
      setErrandOrder(reorderedErrands);
    }

    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleViewMore = () => {
    setShowAllErrands(true);
    bottomSheetRef.current?.snapToIndex(2);
  };

  const handleViewNotification = () => {
    if (newErrandNotification) {
      // Add the new errand to the list if not already there
      const exists = errandOrder.find((e) => e.id === newErrandNotification.id);
      if (!exists) {
        setErrandOrder([newErrandNotification, ...errandOrder]);
      }

      // Select and show the new errand
      handleErrandPress(newErrandNotification.id);
      setNewErrandNotification(null);
    }
  };

  const handleDismissNotification = () => {
    setNewErrandNotification(null);
  };

  const handleAcceptErrand = (errandId: string) => {
    const errand = filteredErrands.find((e) => e.id === errandId);
    if (!errand) return;

    // Auto-assign (no waiting for errander confirmation)
    Alert.alert(
      'Errand Accepted!',
      `You have been assigned to this errand. Please start within 5 minutes to avoid penalties.`,
      [
        {
          text: 'Start Now',
          onPress: () => {
            console.log('Starting errand:', errandId);
          },
        },
      ]
    );

    // Remove from available errands
    setErrandOrder((prev) => prev.filter((e) => e.id !== errandId));
  };

  // NoResponsesModal handlers
  const handleIncreasePrice = (newPrice: number) => {
    if (!noResponseErrand) return;

    Alert.alert(
      'Price Increased',
      `Workmanship increased to ₦${newPrice.toLocaleString()}. Your errand will be re-broadcasted.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Update errand with new price and reset timer
            setErrandOrder((prev) =>
              prev.map((e) =>
                e.id === noResponseErrand.id
                  ? {
                      ...e,
                      workmanship: newPrice,
                      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                      views: 0,
                    }
                  : e
              )
            );
            setNoResponseModal(false);
            setNoResponseErrand(null);
          },
        },
      ]
    );
  };

  const handleMarkUrgent = () => {
    if (!noResponseErrand) return;

    Alert.alert(
      'Marked as Urgent',
      `Urgency fee of ₦500 has been charged. Your errand will be re-broadcasted with urgent priority.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Update errand with urgent flag and reset timer
            setErrandOrder((prev) =>
              prev.map((e) =>
                e.id === noResponseErrand.id
                  ? {
                      ...e,
                      urgency: 'urgent' as const,
                      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                      views: 0,
                    }
                  : e
              )
            );
            setNoResponseModal(false);
            setNoResponseErrand(null);
          },
        },
      ]
    );
  };

  const handleExtend = () => {
    if (!noResponseErrand) return;

    Alert.alert(
      'Errand Extended',
      'Your errand has been extended by 10 more minutes. This is the maximum extension allowed.',
      [
        {
          text: 'OK',
          onPress: () => {
            setErrandOrder((prev) =>
              prev.map((e) =>
                e.id === noResponseErrand.id
                  ? {
                      ...e,
                      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                    }
                  : e
              )
            );
            setNoResponseModal(false);
            setNoResponseErrand(null);
          },
        },
      ]
    );
  };

  const handleCancelErrand = () => {
    if (!noResponseErrand) return;

    Alert.alert(
      'Cancel Errand?',
      'You will be refunded the full amount minus a small processing fee (₦100).',
      [
        {
          text: 'No, Keep It',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // Remove errand and refund sender
            setErrandOrder((prev) => prev.filter((e) => e.id !== noResponseErrand.id));
            setNoResponseModal(false);
            setNoResponseErrand(null);

            Alert.alert('Errand Cancelled', 'You have been refunded ₦13,140 (₦13,240 - ₦100 fee).');
          },
        },
      ]
    );
  };

  const handleCounterOffer = (errandId: string) => {
    const errand = filteredErrands.find((e) => e.id === errandId);
    if (errand) {
      setCounterOfferErrand(errand);
      setCounterOfferAmount(errand.workmanship.toString());
      setCounterOfferMessage('');
      setCounterOfferModal(true);
    }
  };

  const submitCounterOffer = () => {
    if (!counterOfferErrand) return;

    const amount = parseInt(counterOfferAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid workmanship amount');
      return;
    }

    if (amount >= counterOfferErrand.workmanship) {
      Alert.alert(
        'Invalid Counter Offer',
        'Your counter offer should be less than the original workmanship amount'
      );
      return;
    }

    console.log('Counter offer submitted:', {
      errandId: counterOfferErrand.id,
      originalAmount: counterOfferErrand.workmanship,
      counterAmount: amount,
      message: counterOfferMessage,
    });

    Alert.alert(
      'Counter Offer Sent!',
      `Your offer of ₦${amount.toLocaleString()} has been sent to ${counterOfferErrand.sender.name}. You'll be notified if they accept.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setCounterOfferModal(false);
            setCounterOfferErrand(null);
            setCounterOfferAmount('');
            setCounterOfferMessage('');
          },
        },
      ]
    );
  };

  const getTierBadge = (tier: number) => {
    const badges = {
      1: { emoji: '🔵', name: 'Starter' },
      2: { emoji: '🟢', name: 'Trusted' },
      3: { emoji: '🟡', name: 'Verified' },
      4: { emoji: '⭐', name: 'Elite' },
    };
    return badges[tier as keyof typeof badges] || badges[1];
  };

  const renderErrandCard = (errand: typeof MOCK_ERRANDS[0]) => {
    const categoryColor = CATEGORY_COLORS[errand.category as keyof typeof CATEGORY_COLORS];
    const tierBadge = getTierBadge(errand.sender.tier);
    const isSelected = selectedErrand === errand.id;

    return (
      <TouchableOpacity
        key={errand.id}
        style={[
          styles.errandCard,
          {
            backgroundColor: colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => handleErrandPress(errand.id)}
      >
        {/* Urgency Badge */}
        {errand.urgency === 'urgent' && (
          <View style={[styles.urgentBadge, { backgroundColor: colors.error }]}>
            <Ionicons name="flash" size={12} color="white" />
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}

        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{errand.category}</Text>
        </View>

        {/* Title & Distance */}
        <Text style={[styles.errandTitle, { color: colors.text }]} numberOfLines={1}>
          {errand.title}
        </Text>

        <View style={styles.distanceRow}>
          <Ionicons name="location" size={14} color={colors.textSecondary} />
          <Text style={[styles.distanceText, { color: colors.textSecondary }]}>
            {errand.distance} km away
          </Text>
        </View>

        {/* Countdown Timer */}
        <View style={styles.timerRow}>
          <CountdownTimer
            expiresAt={errand.expiresAt}
            warningThreshold={120}
            size="small"
            onExpire={() => {
              // Auto-remove when expired
              setErrandOrder((prev) => prev.filter((e) => e.id !== errand.id));
            }}
          />
        </View>

        {/* Route */}
        <View style={styles.routeRow}>
          <View style={styles.routePoint}>
            <View style={[styles.pickupDot, { backgroundColor: '#4169E1' }]} />
            <Text style={[styles.routeText, { color: colors.textSecondary }]} numberOfLines={1}>
              {errand.pickup.address}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color={colors.textTertiary} style={styles.arrow} />
          <View style={styles.routePoint}>
            <View style={[styles.destinationDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.routeText, { color: colors.textSecondary }]} numberOfLines={1}>
              {errand.destination.address}
            </Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingRow}>
          <View>
            <Text style={[styles.workmanshipLabel, { color: colors.textSecondary }]}>
              Workmanship
            </Text>
            <Text style={[styles.workmanshipAmount, { color: colors.primary }]}>
              ₦{errand.workmanship.toLocaleString()}
            </Text>
          </View>
          {errand.itemCost > 0 && (
            <View>
              <Text style={[styles.itemCostLabel, { color: colors.textSecondary }]}>
                Item Cost
              </Text>
              <Text style={[styles.itemCostAmount, { color: colors.text }]}>
                ₦{errand.itemCost.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Sender Info */}
        <View style={styles.senderRow}>
          <View style={[styles.senderAvatar, { backgroundColor: colors.surfaceSecondary }]}>
            <Ionicons name="person" size={16} color={colors.primary} />
          </View>
          <View style={styles.senderInfo}>
            <Text style={[styles.senderName, { color: colors.text }]}>
              {errand.sender.name} {tierBadge.emoji}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#FFC107" />
              <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                {errand.sender.rating}
              </Text>
            </View>
          </View>
          <Text style={[styles.viewsText, { color: colors.textTertiary }]}>
            👀 {errand.views} viewing
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.declineButton, { borderColor: colors.border }]}
            onPress={() => console.log('Declined:', errand.id)}
          >
            <Ionicons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.counterButton, { backgroundColor: colors.surfaceSecondary }]}
            onPress={() => handleCounterOffer(errand.id)}
          >
            <Ionicons name="chatbox" size={16} color={colors.primary} />
            <Text style={[styles.counterText, { color: colors.primary }]}>Counter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: colors.primary }]}
            onPress={() => handleAcceptErrand(errand.id)}
          >
            <Ionicons name="checkmark-circle" size={16} color="white" />
            <Text style={styles.acceptText}>Accept ₦{errand.workmanship.toLocaleString()}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tier Access Banner (if user doesn't have browse access) */}
      {!hasBrowseAccess && (
        <View style={[styles.tierBanner, { backgroundColor: colors.warning }]}>
          <Ionicons name="lock-closed" size={20} color="white" />
          <View style={styles.tierBannerText}>
            <Text style={styles.tierBannerTitle}>Browse Tab Locked</Text>
            <Text style={styles.tierBannerSubtitle}>
              Complete {user?.tier === 1 ? '10' : '50'} more errands to unlock browse feature (Tier 3+)
            </Text>
          </View>
        </View>
      )}

      {/* New Errand Notification Banner */}
      {newErrandNotification && (
        <ErrandNotificationBanner
          errand={newErrandNotification}
          onView={handleViewNotification}
          onDismiss={handleDismissNotification}
        />
      )}

      {/* No Responses Modal */}
      {noResponseErrand && (
        <NoResponsesModal
          visible={noResponseModal}
          errand={noResponseErrand}
          onIncreasePrice={handleIncreasePrice}
          onMarkUrgent={handleMarkUrgent}
          onExtend={handleExtend}
          onCancel={handleCancelErrand}
          onClose={() => setNoResponseModal(false)}
        />
      )}

      {/* Counter Offer Modal */}
      <Modal
        visible={counterOfferModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCounterOfferModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Counter Offer</Text>
                    <TouchableOpacity onPress={() => setCounterOfferModal(false)}>
                      <Ionicons name="close" size={28} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  {counterOfferErrand && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {/* Errand Info */}
                      <View style={[styles.modalErrandInfo, { backgroundColor: colors.surfaceSecondary }]}>
                        <Text style={[styles.modalErrandTitle, { color: colors.text }]}>
                          {counterOfferErrand.title}
                        </Text>
                        <View style={styles.modalPriceRow}>
                          <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                            Original Workmanship:
                          </Text>
                          <Text style={[styles.modalOriginalPrice, { color: colors.text }]}>
                            ₦{counterOfferErrand.workmanship.toLocaleString()}
                          </Text>
                        </View>
                      </View>

                      {/* Counter Offer Amount */}
                      <View style={styles.modalField}>
                        <Text style={[styles.modalFieldLabel, { color: colors.text }]}>
                          Your Counter Offer Amount
                        </Text>
                        <View style={[styles.modalInput, { backgroundColor: colors.background, borderColor: colors.border }]}>
                          <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>₦</Text>
                          <TextInput
                            style={[styles.amountInput, { color: colors.text }]}
                            value={counterOfferAmount}
                            onChangeText={setCounterOfferAmount}
                            keyboardType="numeric"
                            placeholder="Enter amount"
                            placeholderTextColor={colors.textTertiary}
                          />
                        </View>
                        <Text style={[styles.modalHint, { color: colors.textTertiary }]}>
                          Must be less than ₦{counterOfferErrand.workmanship.toLocaleString()}
                        </Text>
                      </View>

                      {/* Message (Optional) */}
                      <View style={styles.modalField}>
                        <Text style={[styles.modalFieldLabel, { color: colors.text }]}>
                          Message (Optional)
                        </Text>
                        <TextInput
                          style={[styles.modalTextArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                          value={counterOfferMessage}
                          onChangeText={setCounterOfferMessage}
                          placeholder="Explain why you're offering this amount..."
                          placeholderTextColor={colors.textTertiary}
                          multiline
                          numberOfLines={4}
                          textAlignVertical="top"
                        />
                      </View>

                      {/* Action Buttons */}
                      <View style={styles.modalActions}>
                        <TouchableOpacity
                          style={[styles.modalCancelButton, { borderColor: colors.border }]}
                          onPress={() => setCounterOfferModal(false)}
                        >
                          <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.modalSubmitButton, { backgroundColor: colors.primary }]}
                          onPress={submitCounterOffer}
                        >
                          <Text style={styles.modalSubmitText}>Send Offer</Text>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Map View */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        <UrlTile
          urlTemplate={`https://tiles.stadiamaps.com/tiles/${colors.mapTileTheme}/{z}/{x}/{y}{r}.png`}
          maximumZ={20}
          tileSize={256}
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker coordinate={userLocation}>
            <View style={styles.userMarker}>
              <Ionicons name="person" size={20} color="white" />
            </View>
          </Marker>
        )}

        {/* Errand Markers */}
        {MOCK_ERRANDS.map((errand) => (
          <Marker
            key={errand.id}
            coordinate={errand.pickup}
            onPress={() => handleErrandPress(errand.id)}
          >
            <View
              style={[
                styles.errandMarker,
                {
                  backgroundColor: CATEGORY_COLORS[errand.category as keyof typeof CATEGORY_COLORS],
                },
              ]}
            >
              <Text style={styles.markerText}>₦{(errand.workmanship / 1000).toFixed(1)}k</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Bottom Sheet with Errand Feed */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.primary }}
        enableOverDrag={false}
        enablePanDownToClose={false}
        animateOnMount={true}
        style={{ zIndex: 100 }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Available Errands
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {filteredErrands.length} errand{filteredErrands.length !== 1 ? 's' : ''} near you
            </Text>
          </View>

          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory === 'all' && { backgroundColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: selectedCategory === 'all' ? 'white' : colors.text },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {Object.keys(CATEGORY_COLORS).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && { backgroundColor: colors.primary },
                  { borderColor: colors.border },
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: selectedCategory === category ? 'white' : colors.text },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Price Filter */}
          <View style={[styles.priceFilterContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.priceFilterLabel, { color: colors.text }]}>
              Workmanship Range
            </Text>
            <View style={styles.priceFilterButtons}>
              <TouchableOpacity
                style={[
                  styles.priceFilterButton,
                  priceRange.max === 10000 && { backgroundColor: colors.primary },
                  { borderColor: colors.border },
                ]}
                onPress={() => setPriceRange({ min: 0, max: 10000 })}
              >
                <Text
                  style={[
                    styles.priceFilterButtonText,
                    { color: priceRange.max === 10000 ? 'white' : colors.text },
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priceFilterButton,
                  priceRange.max === 1500 && { backgroundColor: colors.primary },
                  { borderColor: colors.border },
                ]}
                onPress={() => setPriceRange({ min: 0, max: 1500 })}
              >
                <Text
                  style={[
                    styles.priceFilterButtonText,
                    { color: priceRange.max === 1500 ? 'white' : colors.text },
                  ]}
                >
                  Under ₦1.5k
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priceFilterButton,
                  priceRange.min === 1500 && priceRange.max === 2500 && { backgroundColor: colors.primary },
                  { borderColor: colors.border },
                ]}
                onPress={() => setPriceRange({ min: 1500, max: 2500 })}
              >
                <Text
                  style={[
                    styles.priceFilterButtonText,
                    { color: priceRange.min === 1500 && priceRange.max === 2500 ? 'white' : colors.text },
                  ]}
                >
                  ₦1.5k - ₦2.5k
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priceFilterButton,
                  priceRange.min === 2500 && { backgroundColor: colors.primary },
                  { borderColor: colors.border },
                ]}
                onPress={() => setPriceRange({ min: 2500, max: 10000 })}
              >
                <Text
                  style={[
                    styles.priceFilterButtonText,
                    { color: priceRange.min === 2500 ? 'white' : colors.text },
                  ]}
                >
                  Above ₦2.5k
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Errand Cards */}
          {showAllErrands
            ? filteredErrands.map(renderErrandCard)
            : filteredErrands.length > 0 && renderErrandCard(filteredErrands[0])}

          {/* View More Button */}
          {!showAllErrands && filteredErrands.length > 1 && (
            <TouchableOpacity
              style={[styles.viewMoreButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
              onPress={handleViewMore}
            >
              <Text style={[styles.viewMoreText, { color: colors.primary }]}>
                View {filteredErrands.length - 1} More Errand{filteredErrands.length - 1 !== 1 ? 's' : ''}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          {/* Empty State */}
          {filteredErrands.length === 0 && (
            <View style={styles.emptyFilterState}>
              <Ionicons name="filter-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyFilterText, { color: colors.text }]}>
                No errands match your filters
              </Text>
              <TouchableOpacity
                style={[styles.clearFiltersButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setSelectedCategory('all');
                  setPriceRange({ min: 0, max: 10000 });
                }}
              >
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tierBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tierBannerText: {
    flex: 1,
  },
  tierBannerTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  tierBannerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  timerRow: {
    marginBottom: 8,
  },
  userMarker: {
    backgroundColor: '#4169E1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  errandMarker: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomSheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  errandCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  urgentText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  errandTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
  },
  timeText: {
    fontSize: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  routeText: {
    fontSize: 12,
    flex: 1,
  },
  arrow: {
    marginHorizontal: 4,
  },
  pricingRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  workmanshipLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  workmanshipAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCostLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  itemCostAmount: {
    fontSize: 14,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  senderInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  viewsText: {
    fontSize: 11,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  declineButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 22,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 22,
  },
  acceptText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  filterContainer: {
    marginBottom: 16,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  priceFilterContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  priceFilterLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  priceFilterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  priceFilterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
  },
  viewMoreText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyFilterState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyFilterText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 20,
  },
  clearFiltersButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFiltersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalErrandInfo: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  modalErrandTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLabel: {
    fontSize: 13,
  },
  modalOriginalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalField: {
    marginBottom: 20,
  },
  modalFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  modalHint: {
    fontSize: 12,
    marginTop: 6,
  },
  modalTextArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    height: 100,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalSubmitButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubmitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
