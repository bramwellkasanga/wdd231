const timestamp = document.querySelector("#timestamp");
const membershipLinks = document.querySelectorAll("[data-dialog-open]");
const membershipDialogs = document.querySelectorAll(".membership-dialog");

if (timestamp) {
  timestamp.value = new Date().toISOString();
}

membershipLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const dialog = document.getElementById(link.dataset.dialogOpen);
    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
    }
  });
});

membershipDialogs.forEach((dialog) => {
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  });
});
