const STORAGE_KEY = "gauteng-outdoors-favorites";

export function readFavorites() {
  const storedValue = localStorage.getItem(STORAGE_KEY);
  if (storedValue === null) {
    return [];
  }

  const favorites = JSON.parse(storedValue);
  if (!Array.isArray(favorites) || !favorites.every((id) => typeof id === "string")) {
    throw new Error("Saved places in local storage are not in the expected format.");
  }
  return favorites;
}

export function writeFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}
