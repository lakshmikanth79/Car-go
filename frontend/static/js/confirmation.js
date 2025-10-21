document.addEventListener("DOMContentLoaded", () => {
    const downloadBtn = document.getElementById("downloadReceipt");

    // 🔗 Backend Integration:
    // In real implementation, fetch booking details dynamically:
    // fetch("http://localhost:8080/api/booking/confirmation?bookingId=BK2025001")
    //   .then(res => res.json())
    //   .then(data => {
    //       document.querySelector(".receipt").innerHTML = `
    //           <h3>Booking Receipt</h3>
    //           <p><strong>Booking ID:</strong> ${data.bookingId}</p>
    //           <p><strong>Name:</strong> ${data.userName}</p>
    //           <p><strong>Car:</strong> ${data.carName}</p>
    //           <p><strong>Pickup Date:</strong> ${data.pickupDate}</p>
    //           <p><strong>Return Date:</strong> ${data.returnDate}</p>
    //           <p><strong>Total Amount Paid:</strong> ₹ ${data.totalAmount}</p>
    //       `;
    //   });

    // Download or print the receipt
    downloadBtn.addEventListener("click", () => {
        window.print(); // simple print/download feature
    });
});
