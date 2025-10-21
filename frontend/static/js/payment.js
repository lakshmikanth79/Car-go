// payment.js

document.getElementById('paymentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const cardName = document.getElementById('cardName');
    const cardNumber = document.getElementById('cardNumber');
    const expiry = document.getElementById('expiry');
    const cvv = document.getElementById('cvv');
    const status = document.getElementById('paymentStatus');

    const cardNumberError = document.getElementById('cardNumberError');
    const cvvError = document.getElementById('cvvError');
    const nameError = document.getElementById('nameError');
    const expiryError = document.getElementById('expiryError');

    let isValid = true;

    // Reset all errors
    cardNumberError.textContent = "";
    cvvError.textContent = "";
    nameError.textContent = "";
    expiryError.textContent = "";

    // ---- Card Name Validation ----
    if (cardName.value.trim() === "") {
        nameError.textContent = "⚠️ Please enter the cardholder name.";
        isValid = false;
    }

    // ---- Card Number Validation ----
    if (cardNumber.value.trim() === "") {
        cardNumberError.textContent = "⚠️ Please enter your card number.";
        isValid = false;
    } else if (!/^\d+$/.test(cardNumber.value.trim())) {
        cardNumberError.textContent = "❌ Card number must contain only digits.";
        isValid = false;
    } else if (cardNumber.value.trim().length < 16) {
        cardNumberError.textContent = `⚠️ ${16 - cardNumber.value.trim().length} digits missing. Card must be 16 digits.`;
        isValid = false;
    } else if (cardNumber.value.trim().length > 16) {
        cardNumberError.textContent = "⚠️ Card number cannot exceed 16 digits.";
        isValid = false;
    }

    // ---- Expiry Validation ----
    if (expiry.value.trim() === "") {
        expiryError.textContent = "⚠️ Please enter the expiry date.";
        isValid = false;
    }

    // ---- CVV Validation ----
    if (cvv.value.trim() === "") {
        cvvError.textContent = "⚠️ Please enter your CVV.";
        isValid = false;
    } else if (!/^\d+$/.test(cvv.value.trim())) {
        cvvError.textContent = "❌ CVV must contain only digits.";
        isValid = false;
    } else if (cvv.value.trim().length < 3) {
        cvvError.textContent = `⚠️ ${3 - cvv.value.trim().length} digits missing. CVV must be 3 digits.`;
        isValid = false;
    } else if (cvv.value.trim().length > 3) {
        cvvError.textContent = "⚠️ CVV cannot exceed 3 digits.";
        isValid = false;
    }

    if (!isValid) {
        status.textContent = "⚠️ Please fix the highlighted errors.";
        status.style.color = "red";
        return;
    }

    // Simulate payment processing
    status.textContent = "Processing your payment...";
    status.style.color = "black";

    setTimeout(() => {
        // 🔗 Backend Integration (future use)
        // fetch('http://localhost:8080/api/payment', { ... })

        // Mock success
        status.textContent = "✅ Payment Successful! Redirecting...";
        status.style.color = "green";
        setTimeout(() => {
            window.location.href = "confirmation.html";
        }, 2000);
    }, 2000);
});

// ------------------ LIVE INPUT CHECK ------------------

// Attach live check for card number
document.getElementById('cardNumber').addEventListener('input', function () {
    const val = this.value.trim();
    const error = document.getElementById('cardNumberError');
    error.textContent = "";

    if (!/^\d*$/.test(val)) {
        error.textContent = "❌ Only numbers allowed.";
    } else if (val.length < 16) {
        error.textContent = `⚠️ ${16 - val.length} digits missing.`;
    } else if (val.length > 16) {
        error.textContent = "⚠️ Card number cannot exceed 16 digits.";
    }
});

// Attach live check for CVV
document.getElementById('cvv').addEventListener('input', function () {
    const val = this.value.trim();
    const error = document.getElementById('cvvError');
    error.textContent = "";

    if (!/^\d*$/.test(val)) {
        error.textContent = "❌ Only numbers allowed.";
    } else if (val.length < 3) {
        error.textContent = `⚠️ ${3 - val.length} digits missing.`;
    } else if (val.length > 3) {
        error.textContent = "⚠️ CVV cannot exceed 3 digits.";
    }
});
