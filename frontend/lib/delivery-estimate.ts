export function getDeliveryEstimate(
  country: string,
  state: string
): string {
  if (!country) return "";

  if (country.toUpperCase() !== "NG") {
    return "7–9 working days";
  }

  // Nigeria: Lagos is faster than the rest of the country
  const normalizedState = state.trim().toLowerCase();
  const isLagos =
    normalizedState === "lagos" ||
    normalizedState === "la" ||
    normalizedState === "ng-la";

  if (isLagos) {
    return "2–3 working days";
  }

  return "4–5 working days";
}