// Brand accent (blue -> violet, off the old orange)
export const BRAND = ["#3B82F6", "#8B5CF6"]; // LinearGradient colors, 135deg
export const ACCENT = "#6366F1";

export const COLORS = {
  bg: "#0a0a12",
  bgTop: "#16182e",
  surface: "#14141d",
  surfaceAlt: "#15151f",
  card: "#13131c",
  border: "#23232e",
  text: "#ffffff",
  textDim: "#9a9aa8",
  textMute: "#8a8a98",
  textFaint: "#7a7a88",
  textGhost: "#6b6b78",
};

// Font family names registered via @expo-google-fonts in App.js
export const FONT = {
  regular: "Sora_400Regular",
  semibold: "Sora_600SemiBold",
  bold: "Sora_700Bold",
  extrabold: "Sora_800ExtraBold",
  mono: "SpaceMono_400Regular",
};

// Diagonal gradient direction matching CSS `135deg`
export const GRAD_135 = { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };

// Reusable elevated shadow
export const shadow = (radius = 30, opacity = 0.5) => ({
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: 12,
});
