// booking.js

// ---------- TEMPORARY STATIC DATA (Replace with backend integration) ----------
const selectedVehicle = JSON.parse(localStorage.getItem("selectedVehicle")) || {
  vehicle_id: 12,
  brand: "Maruti Suzuki",
  model: "Dzire",
  type: "Car",
  rent_per_day: 1500,
  image: "../images/dzire.avif"
};

// ---------- POPULATE VEHICLE INFO ----------
document.getElementById("vehicleImage").src = selectedVehicle.image;
document.getElementById("vehicleName").innerText = `${selectedVehicle.brand} ${selectedVehicle.model}`;
document.getElementById("vehicleType").innerText = selectedVehicle.type;
document.getElementById("vehicleBrand").innerText = selectedVehicle.brand;
document.getElementById("rentPerDay").innerText = `${selectedVehicle.rent_per_day}`;

// ---------- CALCULATE TOTAL RENT ----------
const startDateEl = document.getElementById("startDate");
const endDateEl = document.getElementById("endDate");
const totalRentEl = document.getElementById("totalRent");

function calculateTotal() {
  const startDate = new Date(startDateEl.value);
  const endDate = new Date(endDateEl.value);

  if (!startDateEl.value || !endDateEl.value) {
    totalRentEl.innerText = "0";
    return;
  }

  if (endDate < startDate) {
    totalRentEl.innerText = "Invalid date range";
    return;
  }

  // 🧮 Calculate number of days (include same-day booking as 1 day)
  const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const total = diffDays * selectedVehicle.rent_per_day;
  totalRentEl.innerText = `${total}`;
}

startDateEl.addEventListener("change", calculateTotal);
endDateEl.addEventListener("change", calculateTotal);

// ---------- FORM SUBMISSION ----------
document.getElementById("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const pickupLocation = document.getElementById("pickupLocation").value;
  const startDate = startDateEl.value;
  const endDate = endDateEl.value;

  if (!startDate || !endDate) {
    alert("Please select both start and end dates!");
    return;
  }

  const totalAmount = totalRentEl.innerText.replace("₹", "").trim();

  const bookingData = {
    cust_id: 1, // 🔹 Replace with logged-in customer ID (from backend session)
    vehicle_id: selectedVehicle.vehicle_id,
    start_date: startDate,
    end_date: endDate,
    pickup_location: pickupLocation,
    total_rent: totalAmount
  };

  console.log("Booking Data (frontend mock):", bookingData);

  // 🔹 BACKEND INTEGRATION POINT:
  // fetch("/api/book_vehicle", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(bookingData)
  // })
  // .then(res => res.json())
  // .then(data => {
  //   if (data.success) {
  //     localStorage.setItem("bookingData", JSON.stringify(data));
  //     window.location.href = "payment.html";
  //   } else {
  //     alert("Booking failed!");
  //   }
  // });

  // 🧩 TEMP FRONTEND REDIRECT (simulate backend success)
  localStorage.setItem("bookingData", JSON.stringify(bookingData));
  window.location.href = "payment.html";
});
