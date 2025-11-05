// payment.js

document.addEventListener("DOMContentLoaded", async () => {

  // 🔒 Restrict expiry date input (cannot pick month older than current month)
  const expiryInput = document.getElementById("expiry");
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  expiryInput.min = `${year}-${month}`;

  // Countdown Timer (2 minutes)
  let timeLeft = 120; // 2 minutes = 120 seconds
  const timerDisplay = document.getElementById("timer");
  const form = document.getElementById("paymentForm");

  const countdown = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      timerDisplay.textContent = "00:00";
      timerDisplay.style.color = "red";

      // Disable the form
      form.querySelectorAll("input, button").forEach(el => (el.disabled = true));

      // Show message
      document.getElementById("paymentMessage").textContent =
        "❌ Payment session expired. Please go back and start again.";
      document.getElementById("paymentMessage").style.color = "red";
    }

    timeLeft--;
  }, 1000);

  const status = document.getElementById("paymentStatus");
  const params = new URLSearchParams(window.location.search);
  const rent_id = params.get("rent_id");

  if (!rent_id) {
    alert("⚠️ Missing rent ID. Redirecting to home...");
    window.location.href = "home.html";
    return;
  }

  let bookingData;
  try {
    const bookingResp = await fetch(`http://127.0.0.1:5000/api/bookings/rent/${rent_id}`);
    bookingData = await bookingResp.json();
    if (!bookingData.success) throw new Error(bookingData.message || "Booking not found");
  } catch (err) {
    console.error("❌ Error fetching booking:", err);
    alert("⚠️ Unable to load booking details. Please try again.");
    window.location.href = "home.html";
    return;
  }

  const { vehicle_id, start_date, end_date, cust_id, total_amount } = bookingData;

  let vehicle;
  try {
    const vehicleResp = await fetch(`http://127.0.0.1:5000/api/vehicles/${vehicle_id}`);
    vehicle = await vehicleResp.json();
  } catch (err) {
    console.error("❌ Error fetching vehicle:", err);
    alert("⚠️ Unable to load vehicle details. Please try again.");
    return;
  }

  document.getElementById("vehicleName").textContent = `${vehicle.brand} ${vehicle.model}`;
  document.getElementById("dateRange").textContent = `${start_date} → ${end_date}`;
  document.getElementById("totalAmount").textContent = total_amount;

  const paymentForm = document.getElementById("paymentForm");

  // ---------- Form Submission ----------
  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cardName = document.getElementById("cardName").value.trim();
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const expiry = document.getElementById("expiry").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    const nameError = document.getElementById("nameError");
    const cardNumberError = document.getElementById("cardNumberError");
    const expiryError = document.getElementById("expiryError");
    const cvvError = document.getElementById("cvvError");

    [nameError, cardNumberError, expiryError, cvvError].forEach(el => el.textContent = "");

    let isValid = true;

    // ✅ Only alphabets and spaces allowed for name
    if (!/^[A-Za-z ]+$/.test(cardName)) {
      nameError.textContent = "⚠️ Name must contain only letters.";
      isValid = false;
    }

    // ✅ Only numbers, exactly 16 digits
    if (!/^\d{16}$/.test(cardNumber)) {
      cardNumberError.textContent = "⚠️ Card number must be 16 digits (numbers only).";
      isValid = false;
    }

    if (!expiry) {
      expiryError.textContent = "⚠️ Enter the expiry date.";
      isValid = false;
    }

    // ✅ CVV must be 3 digits, only numbers
    if (!/^\d{3}$/.test(cvv)) {
      cvvError.textContent = "⚠️ CVV must be 3 digits (numbers only).";
      isValid = false;
    }

    if (!isValid) {
      status.textContent = "❌ Please fix the errors above.";
      status.style.color = "red";
      return;
    }

    status.textContent = "Processing your payment...";
    status.style.color = "black";

    const paymentData = {
      rent_id: parseInt(rent_id),
      cust_id: cust_id,
      amount: parseFloat(total_amount),
      payment_method: "Card"
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/payments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Payment failed");

      status.textContent = "✅ Payment successful! Redirecting...";
      status.style.color = "green";

      setTimeout(() => {
        window.location.href = `confirmation.html?rent_id=${rent_id}`;
      }, 2000);

    } catch (err) {
      console.error("❌ Payment failed:", err);
      status.textContent = "❌ Payment failed. Cancelling booking...";
      status.style.color = "red";

      try {
        await fetch("http://127.0.0.1:5000/api/payments/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rent_id: rent_id })
        });
        console.log("⚠️ Booking cancelled due to failed payment");
      } catch (cancelErr) {
        console.error("⚠️ Failed to cancel booking:", cancelErr);
      }
    }
  });
});
