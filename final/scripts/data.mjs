export async function fetchPlaces() {
  try {
    const response = await fetch("./data/places.json");
    if (!response.ok) {
      throw new Error(`Place data request failed with status ${response.status}.`);
    }

    const places = await response.json();
    if (!Array.isArray(places) || places.length < 15) {
      throw new Error("The place data must contain at least 15 entries.");
    }
    return places;
  } catch (error) {
    console.error("Unable to load the Gauteng Outdoors place data.", error);
    throw error;
  }
}
