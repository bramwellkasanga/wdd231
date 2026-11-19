import "./site.mjs";
import { fetchPlaces } from "./data.mjs";

const status = document.querySelector("#submission-status");
const details = document.querySelector("#submission-details");
const params = new URLSearchParams(window.location.search);
const values = {
  name: params.get("name"),
  place: params.get("place"),
  date: params.get("date"),
  activity: params.get("activity"),
  notes: params.get("notes") || "No notes added.",
};

if (!values.name || !values.place || !values.date || !values.activity) {
  status.textContent = "No complete visit plan was submitted. Use the planner to create one.";
} else {
  try {
    const places = await fetchPlaces();
    const selectedPlace = places.find((place) => place.id === values.place);
    if (!selectedPlace) {
      throw new Error("The submitted place is not in the current place guide.");
    }

    document.querySelector("#submitted-name").textContent = values.name;
    document.querySelector("#submitted-place").textContent = selectedPlace.name;
    document.querySelector("#submitted-date").textContent = values.date;
    document.querySelector("#submitted-activity").textContent = values.activity;
    document.querySelector("#submitted-notes").textContent = values.notes;
    details.hidden = false;
    status.textContent = "Your plan is ready to review.";
  } catch (error) {
    status.textContent = "Your plan details could not be displayed.";
    console.error("Submitted visit plan could not be displayed.", error);
  }
}
