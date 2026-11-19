import "./site.mjs";
import { fetchPlaces } from "./data.mjs";
import { readFavorites } from "./favorites.mjs";

const featuredPlaces = document.querySelector("#featured-places");
const status = document.querySelector("#home-status");
const savedCount = document.querySelector("#saved-count");

try {
  const places = await fetchPlaces();
  status.textContent = `Showing ${Math.min(4, places.length)} places from the Gauteng Outdoors guide.`;

  places.slice(0, 4).forEach((place) => {
    const card = document.createElement("article");
    card.className = "feature-card";

    const meta = document.createElement("div");
    meta.className = "card-meta";
    const category = document.createElement("span");
    category.className = "tag";
    category.textContent = place.category;
    meta.append(category);

    const title = document.createElement("h3");
    title.textContent = place.name;
    const area = document.createElement("p");
    area.className = "card-area";
    area.textContent = place.area;
    const setting = document.createElement("p");
    setting.textContent = place.setting;
    const activities = document.createElement("p");
    activities.textContent = place.activities;
    const link = document.createElement("a");
    link.className = "text-link";
    link.href = "places.html";
    link.textContent = "View the place guide";

    card.append(meta, title, area, setting, activities, link);
    featuredPlaces.append(card);
  });
} catch (error) {
  status.textContent = "The place guide could not be loaded. Please try again later.";
  console.error("Home page could not display featured places.", error);
}

try {
  const saved = readFavorites();
  savedCount.textContent = saved.length === 1
    ? "1 place saved in this browser."
    : `${saved.length} places saved in this browser.`;
} catch (error) {
  savedCount.textContent = "Saved places are unavailable in this browser.";
  console.error("Saved places could not be read.", error);
}
