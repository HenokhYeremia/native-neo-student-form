const loader = document.getElementById("loader");
const pageShell = document.getElementById("pageShell");
const loadingText = document.getElementById("loadingText");
const progressBar = document.getElementById("progressBar");
const progressNumber = document.getElementById("progressNumber");
const form = document.getElementById("registrationForm");
const successModal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const modalButton = document.getElementById("modalButton");

const loadingMessages = [
  "Merapikan meja registrasi",
  "Mengecek pulpen warna-warni",
  "Menyusun berkas calon mahasiswa",
  "Mengaktifkan portal admisi",
  "Hampir selesai"
];

let progress = 0;
let messageIndex = 0;

const loadingTimer = setInterval(() => {
  progress += Math.floor(Math.random() * 9) + 5;

  if (progress >= 100) {
    progress = 100;
    clearInterval(loadingTimer);

    setTimeout(() => {
      loader.classList.add("is-done");
      pageShell.classList.remove("is-hidden");
      document.body.style.overflow = "auto";
    }, 420);
  }

  if (progress > (messageIndex + 1) * 20 && messageIndex < loadingMessages.length - 1) {
    messageIndex += 1;
    loadingText.textContent = loadingMessages[messageIndex];
  }

  progressBar.style.width = `${progress}%`;
  progressNumber.textContent = `${progress}%`;
}, 170);

document.body.style.overflow = "hidden";

function showFieldError(field, message) {
  const wrapper = field.closest(".field");
  const error = wrapper ? wrapper.querySelector(".error-message") : null;

  field.setAttribute("aria-invalid", "true");

  if (wrapper) {
    wrapper.classList.add("has-error");
  }

  if (error) {
    error.textContent = message;
  }
}

function clearFieldError(field) {
  const wrapper = field.closest(".field");
  const error = wrapper ? wrapper.querySelector(".error-message") : null;

  field.removeAttribute("aria-invalid");

  if (wrapper) {
    wrapper.classList.remove("has-error");
  }

  if (error) {
    error.textContent = "";
  }
}

function validateTextField(field) {
  const label = field.closest(".field")?.querySelector("span")?.textContent || "Kolom ini";

  if (!field.value.trim()) {
    showFieldError(field, `${label} wajib diisi.`);
    return false;
  }

  if (field.type === "email" && !field.validity.valid) {
    showFieldError(field, "Format email belum benar.");
    return false;
  }

  if (field.type === "number" && !field.validity.valid) {
    showFieldError(field, "Nilai tidak sesuai rentang yang diminta.");
    return false;
  }

  clearFieldError(field);
  return true;
}

function validateProgram() {
  const checked = form.querySelector("input[name='programStudi']:checked");
  const error = form.querySelector("[data-group-error='programStudi']");
  error.textContent = checked ? "" : "Pilih salah satu program studi.";
  return Boolean(checked);
}

function validateAttachments() {
  const checkedItems = form.querySelectorAll("input[name='berkas']:checked");
  const error = form.querySelector("[data-group-error='berkas']");
  error.textContent = checkedItems.length >= 2 ? "" : "Pilih minimal dua berkas lampiran.";
  return checkedItems.length >= 2;
}

function validateAgreement() {
  const agreement = form.elements.persetujuan;
  const error = form.querySelector("[data-group-error='persetujuan']");
  error.textContent = agreement.checked ? "" : "Persetujuan wajib dicentang.";
  return agreement.checked;
}

function validateForm() {
  const requiredFields = form.querySelectorAll(".field input[required], .field select[required], .field textarea[required]");
  const fieldResults = Array.from(requiredFields).map(validateTextField);
  const textFieldsValid = fieldResults.every(Boolean);
  const programValid = validateProgram();
  const attachmentsValid = validateAttachments();
  const agreementValid = validateAgreement();

  return textFieldsValid && programValid && attachmentsValid && agreementValid;
}

function openSuccessModal() {
  successModal.hidden = false;
  modalButton.focus();
}

function hideSuccessModal() {
  successModal.hidden = true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    const firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
    const firstGroupError = form.querySelector(".group-error:not(:empty)");
    const target = firstError || firstGroupError;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return;
  }

  openSuccessModal();
});

form.addEventListener("reset", () => {
  setTimeout(() => {
    form.querySelectorAll(".field input, .field select, .field textarea").forEach(clearFieldError);
    form.querySelectorAll(".group-error").forEach((error) => {
      error.textContent = "";
    });
  }, 0);
});

form.querySelectorAll(".field input, .field select, .field textarea").forEach((field) => {
  field.addEventListener("input", () => {
    if (field.hasAttribute("required")) {
      validateTextField(field);
    }
  });

  field.addEventListener("blur", () => {
    if (field.hasAttribute("required")) {
      validateTextField(field);
    }
  });
});

form.querySelectorAll("input[name='programStudi']").forEach((input) => {
  input.addEventListener("change", validateProgram);
});

form.querySelectorAll("input[name='berkas']").forEach((input) => {
  input.addEventListener("change", validateAttachments);
});

form.elements.persetujuan.addEventListener("change", validateAgreement);

document.querySelectorAll(".btn, .modal__close").forEach((button) => {
  button.addEventListener("pointerdown", () => button.classList.add("is-pressed"));
  button.addEventListener("pointerup", () => button.classList.remove("is-pressed"));
  button.addEventListener("pointerleave", () => button.classList.remove("is-pressed"));
});

document.querySelectorAll("[data-card]").forEach((card) => {
  card.addEventListener("pointerenter", () => card.classList.add("is-lifted"));
  card.addEventListener("pointerleave", () => card.classList.remove("is-lifted"));
});

closeModal.addEventListener("click", hideSuccessModal);
modalButton.addEventListener("click", hideSuccessModal);

successModal.addEventListener("click", (event) => {
  if (event.target === successModal) {
    hideSuccessModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !successModal.hidden) {
    hideSuccessModal();
  }
});
