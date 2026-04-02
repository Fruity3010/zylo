import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Colors from "../../../constants/colors";

interface Category {
  name: string;
  icon: any;
}

interface CategorySelectorProps {
  activeCategory: string | null;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES: Category[] = [
  {
    name: "Fuel & Energy",
    icon: require("../../../assets/Fuel station-bro.png"),
  },
  {
    name: "Courier & Deliveries",
    icon: require("../../../assets/In no time-amico.png"),
  },
  {
    name: "Office & Work Errands",
    icon: require("../../../assets/Work time-amico.png"),
  },
  {
    name: "Others/Custom",
    icon: require("../../../assets/time-rafiki.png"),
  },
];

export default function CategorySelector({
  activeCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Category</Text>
      <View style={styles.categoriesRow}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryCard,
              activeCategory === category.name && styles.activeCategoryCard,
            ]}
            onPress={() => onSelectCategory(category.name)}
          >
            <Image
              source={category.icon}
              style={styles.categoryIcon}
              resizeMode="contain"
            />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
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
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  categoryCard: {
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
    shadowColor: "#6aff6a65",
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  categoryIcon: {
    width: "100%",
    height: 70,
    marginBottom: 6,
  },
  categoryText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
});
