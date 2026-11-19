import "./site.mjs";
import { fetchPlaces } from "./data.mjs";

const placeSelect = document.querySelector("#visit-place");
const dateInput = document.querySelector("#visit-date");
const form = document.querySelector(".visit-form");
const submitButton = form.querySelector('button[type="submit"]');
const status = document.querySelector("#plan-status");

dateInput.min = new Date().toISOString().slice(0, 10);
submitButton.disabled = true;

try {
  const places = await fetchPlaces();
  places.forEach((place) => {
    const option = document.createElement("option");
    option.value = place.id;
    option.textContent = `${place.name} — ${place.area}`;
    placeSelect.append(option);
  });
  status.textContent = "Choose a destination to begin your plan.";
  submitButton.disabled = false;
} catch (error) {
  status.textContent = "Destinations could not be loaded, so the form is unavailable.";
  console.error("Visit planner could not load its destinations.", error);
}
