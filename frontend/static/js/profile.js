// =======================
// PROFILE PAGE SCRIPT
// =======================

// Get logged-in user
const userId = localStorage.getItem("cust_id");
if (!userId) {
    alert("⚠️ Please log in to view your profile.");
    window.location.href = "login.html";
}

// Elements
const usernameEl = document.getElementById("username");
const bookingList = document.getElementById("bookingList");
const currentTab = document.getElementById("currentTab");
const pastTab = document.getElementById("pastTab");

// User object to populate from backend
let user = {
    name: "",
    currentBookings: [],
    pastBookings: []
};

// =======================
// FETCH USER BOOKINGS
// =======================
async function loadBookings() {
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/profile/${userId}`);
        const data = await res.json();

        if (!data.success) {
            throw new Error(data.message || "Failed to load bookings");
        }

        // Fill user data
        user.name = localStorage.getItem("cust_name") || "User";
        user.currentBookings = data.current;
        user.pastBookings = data.past;

        usernameEl.textContent = user.name;
        renderBookings("current");

    } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        bookingList.innerHTML = `<p class='no-bookings'>Error loading bookings. Please try again later.</p>`;
    }
}

// =======================
// RENDER BOOKINGS
// =======================
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
                <h4>${b.vehicle_name || "Unknown Vehicle"}</h4>
                <p><strong>From:</strong> ${b.start_date}</p>
                <p><strong>To:</strong> ${b.end_date}</p>
                <p><strong>Amount:</strong> ₹${b.amount || "-"}</p>
                <p><strong>Status:</strong> ${b.status}</p>
                <p><strong>Payment:</strong> ${b.payment_done ? "✅ Done" : "❌ Pending"}</p>
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

// =======================
// TAB SWITCH HANDLERS
// =======================
currentTab.addEventListener("click", () => {
    currentTab.classList.add("active");
    pastTab.classList.remove("active");
    renderBookings("current");
});

pastTab.addEventListener("click", () => {
    pastTab.classList.add("active");
    currentTab.classList.remove("active");
    renderBookings("past");
});

// =======================
// CANCEL BOOKING
// =======================
async function cancelBooking(id) {
    const reason = prompt("Please enter reason for cancellation:");
    if (!reason) return alert("Cancellation reason required.");

    try {
        const res = await fetch(`http://127.0.0.1:5000/api/profile/cancel/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reason })
        });

        const data = await res.json();
        if (data.success) {
            alert("✅ Booking cancelled successfully!");
            loadBookings(); // refresh list
        } else {
            alert("❌ Failed to cancel: " + (data.message || "Unknown error"));
        }

    } catch (err) {
        console.error("❌ Error cancelling booking:", err);
        alert("Error while cancelling booking. Please try again.");
    }
}

// =======================
// LOGOUT HANDLER
// =======================
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    alert("Logged out successfully!");
    window.location.href = "login.html";
});

// =======================
// INITIAL LOAD
// =======================
loadBookings();
