// booking.js

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const vehicleId = params.get("vehicle_id");

  if (!vehicleId) {
    alert("No vehicle selected!");
    window.location.href = "home.html";
    return;
  }

  const vehicleImages = {
    "Dzire": "../images/dzire.avif",
    "City": "../images/city.webp",
    "Virtus": "../images/virtus.jpg",
    "Innova": "../images/innova.avif",
    "M4": "../images/m4.avif"
  };

  try {
    // 🔹 Fetch selected vehicle details from backend
    const response = await fetch(`http://127.0.0.1:5000/api/vehicles/${vehicleId}`);
    if (!response.ok) throw new Error("Vehicle not found");
    const vehicle = await response.json();

    // ---------- 🖼️ Populate Vehicle Info ----------
    const imageSrc = vehicleImages[vehicle.model] || "../images/default.jpg";
    document.getElementById("vehicleImage").src = imageSrc;
    document.getElementById("vehicleName").innerText = `${vehicle.brand} ${vehicle.model}`;
    document.getElementById("vehicleType").innerText = vehicle.vehicle_type || "N/A";
    document.getElementById("vehicleBrand").innerText = vehicle.brand;
    document.getElementById("rentPerDay").innerText = vehicle.rent_per_day;

    // ---------- 🗓️ Date Validation ----------
    const startDateEl = document.getElementById("startDate");
    const endDateEl = document.getElementById("endDate");
    const totalRentEl = document.getElementById("totalRent");

    const today = new Date().toISOString().split("T")[0];
    startDateEl.min = today;
    endDateEl.min = today;

    // ---------- 💰 Rent Calculation ----------
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

      const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const total = diffDays * vehicle.rent_per_day;
      totalRentEl.innerText = `${total}`;
    }

    startDateEl.addEventListener("change", () => {
      // Set end date's minimum = selected start date
      endDateEl.min = startDateEl.value;
      calculateTotal();
    });

    endDateEl.addEventListener("change", calculateTotal);


    // ---------- 📦 Form Submission ----------
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

      // 🔹 Get logged-in customer info
      const custId = localStorage.getItem("cust_id");
      const custName = localStorage.getItem("cust_name");

      if (!custId) {
        alert("⚠️ Please login first!");
        window.location.href = "login.html";
        return;
      }

      const bookingData = {
        cust_id: parseInt(custId),
        vehicle_id: vehicle.vehicle_id,
        start_date: startDate,
        end_date: endDate,
        pickup_location: pickupLocation,
        total_rent: totalAmount
      };


      console.log("Booking Data:", bookingData);

      // 🔹 Send booking data to backend
      fetch("http://127.0.0.1:5000/api/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            console.log("✅ Booking successful:", result);

            // Store necessary info for payment page
            localStorage.setItem("bookingData", JSON.stringify({
              ...bookingData,
              reservation_id: result.reservation_id,
              rent_id: result.rent_id
            }));

            // Redirect with rent_id in URL for clarity
            window.location.href = `payment.html?rent_id=${result.rent_id}`;
          } else {
            alert(result.message || "Booking failed!");
          }
        })
        .catch(err => {
          console.error("❌ Booking API error:", err);
          alert("Booking failed! Please try again later.");
        });

    });

  } catch (err) {
    console.error(err);
    alert("⚠️ Unable to load vehicle details.");
  }
});
