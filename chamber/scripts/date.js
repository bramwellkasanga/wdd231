const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (lastModified) {
  const modifiedDate = new Date(document.lastModified).toISOString();
  lastModified.dateTime = modifiedDate;
  lastModified.textContent = modifiedDate;
}
