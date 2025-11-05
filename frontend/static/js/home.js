document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector(".vehicle-grid");

  const vehicleImages = {
    "Maruti Suzuki Dzire": "http://127.0.0.1:5000/images/dzire.avif",
    "Honda City": "http://127.0.0.1:5000/images/city.webp",
    "Volkswagen Virtus": "http://127.0.0.1:5000/images/virtus.jpg",
    "Toyota Innova": "http://127.0.0.1:5000/images/innova.avif",
    "BMW M4": "http://127.0.0.1:5000/images/m4.avif"
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/api/vehicles/");
    if (!response.ok) throw new Error("Failed to fetch vehicle data");

    const vehicles = await response.json();

    // ✅ Group by brand+model
    const groupedVehicles = {};
    vehicles.forEach((v) => {
      const key = `${v.brand} ${v.model}`.trim();
      if (!groupedVehicles[key]) groupedVehicles[key] = [];
      groupedVehicles[key].push(v);
    });

    // ✅ Create one card per model
    Object.keys(groupedVehicles).forEach((key) => {
      const cars = groupedVehicles[key];
      const sample = cars[0];
      const imagePath = vehicleImages[key] || "/images/default.jpg";
      const ids = cars.map(c => c.vehicle_id).join(",");

      const card = document.createElement("div");
      card.classList.add("vehicle-card");

      card.innerHTML = `
        <img src="${imagePath}" alt="${key}">
        <div class="vehicle-info">
          <h3>${key}</h3>
          <p><strong>Type:</strong> ${sample.vehicle_type}</p>
          <p><strong>Rent/Day:</strong> ₹${sample.rent_per_day}</p>
          <p class="vehicle-available">Available</p>
        </div>
      `;

      // ✅ Send all IDs to booking page
      card.addEventListener("click", () => {
        window.location.href = `booking.html?vehicle_ids=${ids}&model=${encodeURIComponent(key)}`;
      });

      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    alert("⚠️ Unable to load vehicles. Please try again later.");
  }
});
