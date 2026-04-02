import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Colors from "../../../constants/colors";

interface LocationSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  placeholder?: string;
  style?: any;
}

export default function LocationAutocomplete({
  value,
  onChangeText,
  onSelectLocation,
  placeholder = "Enter location",
  style,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=ng`,
        {
          headers: {
            'User-Agent': 'ZyloErrandApp/1.0',
          },
        }
      );

      if (!response.ok) {
        console.error("Location search failed:", response.status);
        setSuggestions([]);
        return;
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Location search error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    onChangeText(text);

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout (wait 500ms after user stops typing)
    debounceTimeout.current = setTimeout(() => {
      searchLocation(text);
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    onSelectLocation({
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      address: suggestion.display_name,
    });
    onChangeText(suggestion.display_name);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor={Colors.mediumGrey}
        value={value}
        onChangeText={handleTextChange}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.lightGreen} />
        </View>
      )}
      {suggestions.length > 0 && (
        <View style={styles.suggestionList}>
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
            >
              <Text style={styles.suggestionText} numberOfLines={2}>
                {item.display_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  position: "relative",
  zIndex: 999,
},

  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 10,
    color: Colors.honeydew,
    fontSize: 16,
  },
  loadingContainer: {
    position: "absolute",
    right: 12,
    top: 12,
  },
suggestionList: {
  position: "absolute",
  top: 52,
  left: 0,
  right: 0,
  backgroundColor: "#1a1a1a",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#3a3a3a",
  zIndex: 9999, // very important
  elevation: 10, // for Android
  maxHeight: 200,
},

  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff1a",
  },
  suggestionText: {
    color: Colors.honeydew,
    fontSize: 14,
  },
});
