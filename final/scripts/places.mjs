import "./site.mjs";
import { fetchPlaces } from "./data.mjs";
import { readFavorites, writeFavorites } from "./favorites.mjs";

const placeList = document.querySelector("#place-list");
const status = document.querySelector("#places-status");
const searchInput = document.querySelector("#place-search");
const categoryFilter = document.querySelector("#category-filter");
const savedFilter = document.querySelector("#saved-filter");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#place-dialog");
const storageIssue = document.createElement("span");
let places = [];
let favorites = [];
let storageAvailable = true;

function showStorageIssue(message) {
  storageAvailable = false;
  storageIssue.textContent = ` ${message}`;
  storageIssue.className = "storage-warning";
  status.append(storageIssue);
}

function updateSavedButtons() {
  placeList.querySelectorAll("[data-save-id]").forEach((button) => {
    const isSaved = favorites.includes(button.dataset.saveId);
    button.setAttribute("aria-pressed", String(isSaved));
    button.textContent = isSaved ? "Saved" : "Save place";
    button.setAttribute(
      "aria-label",
      `${isSaved ? "Remove" : "Save"} ${button.dataset.placeName} ${isSaved ? "from" : "to"} saved places`,
    );
  });
}

function makeCard(place) {
  const card = document.createElement("article");
  card.className = "place-card";

  const meta = document.createElement("div");
  meta.className = "card-meta";
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = place.category;
  meta.append(tag);

  const title = document.createElement("h3");
  title.textContent = place.name;
  const area = document.createElement("p");
  area.className = "card-area";
  area.textContent = place.area;
  const setting = document.createElement("p");
  setting.textContent = place.setting;
  const activities = document.createElement("p");
  activities.textContent = place.activities;

  const actions = document.createElement("div");
  actions.className = "card-actions";
  const details = document.createElement("button");
  details.className = "small-button";
  details.type = "button";
  details.dataset.detailsId = place.id;
  details.textContent = "Details";

  const save = document.createElement("button");
  save.className = "small-button";
  save.type = "button";
  save.dataset.saveId = place.id;
  save.dataset.placeName = place.name;
  save.setAttribute("aria-pressed", String(favorites.includes(place.id)));
  save.setAttribute(
    "aria-label",
    `${favorites.includes(place.id) ? "Remove" : "Save"} ${place.name} ${favorites.includes(place.id) ? "from" : "to"} saved places`,
  );
  save.textContent = favorites.includes(place.id) ? "Saved" : "Save place";

  actions.append(details, save);
  card.append(meta, title, area, setting, activities, actions);
  return card;
}

function renderPlaces() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase();
  const selectedCategory = categoryFilter.value;
  const visiblePlaces = places.filter((place) => {
    const matchesText = `${place.name} ${place.area}`.toLocaleLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || place.category === selectedCategory;
    const matchesSaved = !savedFilter.checked || favorites.includes(place.id);
    return matchesText && matchesCategory && matchesSaved;
  });

  placeList.replaceChildren(...visiblePlaces.map(makeCard));
  emptyState.hidden = visiblePlaces.length > 0;
  status.textContent = `Showing ${visiblePlaces.length} of ${places.length} outdoor places.`;
  if (!storageAvailable) {
    status.append(storageIssue);
  }
}

function openDetails(place) {
  const fields = {
    "#dialog-category": place.category,
    "#dialog-title": place.name,
    "#dialog-area": place.area,
    "#dialog-setting": place.setting,
    "#dialog-activities": place.activities,
    "#dialog-visit": place.visit,
    "#dialog-access": place.access,
  };

  Object.entries(fields).forEach(([selector, value]) => {
    document.querySelector(selector).textContent = value;
  });
  dialog.showModal();
}

try {
  favorites = readFavorites();
} catch (error) {
  console.error("Saved places could not be read.", error);
  showStorageIssue("Saved places are unavailable because browser storage could not be read.");
}

try {
  places = await fetchPlaces();
  [...new Set(places.map((place) => place.category))].sort().forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });
  renderPlaces();
} catch (error) {
  status.textContent = "The place guide could not be loaded. Please try again later.";
  console.error("Place directory could not be rendered.", error);
}

[searchInput, categoryFilter, savedFilter].forEach((control) => {
  control.addEventListener("input", renderPlaces);
  control.addEventListener("change", renderPlaces);
});

placeList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  if (button.dataset.detailsId) {
    const selectedPlace = places.find((place) => place.id === button.dataset.detailsId);
    if (selectedPlace) {
      openDetails(selectedPlace);
    }
    return;
  }

  if (button.dataset.saveId && storageAvailable) {
    const nextFavorites = favorites.includes(button.dataset.saveId)
      ? favorites.filter((id) => id !== button.dataset.saveId)
      : [...favorites, button.dataset.saveId];

    try {
      writeFavorites(nextFavorites);
      favorites = nextFavorites;
      renderPlaces();
    } catch (error) {
      console.error("Saved places could not be stored.", error);
      showStorageIssue("Your change could not be saved in this browser.");
    }
  }
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});
