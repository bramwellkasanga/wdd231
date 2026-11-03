const membersUrl = "data/members.json";
const memberDirectory = document.querySelector("#member-directory");
const directoryStatus = document.querySelector("#directory-status");
const gridViewButton = document.querySelector("#grid-view");
const listViewButton = document.querySelector("#list-view");

const membershipNames = {
  1: "Member",
  2: "Silver Member",
  3: "Gold Member",
};

const displayMembers = (members) => {
  memberDirectory.replaceChildren();

  members.forEach((member) => {
    const card = document.createElement("article");
    card.className = "member-card";

    const logo = document.createElement("img");
    logo.className = "member-logo";
    logo.src = `images/${member.image}`;
    logo.alt = `${member.name} logo`;
    logo.width = 320;
    logo.height = 180;
    logo.loading = "lazy";

    const name = document.createElement("h3");
    name.className = "member-name";
    name.textContent = member.name;

    const description = document.createElement("p");
    description.className = "member-description";
    description.textContent = member.description;

    const details = document.createElement("div");
    details.className = "member-details";

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
    website.setAttribute("aria-label", `Visit ${member.name} website (opens in a new tab)`);

    const membership = document.createElement("span");
    membership.className = `membership-badge ${member.membershipLevel === 3 ? "gold" : member.membershipLevel === 2 ? "silver" : ""}`;
    membership.textContent = membershipNames[member.membershipLevel];

    details.append(address, phone, website);
    card.append(logo, name, description, details, membership);
    memberDirectory.append(card);
  });

  directoryStatus.textContent = `${members.length} member businesses`;
};

const setView = (view) => {
  const isList = view === "list";
  memberDirectory.classList.toggle("view-list", isList);
  gridViewButton.classList.toggle("selected", !isList);
  listViewButton.classList.toggle("selected", isList);
  gridViewButton.setAttribute("aria-pressed", String(!isList));
  listViewButton.setAttribute("aria-pressed", String(isList));
};

gridViewButton.addEventListener("click", () => setView("grid"));
listViewButton.addEventListener("click", () => setView("list"));

async function getMembers() {
  try {
    const response = await fetch(membersUrl);
    if (!response.ok) {
      throw new Error(`Member request failed with status ${response.status}`);
    }

    const members = await response.json();
    if (
      !Array.isArray(members) ||
      members.length < 7 ||
      members.some(
        (member) =>
          !member.name ||
          !member.address ||
          !member.phone ||
          !member.website ||
          !member.image ||
          !membershipNames[member.membershipLevel],
      )
    ) {
      throw new Error("The member data is missing required directory information.");
    }

    displayMembers(members);
  } catch (error) {
    console.error("Unable to load chamber members:", error);
    directoryStatus.textContent = "Member directory unavailable";
    const message = document.createElement("p");
    message.className = "error-message";
    message.textContent =
      "Member information could not be loaded. Please try again later.";
    memberDirectory.replaceChildren(message);
  }
}

getMembers();
