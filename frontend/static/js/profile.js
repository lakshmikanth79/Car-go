document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return (window.location.href = "index.html");

  document.getElementById('username').textContent = user.cust_name;
  const bookingList = document.getElementById('bookingList');

  async function fetchBookings() {
    const res = await fetch(`http://127.0.0.1:5000/profile/${user.cust_id}`);
    const data = await res.json();

    if (data.success) renderBookings(data.bookings);
    else bookingList.innerHTML = "<p>No bookings found.</p>";
  }

  function renderBookings(bookings) {
    bookingList.innerHTML = "";
    bookings.forEach(b => {
      const card = document.createElement("div");
      card.classList.add("booking-card");
      card.innerHTML = `
        <div class="booking-details">
          <h4>${b.brand} ${b.model}</h4>
          <p><strong>From:</strong> ${b.start_date}</p>
          <p><strong>To:</strong> ${b.end_date}</p>
          <p><strong>Status:</strong> ${b.status}</p>
        </div>
        ${b.status === "Booked" ? `<button class="cancel-btn" onclick="cancelBooking(${b.reservation_id})">Cancel</button>` : ""}
      `;
      bookingList.appendChild(card);
    });
  }

  window.cancelBooking = async (id) => {
    const reason = prompt("Reason for cancellation:");
    const res = await fetch("http://127.0.0.1:5000/profile/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservation_id: id, cancel_reason: reason }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Cancelled successfully!");
      fetchBookings();
    } else alert("Failed to cancel booking.");
  };

  fetchBookings();
});
