const membersUrl = "data/members.json";
const spotlights = document.querySelector("#spotlights");
const spotlightStatus = document.querySelector("#spotlight-status");

const membershipNames = {
  2: "Silver Member",
  3: "Gold Member",
};

function chooseRandomMembers(members, count) {
  const shuffled = [...members];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, count);
}

function createSpotlight(member) {
  const card = document.createElement("article");
  card.className = "spotlight-card";

  const logo = document.createElement("img");
  logo.className = "spotlight-logo";
  logo.src = `images/${member.image}`;
  logo.alt = `${member.name} logo`;
  logo.width = 320;
  logo.height = 180;
  logo.loading = "lazy";

  const name = document.createElement("h3");
  name.textContent = member.name;

  const membership = document.createElement("p");
  membership.className = `membership-badge ${member.membershipLevel === 3 ? "gold" : "silver"}`;
  membership.textContent = membershipNames[member.membershipLevel];

  const details = document.createElement("div");
  details.className = "spotlight-details";

  const address = document.createElement("p");
  address.textContent = member.address;

  const phone = document.createElement("a");
  phone.href = `tel:${member.phone.replace(/[^\d+]/g, "")}`;
  phone.textContent = member.phone;

  const website = document.createElement("a");
  website.href = member.website;
  website.target = "_blank";
  website.rel = "noopener noreferrer";
  website.textContent = new URL(member.website).hostname;
  website.setAttribute(
    "aria-label",
    `Visit ${member.name} website (opens in a new tab)`,
  );

  details.append(address, phone, website);
  card.append(logo, name, membership, details);
  return card;
}

async function loadSpotlights() {
  try {
    const response = await fetch(membersUrl);
    if (!response.ok) {
      throw new Error(`Member request failed with status ${response.status}`);
    }

    const members = await response.json();
    const eligibleMembers = members.filter(
      (member) =>
        (member.membershipLevel === 2 || member.membershipLevel === 3) &&
        member.name &&
        member.address &&
        member.phone &&
        member.website &&
        member.image,
    );

    if (eligibleMembers.length < 2) {
      throw new Error("At least two silver or gold members are required.");
    }

    const selectedMembers = chooseRandomMembers(
      eligibleMembers,
      Math.min(3, eligibleMembers.length),
    );
    spotlights.replaceChildren(
      ...selectedMembers.map((member) => createSpotlight(member)),
    );
    spotlightStatus.textContent = `${selectedMembers.length} chamber members highlighted`;
  } catch (error) {
    console.error("Unable to load chamber spotlights:", error);
    spotlightStatus.textContent = "Member spotlights are currently unavailable.";
    const message = document.createElement("p");
    message.className = "error-message";
    message.textContent =
      "Member information could not be loaded. Please try again later.";
    spotlights.replaceChildren(message);
  }
}

loadSpotlights();
