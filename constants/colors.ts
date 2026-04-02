// constants/colors.ts

export const lightColors = {
  background: "#FFFFFF",
  surface: "#F5F5F5",
  surfaceSecondary: "#ECECEC",
  text: "#000000",
  textSecondary: "#666666",
  textTertiary: "#999999",
  primary: "#118c55ff",
  primaryLight: "#1aa168",
  border: "#E0E0E0",
  borderLight: "#F0F0F0",
  card: "#FFFFFF",
  error: "#ff4444",
  success: "#118c55ff",
  warning: "#ffa500",
  mapTileTheme: "alidade_smooth", // Light map tiles
};

export const darkColors = {
  background: "#000000",
  surface: "#111111",
  surfaceSecondary: "#1a1a1a",
  text: "#FFFFFF",
  textSecondary: "#888888",
  textTertiary: "#666666",
  primary: "lightgreen",
  primaryLight: "#90EE90",
  border: "#222222",
  borderLight: "#333333",
  card: "#111111",
  error: "#ff4444",
  success: "lightgreen",
  warning: "#ffa500",
  mapTileTheme: "alidade_smooth_dark", // Dark map tiles
};

// Legacy export for backwards compatibility (defaults to dark)
const Colors = {
  darkBackground: "#1E1E1E",
  darkerGrey: "#181F20",
  lightGreen: "#6AFF6A",
  honeydew: "#F0FFF0",
  mediumGrey: "#888888",
  textDark: "#1E1E1E",
};

export default Colors;
