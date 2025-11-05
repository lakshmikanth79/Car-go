document.addEventListener("DOMContentLoaded", () => {

    // =======================
    // PROFILE PAGE SCRIPT
    // =======================

    // Get logged-in user
    const userId = localStorage.getItem("cust_id");
    if (!userId) {
        alert("⚠️ Please log in to view your profile.");
        window.location.href = "login.html";
        return;
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
    // CANCEL BOOKING (with modal popup)
    // =======================

    // Modal elements
    const cancelModal = document.getElementById('cancelModal');
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelReasonInput = document.getElementById('cancelReason');

    let selectedBookingId = null;

    // Show modal when Cancel button clicked
    window.cancelBooking = function (id) {
        selectedBookingId = id;
        const modal = document.getElementById("cancelModal");
        modal.style.display = "flex"; // flex ensures it centers
    };

    // Confirm cancellation
    confirmCancelBtn.addEventListener('click', async () => {
        const reason = cancelReasonInput.value.trim();
        if (!reason) {
            alert("Please enter a reason for cancellation.");
            return;
        }

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/profile/cancel/${selectedBookingId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason })
            });

            const data = await res.json();
            if (data.success) {
                alert("✅ Booking cancelled successfully!");
                cancelModal.style.display = 'none';
                cancelReasonInput.value = "";
                loadBookings(); // refresh list
            } else {
                alert("❌ Failed to cancel: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("❌ Error cancelling booking:", err);
            alert("Error while cancelling booking. Please try again.");
        }
    });

    // Close modal
    closeModalBtn.addEventListener('click', () => {
        cancelModal.style.display = 'none';
        cancelReasonInput.value = "";
    });


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
});
