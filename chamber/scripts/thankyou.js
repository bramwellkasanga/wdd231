const params = new URLSearchParams(window.location.search);
const applicationSummary = document.querySelector(".application-summary");
const applicationStatus = document.querySelector("#application-status");
const membershipLabels = {
  np: "NP Membership",
  bronze: "Bronze Membership",
  silver: "Silver Membership",
  gold: "Gold Membership",
};

const requiredFields = {
  firstName: params.get("firstName"),
  lastName: params.get("lastName"),
  email: params.get("email"),
  phone: params.get("phone"),
  organization: params.get("organization"),
  timestamp: params.get("timestamp"),
};

if (Object.values(requiredFields).some((value) => !value)) {
  applicationStatus.textContent =
    "No complete membership application was received. Please use the application form to submit your details.";
} else {
  const summaryValues = {
    "#summary-first-name": requiredFields.firstName,
    "#summary-last-name": requiredFields.lastName,
    "#summary-email": requiredFields.email,
    "#summary-phone": requiredFields.phone,
    "#summary-organization": requiredFields.organization,
    "#summary-membership": membershipLabels[params.get("membership")] || "Not selected",
    "#summary-title": params.get("organizationTitle") || "Not provided",
    "#summary-description": params.get("description") || "Not provided",
    "#summary-timestamp": requiredFields.timestamp,
  };

  Object.entries(summaryValues).forEach(([selector, value]) => {
    document.querySelector(selector).textContent = value;
  });

  applicationStatus.textContent =
    "Thank you for your interest. Here is a summary of the information you submitted.";
  applicationSummary.hidden = false;
}
