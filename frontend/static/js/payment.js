document.addEventListener("DOMContentLoaded", () => {
  const booking = JSON.parse(localStorage.getItem("bookingDetails"));
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const vehicle = JSON.parse(localStorage.getItem("selectedVehicle"));

  if (!booking || !user || !vehicle) {
    alert("⚠️ Missing booking, vehicle, or user data! Please book again.");
    window.location.href = "home.html";
    return;
  }

  // ✅ Populate summary fields
  document.getElementById("vehicleName").innerText = `${vehicle.brand} ${vehicle.model}`;
  document.getElementById("duration").innerText = `${booking.days} days`;
  document.getElementById("totalAmount").innerText = booking.totalAmount;

  // ✅ Handle payment submission
  document.getElementById("paymentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const cardName = document.getElementById("cardName").value.trim();
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const expiryDate = document.getElementById("expiryDate").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      alert("⚠️ Please fill in all payment fields.");
      return;
    }

    const paymentBody = {
      booking_id: booking.booking_id,
      cust_id: user.cust_id,
      vehicle_id: booking.vehicle_id,
      amount: booking.totalAmount,
      payment_method: "Card",
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentBody),
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ Payment Successful!");
        localStorage.setItem("paymentData", JSON.stringify(paymentBody));
        window.location.href = "confirmation.html";
      } else {
        alert("❌ Payment Failed! " + (result.message || ""));
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("⚠️ Server error during payment.");
    }
  });
});
