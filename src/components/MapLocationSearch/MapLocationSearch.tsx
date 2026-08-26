import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Colors from "../../../constants/colors";

interface MapLocation {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
}

interface MapLocationSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectLocation: (location: {
    latitude: number;
    longitude: number;
    name: string;
  }) => void;
  placeholder?: string;
  mapCenter?: { latitude: number; longitude: number } | null;
  locationFilter?: string;
  style?: any;
}

export default function MapLocationSearch({
  value,
  onChangeText,
  onSelectLocation,
  placeholder = "Search location",
  mapCenter,
  locationFilter,
  style,
}: MapLocationSearchProps) {
  const [suggestions, setSuggestions] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const searchLocation = async (query: string) => {
    // Cancel previous request if it exists
    if (abortController.current) {
      abortController.current.abort();
    }

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    abortController.current = new AbortController();

    try {
      // Build Nominatim query
      let searchQuery = query;

      // Add location filter keywords
      if (locationFilter === "fuel") {
        searchQuery = `fuel station ${query}`;
      }

      // Add state constraint for better Nigeria results
      // You can change "Lagos State" to any Nigerian state
      searchQuery = `${searchQuery}, Lagos State, Nigeria`;

      // Add Nigeria and use mapCenter if available for better results
      const params = new URLSearchParams({
        format: "json",
        q: searchQuery,
        limit: "8",
        countrycodes: "ng",
      });

      // Add viewbox if we have map center for proximity bias (but don't restrict to it)
      if (mapCenter) {
        const delta = 0.5; // ~50km radius
        const viewbox = [
          mapCenter.longitude - delta,
          mapCenter.latitude + delta,
          mapCenter.longitude + delta,
          mapCenter.latitude - delta,
        ].join(',');
        params.append("viewbox", viewbox);
        // Removed bounded=1 so it only uses viewbox for proximity sorting, not as a hard boundary
      } else {
      }

      const fullUrl = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

      const response = await fetch(fullUrl, {
        headers: {
          'User-Agent': 'ZyloErrandApp/1.0',
        },
        signal: abortController.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (error: any) {
      // Don't log abort errors
      if (error.name !== 'AbortError') {
        console.error("Location search error:", error.message);
      }
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    onChangeText(text);
    setShowDropdown(true);

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Debounce search by 600ms
    debounceTimeout.current = setTimeout(() => {
      searchLocation(text);
    }, 600);
  };

  const handleSelectSuggestion = (suggestion: MapLocation) => {
    onChangeText(suggestion.display_name);
    onSelectLocation({
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      name: suggestion.display_name,
    });
    setShowDropdown(false);
    setSuggestions([]);
    // Keep keyboard open so user can continue to next field or search again
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = () => {
    // Don't hide dropdown on blur - let user scroll and select
    // Dropdown will only hide when a location is selected
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, style]}>
        <Icon name="search" size={18} color={Colors.mediumGrey} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.mediumGrey}
          value={value}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {loading && (
          <ActivityIndicator size="small" color={Colors.honeydew} />
        )}
      </View>

      {(() => {
        return showDropdown && suggestions.length > 0 ? (
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>
                {suggestions.length} location{suggestions.length > 1 ? 's' : ''} found
              </Text>
              <TouchableOpacity onPress={() => setShowDropdown(false)}>
                <Icon name="x" size={18} color={Colors.mediumGrey} />
              </TouchableOpacity>
            </View>
            <View style={styles.dropdownScrollContainer}>
             <ScrollView
  nestedScrollEnabled
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator
  contentContainerStyle={{ flexGrow: 1 }}
>

                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.place_id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name="map-pin"
                      size={16}
                      color={Colors.honeydew}
                    />
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionName} numberOfLines={2}>
                        {item.display_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        ) : null;
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 9999,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    color: Colors.honeydew,
    fontSize: 16,
  },
 dropdown: {
  position: "absolute",
  top: 52,
  left: 0,
  right: 0,
  backgroundColor: "#1a1a1a",
  borderRadius: 10,
  marginTop: 4,
  borderWidth: 1,
  borderColor: "#3a3a3a",
  maxHeight: 300,
  overflow: "hidden", 
  zIndex: 10000,
  elevation: 10,
},

  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  dropdownHeaderText: {
    color: Colors.mediumGrey,
    fontSize: 12,
    fontWeight: "600",
  },
dropdownScrollContainer: {
  maxHeight: 250,
},

  suggestionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff1a",
    gap: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionName: {
    color: Colors.honeydew,
    fontSize: 14,
    lineHeight: 20,
  },
});
