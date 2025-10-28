document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector(".vehicle-grid");

  // 🔹 Image map for each brand + model
  const vehicleImages = {
    "Maruti Suzuki Dzire": "/images/dzire.avif",
    "Honda City": "/images/city.webp",
    "Volkswagen Virtus": "/images/virtus.jpg",
    "Toyota Innova": "/images/innova.avif",
    "BMW M4": "/images/m4.avif"
  };

  try {
    // 🔹 Fetch all vehicles from backend
    const response = await fetch("http://127.0.0.1:5000/api/vehicles/");
    if (!response.ok) throw new Error("Failed to fetch vehicle data");

    const vehicles = await response.json();

    // ✅ Group vehicles by brand + model
    const groupedVehicles = {};
    vehicles.forEach((v) => {
      const key = `${v.brand} ${v.model}`.trim();
      if (!groupedVehicles[key]) groupedVehicles[key] = [];
      groupedVehicles[key].push(v);
    });

    // ✅ Always show “Available” for every model
    Object.keys(groupedVehicles).forEach((key) => {
      const cars = groupedVehicles[key];
      const sample = cars[0]; // representative car
      const imagePath = vehicleImages[key] || "/images/default.jpg";

      const card = document.createElement("div");
      card.classList.add("vehicle-card");

      card.innerHTML = `
        <img src="${imagePath}" alt="${key}">
        <div class="vehicle-info">
          <h3>${key}</h3>
          <p><strong>Type:</strong> ${sample.vehicle_type}</p>
          <p><strong>Model:</strong> ${sample.model}</p>
          <p><strong>Rent/Day:</strong> ₹${sample.rent_per_day}</p>
          <p class="vehicle-available">Available</p>
        </div>
      `;

      // ✅ Always clickable — choose first car for booking
      card.addEventListener("click", () => {
        const firstCar = cars[0];
        window.location.href = `booking.html?vehicle_id=${firstCar.vehicle_id}`;
      });

      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    alert("⚠️ Unable to load vehicles. Please try again later.");
  }
});
