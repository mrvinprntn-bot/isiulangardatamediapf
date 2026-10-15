"use strict";

// Ganti dengan informasi rekening resmi Anda.
const PAYMENT = Object.freeze({
  bankName: "BTN",
  accountNumber: "",
  accountHolder: ""
});

const MIN_AMOUNT = 1000;
const MAX_AMOUNT = 100000000;

const amountInput = document.getElementById("amount");
const totalElement = document.getElementById("total");
const noticeElement = document.getElementById("notice");

const bankNameElement = document.getElementById("bankName");
const accountNumberElement =
  document.getElementById("accountNumber");
const accountHolderElement =
  document.getElementById("accountHolder");

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

function getAmount() {
  const raw = amountInput.value.trim();

  if (raw === "") return null;

  const value = Number(raw);

  if (
    !Number.isSafeInteger(value) ||
    value < MIN_AMOUNT ||
    value > MAX_AMOUNT
  ) {
    return null;
  }

  return value;
}

function updateTotal() {
  const value = getAmount();

  totalElement.textContent =
    value === null
      ? "Nominal tidak valid"
      : formatRupiah(value);
}

function showNotice(message) {
  noticeElement.textContent = message;
  noticeElement.hidden = false;
}

function hideNotice() {
  noticeElement.textContent = "";
  noticeElement.hidden = true;
}

async function copyText(text) {
  if (!text) {
    showNotice(
      "Informasi belum diatur oleh pengelola website."
    );
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showNotice("Berhasil disalin.");
  } catch {
    showNotice(
      "Gagal menyalin otomatis. Silakan salin secara manual."
    );
  }
}

// Tampilkan informasi rekening.
bankNameElement.textContent = PAYMENT.bankName;

accountNumberElement.textContent =
  PAYMENT.accountNumber || "8901 7001 3376 9";

accountHolderElement.textContent =
  PAYMENT.accountHolder || "ELIS";

// Perbarui total saat nominal berubah.
amountInput.addEventListener("input", () => {
  hideNotice();
  updateTotal();
});

// Tombol nominal cepat.
document.querySelectorAll("[data-amount]").forEach((button) => {
  button.addEventListener("click", () => {
    amountInput.value = button.dataset.amount;
    hideNotice();
    updateTotal();
  });
});

// Salin nomor rekening.
document.getElementById("copyAccount").addEventListener(
  "click",
  () => {
    copyText(PAYMENT.accountNumber);
  }
);

// Salin nominal transfer.
document.getElementById("copyAmount").addEventListener(
  "click",
  () => {
    const value = getAmount();

    if (value === null) {
      showNotice(
        "Masukkan nominal antara Rp1.000 dan Rp100.000.000."
      );
      return;
    }

    // Menyalin angka saja, misalnya 45000.
    copyText(String(value));
  }
);

// Konfirmasi pembayaran.
document.getElementById("confirm").addEventListener(
  "click",
  () => {
    const value = getAmount();

    if (value === null) {
      showNotice(
        "Masukkan nominal antara Rp1.000 dan Rp100.000.000."
      );
      return;
    }

    showNotice(
      `Nominal ${formatRupiah(value)} telah dipilih. ` +
      "Pembayaran belum diverifikasi secara otomatis. " +
      "Simpan bukti transfer dan hubungi pengelola " +
      "untuk konfirmasi pembayaran."
    );
  }
);

// Tampilkan nominal awal.
updateTotal();
