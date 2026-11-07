/**
 * Maps common color names (as an admin would type them) to real colors,
 * so customers see a swatch instead of just text. Add more names here
 * as the shop needs them — matching is case-insensitive and ignores
 * extra spaces, so "Jet Black", "jet black" and "JET BLACK" all match.
 */
const COLOR_MAP: Record<string, string> = {
  // Blacks / browns
  black: "#1a1a1a",
  "jet black": "#0a0a0a",
  "natural black": "#1c1a17",
  brown: "#6b4423",
  "dark brown": "#3b2314",
  "chocolate brown": "#4a2c17",
  "chestnut brown": "#6a3b2a",
  "light brown": "#8b5a2b",
  "medium brown": "#6f4425",
  auburn: "#8b3a1f",
  burgundy: "#5e1a23",
  maroon: "#5c1a2b",

  // Blondes
  blonde: "#e8c178",
  "honey blonde": "#c98a3f",
  "ash blonde": "#cdbb94",
  "platinum blonde": "#e8e0cf",
  "golden blonde": "#d9a441",
  "strawberry blonde": "#d98a5f",
  "dirty blonde": "#b89968",

  // Reds / coppers
  red: "#9c2b2b",
  copper: "#b5612b",
  ginger: "#c1611e",

  // Greys / whites
  grey: "#9b9b9b",
  gray: "#9b9b9b",
  "silver grey": "#c4c4c4",
  "salt and pepper": "#8a8a8a",
  white: "#f5f5f0",
  blonde_grey: "#c9c2b4",

  // Fashion colors
  blue: "#1f4fa3",
  "navy blue": "#1b2a4a",
  pink: "#d6558c",
  "rose gold": "#b76e79",
  purple: "#5b3b8c",
  lavender: "#9b86b5",
  green: "#2f5d3a",
  orange: "#c1631e",
  gold: "#c7a046",
  ombre: "linear-gradient(135deg, #1a1a1a 50%, #c98a3f 50%)",

  // Generic / neutral fallbacks customers sometimes type
  natural: "#8b5a2b",
  beige: "#d8c3a0",
  nude: "#e0c4a8",
};

// A few recognizable aliases that map to an entry above
const ALIASES: Record<string, string> = {
  jetblack: "jet black",
  darkbrown: "dark brown",
  honeyblonde: "honey blonde",
  ashblonde: "ash blonde",
  platinumblonde: "platinum blonde",
  roseGold: "rose gold",
  navy: "navy blue",
};

function normalize(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * A soft, deterministic fallback color for names we don't recognize,
 * so every color still gets *some* distinct swatch instead of grey.
 */
function fallbackColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 45%, 45%)`;
}

export function getColorSwatch(name: string): string {
  const key = normalize(name);
  if (COLOR_MAP[key]) return COLOR_MAP[key];

  const aliasKey = key.replace(/\s+/g, "");
  const alias = ALIASES[aliasKey];
  if (alias && COLOR_MAP[alias]) return COLOR_MAP[alias];

  return fallbackColor(key);
}

// True for colors pale enough that a white checkmark/border would be invisible
export function isLightSwatch(name: string): boolean {
  const key = normalize(name);
  return ["white", "platinum blonde", "silver grey", "beige", "nude"].includes(
    key
  );
}