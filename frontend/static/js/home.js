document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('.vehicle-grid');

  try {
    const res = await fetch("http://127.0.0.1:5000/vehicle/all");
    const data = await res.json();

    if (data.success && Array.isArray(data.vehicles)) {
      grid.innerHTML = ""; // clear previous content

      data.vehicles.forEach(vehicle => {
        const isAvailable = vehicle.is_available; // ✅ uses backend boolean

        const card = document.createElement('div');
        card.classList.add('vehicle-card');
        card.innerHTML = `
          <img src="../images/${vehicle.image || 'default.jpg'}" alt="${vehicle.brand}">
          <div class="vehicle-info">
            <h3>${vehicle.brand} ${vehicle.model}</h3>
            <p><strong>Type:</strong> ${vehicle.type || vehicle.vehicle_type}</p>
            <p><strong>Rent/Day:</strong> ₹${vehicle.rent_per_day}</p>
            <p class="${isAvailable ? 'vehicle-available' : 'vehicle-unavailable'}">
              ${isAvailable ? 'Available' : 'Not Available'}
            </p>
          </div>
        `;

        // ✅ Add click listener only if available
        if (isAvailable) {
          card.style.cursor = "pointer";

          card.addEventListener('click', async () => {
            // Save vehicle to localStorage for booking page
            localStorage.setItem("selectedVehicle", JSON.stringify(vehicle));

            // Update backend status → Unavailable
            try {
              const updateRes = await fetch(`http://127.0.0.1:5000/vehicle/update/${vehicle.vehicle_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_available: false }),
              });

              const updateData = await updateRes.json();
              if (updateData.success) {
                alert(`✅ ${vehicle.brand} ${vehicle.model} booked successfully!`);
                window.location.href = "booking.html";
              } else {
                alert("⚠️ Could not update vehicle availability.");
              }
            } catch (err) {
              console.error("Error updating vehicle status:", err);
              alert("⚠️ Server error while updating vehicle status.");
            }
          });
        }

        grid.appendChild(card);
      });

    } else {
      grid.innerHTML = "<p>No vehicles found.</p>";
    }

  } catch (error) {
    console.error("Error loading vehicles:", error);
    grid.innerHTML = "<p>Failed to load vehicles.</p>";
  }
});
