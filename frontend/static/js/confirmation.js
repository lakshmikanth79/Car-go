document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const booking = JSON.parse(localStorage.getItem("bookingData"));
  const payment = JSON.parse(localStorage.getItem("paymentData"));
  const receipt = document.querySelector(".receipt");

  if (!user || !booking || !payment) {
    alert("Missing confirmation data!");
    window.location.href = "home.html";
    return;
  }

  receipt.innerHTML = `
    <h3>Booking Receipt</h3>
    <p><strong>Name:</strong> ${user.cust_name}</p>
    <p><strong>Booking ID:</strong> ${booking.reservation_id}</p>
    <p><strong>Car ID:</strong> ${booking.vehicle_id}</p>
    <p><strong>Total Paid:</strong> ₹${payment.amount}</p>
    <p><strong>Status:</strong> Confirmed</p>
  `;

  document.getElementById("downloadReceipt").addEventListener("click", () => window.print());
});
