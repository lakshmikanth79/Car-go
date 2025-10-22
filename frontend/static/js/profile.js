// Mock user data — replace with backend fetch
const user = {
    name: "Lakshmikanth",
    currentBookings: [
        {
            reservation_id: 101,
            vehicle: "Toyota Innova",
            start: "2025-10-20",
            end: "2025-10-25",
            status: "Booked"
        },
        {
            reservation_id: 102,
            vehicle: "Hyundai Verna",
            start: "2025-10-28",
            end: "2025-10-30",
            status: "Booked"
        }
    ],
    pastBookings: [
        {
            reservation_id: 88,
            vehicle: "Honda City",
            start: "2025-09-01",
            end: "2025-09-05",
            status: "Completed"
        },
        {
            reservation_id: 92,
            vehicle: "Tata Nexon",
            start: "2025-09-10",
            end: "2025-09-12",
            status: "Cancelled"
        }
    ]
};

// Display username
document.getElementById('username').textContent = user.name;

// Elements
const bookingList = document.getElementById('bookingList');
const currentTab = document.getElementById('currentTab');
const pastTab = document.getElementById('pastTab');

// Function to render booking cards
function renderBookings(type) {
    bookingList.innerHTML = "";

    const bookings = type === "current" ? user.currentBookings : user.pastBookings;

    if (bookings.length === 0) {
        bookingList.innerHTML = "<p class='no-bookings'>No bookings found.</p>";
        return;
    }

    bookings.forEach(b => {
        const card = document.createElement("div");
        card.classList.add("booking-card");

        card.innerHTML = `
            <div class="booking-details">
                <h4>${b.vehicle}</h4>
                <p><strong>From:</strong> ${b.start}</p>
                <p><strong>To:</strong> ${b.end}</p>
                <p><strong>Status:</strong> ${b.status}</p>
            </div>
            ${
                type === "current" && b.status === "Booked"
                ? `<button class="cancel-btn" onclick="cancelBooking(${b.reservation_id})">Cancel</button>`
                : ""
            }
        `;

        bookingList.appendChild(card);
    });
}

// Handle tab switching
currentTab.addEventListener('click', () => {
    currentTab.classList.add('active');
    pastTab.classList.remove('active');
    renderBookings("current");
});

pastTab.addEventListener('click', () => {
    pastTab.classList.add('active');
    currentTab.classList.remove('active');
    renderBookings("past");
});

// Handle cancellation
function cancelBooking(id) {
    const reason = prompt("Please enter the reason for cancellation:");
    if (!reason) return alert("Cancellation reason required.");

    // 🔹 FRONTEND MOCK ACTION
    alert(`Booking #${id} cancelled successfully!`);

    // 🔹 BACKEND INTEGRATION POINT
    /*
    fetch('/api/cancel_reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservation_id: id, cancel_reason: reason })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Booking cancelled successfully!");
            // Optionally refresh bookings
        } else {
            alert("Failed to cancel booking.");
        }
    });
    */
}

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    // 🔹 BACKEND INTEGRATION POINT
    // fetch('/api/logout', { method: 'POST' })
    //     .then(() => window.location.href = 'login.html');

    alert("Logged out successfully!");
    window.location.href = "login.html";
});

// Default load — show current bookings
renderBookings("current");
