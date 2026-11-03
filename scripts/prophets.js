const url = "https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json";
const cards = document.querySelector("#cards");

const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
    const card = document.createElement("section");
    card.className = "prophet-card";

    const fullName = document.createElement("h2");
    const portrait = document.createElement("img");
    const birthDate = document.createElement("p");
    const birthplace = document.createElement("p");

    fullName.textContent = `${prophet.name} ${prophet.lastname}`;
    portrait.setAttribute("src", prophet.imageurl);
    portrait.setAttribute("alt", `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute("loading", "lazy");
    portrait.setAttribute("width", "340");
    portrait.setAttribute("height", "440");
    birthDate.textContent = `Date of birth: ${prophet.birthdate}`;
    birthplace.textContent = `Place of birth: ${prophet.birthplace}`;

    card.appendChild(fullName);
    card.appendChild(portrait);
    card.appendChild(birthDate);
    card.appendChild(birthplace);
    cards.appendChild(card);
  });
};

async function getProphetData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.prophets)) {
      throw new Error("The prophets response does not contain a prophets array.");
    }

    displayProphets(data.prophets);
  } catch (error) {
    console.error("Unable to load prophet data:", error);
    const message = document.createElement("p");
    message.className = "error-message";
    message.textContent = "Prophet information could not be loaded. Please try again later.";
    cards.replaceChildren(message);
  }
}

getProphetData();
