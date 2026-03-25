const bookingsContainer = document.getElementById("bookings");

const myCustomerName = sessionStorage.getItem("myCustomerName");

function getBookings() {
  fetch("https://hotelbooking.stepprojects.ge/api/Booking")
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return res.json();
    })
    .then(data => {
      console.log("BOOKINGS DATA:", data);
      renderBookings(data);
    })
    .catch(err => {
      console.error(err);
      bookingsContainer.innerHTML = "<p>Could not load bookings</p>";
    });
}

function renderBookings(bookings) {
  bookingsContainer.innerHTML = "";

  if (!myCustomerName) {
    bookingsContainer.innerHTML = "<p>No bookings yet</p>";
    return;
  }

  const myBookings = bookings.filter(booking => booking.customerName === myCustomerName);

  if (myBookings.length === 0) {
    bookingsContainer.innerHTML = "<p>No bookings yet</p>";
    return;
  }

  myBookings.forEach(booking => {
    bookingsContainer.innerHTML += `
      <div class="booking-card">
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Hotel ID:</strong> ${booking.hotelId}</p>
        <p><strong>Room ID:</strong> ${booking.roomId}</p>
        <p><strong>Name:</strong> ${booking.customerName}</p>
        <p><strong>Check In:</strong> ${booking.checkInDate}</p>
        <p><strong>Check Out:</strong> ${booking.checkOutDate}</p>
        <button class="delete-btn" onclick="deleteBooking(${booking.id})">Delete</button>
      </div>
    `;
  });
}

function deleteBooking(id) {
  fetch(`https://hotelbooking.stepprojects.ge/api/Booking/${id}`, {
    method: "DELETE"
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Delete failed");
    }
    alert("Deleted successfully ✅");
    getBookings();
  })
  .catch(err => {
    console.error(err);
    alert("Delete failed ❌");
  });
}


getBookings();