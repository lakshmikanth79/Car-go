const selectedVehicle = JSON.parse(localStorage.getItem("selectedVehicle"));
const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!selectedVehicle || !user) {
  alert("⚠️ Missing vehicle or user info! Please log in again.");
  window.location.href = "login.html";
}

document.getElementById("vehicleImage").src = `../images/${selectedVehicle.image || 'default.jpg'}`;
document.getElementById("vehicleName").innerText = `${selectedVehicle.brand} ${selectedVehicle.model}`;
document.getElementById("rentPerDay").innerText = selectedVehicle.rent_per_day;

const startDateEl = document.getElementById("startDate");
const endDateEl = document.getElementById("endDate");
const totalRentEl = document.getElementById("totalRent");

function calculateTotal() {
  if (!startDateEl.value || !endDateEl.value) return (totalRentEl.innerText = "0");
  const start = new Date(startDateEl.value);
  const end = new Date(endDateEl.value);
  const days = Math.max(1, (end - start) / (1000 * 60 * 60 * 24) + 1);
  const total = days * selectedVehicle.rent_per_day;
  totalRentEl.innerText = total;
  return { days, total };
}

[startDateEl, endDateEl].forEach((el) => el.addEventListener("change", calculateTotal));

document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const { days, total } = calculateTotal();

  const bookingData = {
    cust_id: user.cust_id,
    vehicle_id: selectedVehicle.vehicle_id,
    start_date: startDateEl.value,
    end_date: endDateEl.value,
    pickup_location: document.getElementById("pickupLocation").value,
  };

  try {
    const res = await fetch("http://127.0.0.1:5000/booking/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const result = await res.json();

    if (result.success) {
      // ✅ Save both calculated and backend booking info
      const storedBooking = {
        ...bookingData,
        booking_id: result.booking_id || result.reservation_id,
        totalAmount: total,
        days,
      };
      localStorage.setItem("bookingDetails", JSON.stringify(storedBooking));
      window.location.href = "payment.html";
    } else {
      alert("❌ Booking failed! " + (result.message || ""));
    }
  } catch (err) {
    console.error("Booking error:", err);
    alert("⚠️ Server error during booking.");
  }
});
