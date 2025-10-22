// Temporary vehicle data (this will come from backend API later)
const vehicles = [
  {
    id: 1,
    name: "Maruti Suzuki Dzire",
    type: "Sedan",
    model: "LXI 2024",
    rent: 1500,
    available: true,
    image: "../images/dzire.avif"
  },
  {
    id: 2,
    name: "Honda City",
    type: "Sedan",
    model: "ZX 2023",
    rent: 1800,
    available: false,
    image: "../images/city.webp"
  },
  {
    id: 3,
    name: "Volkswagen Virtus",
    type: "Sedan",
    model: "TSI 2024",
    rent: 2000,
    available: true,
    image: "../images/virtus.jpg"
  },
  {
    id: 4,
    name: "Toyota Innova Crysta",
    type: "SUV",
    model: "2.4 ZX 2023",
    rent: 2500,
    available: true,
    image: "../images/innova.avif"
  },
  {
    id: 5,
    name: "BMW M4 Competition",
    type: "Sports",
    model: "2024",
    rent: 5500,
    available: false,
    image: "../images/m4.avif"
  }
];

const grid = document.querySelector('.vehicle-grid');

// Render vehicles dynamically
vehicles.forEach(vehicle => {
  const card = document.createElement('div');
  card.classList.add('vehicle-card');

  card.innerHTML = `
    <img src="${vehicle.image}" alt="${vehicle.name}">
    <div class="vehicle-info">
      <h3>${vehicle.name}</h3>
      <p><strong>Type:</strong> ${vehicle.type}</p>
      <p><strong>Model:</strong> ${vehicle.model}</p>
      <p><strong>Rent/Day:</strong> ₹${vehicle.rent}</p>
      <p class="${vehicle.available ? 'vehicle-available' : 'vehicle-unavailable'}">
        ${vehicle.available ? 'Available' : 'Not Available'}
      </p>
    </div>
  `;

  if (vehicle.available) {
    card.addEventListener('click', () => {
      // ⬇️ Placeholder: replace this with backend booking redirection
      window.location.href = `booking.html?vehicle_id=${vehicle.id}`;
    });
  }

  grid.appendChild(card);
});

/*
  🔁 In real backend integration:
  - Fetch vehicles via fetch('/api/vehicles')
  - Update vehicle availability dynamically
  - Handle redirects with authenticated customer ID
*/
