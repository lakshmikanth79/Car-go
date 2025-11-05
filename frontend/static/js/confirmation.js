// ✅ confirmation.js — Car-Go
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const rent_id = params.get("rent_id");

  const bookingIdEl = document.getElementById("bookingId");
  const custNameEl = document.getElementById("custName");
  const vehicleNameEl = document.getElementById("vehicleName");
  const pickupDateEl = document.getElementById("pickupDate");
  const returnDateEl = document.getElementById("returnDate");
  const paymentDateEl = document.getElementById("paymentDate");
  const totalAmountEl = document.getElementById("totalAmount");

  if (!rent_id) {
    document.getElementById("bookingSummary").innerHTML =
      "<p style='color:red;'>⚠️ No booking reference found. Please go back to home.</p>";
    return;
  }

  try {
    // 🔹 Fetch payment + related booking details
    const response = await fetch(`http://127.0.0.1:5000/api/payments/${rent_id}`);
    const data = await response.json();

    console.log("Payment details response:", data); // ✅ Debugging

    if (!response.ok || !data.success) {
      document.getElementById("bookingSummary").innerHTML =
        `<p style='color:red;'>⚠️ ${data.message || "Payment record not found."}</p>`;
      return;
    }

    // 🔹 Extract payment object from response
    const payment = data.payment;

    // 🔹 Populate confirmation fields
    bookingIdEl.textContent = payment.rent_id || "N/A";
    custNameEl.textContent = payment.customer_name || "N/A";
    vehicleNameEl.textContent = payment.vehicle_name || "N/A";
    pickupDateEl.textContent = payment.start_date || "N/A";
    returnDateEl.textContent = payment.end_date || "N/A";
    paymentDateEl.textContent = payment.payment_date || "N/A";
    totalAmountEl.textContent = payment.amount || "N/A";

  } catch (error) {
    console.error("❌ Error loading confirmation:", error);
    document.getElementById("bookingSummary").innerHTML =
      "<p style='color:red;'>⚠️ Unable to load confirmation details. Please try again later.</p>";
  }

  // 🔹 Print / Download Receipt
  const downloadBtn = document.getElementById("downloadReceipt");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      window.print();
    });
  }
});
