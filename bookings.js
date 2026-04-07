const bookingsContainer = document.getElementById("bookings");
const myCustomerName = sessionStorage.getItem("myCustomerName");

function getBookings() {
  const myBookedRooms = JSON.parse(localStorage.getItem("myBookedRooms")) || [];

  const myBookings = myBookedRooms.filter(
    booking => booking.customerName === myCustomerName
  );

  renderBookings(myBookings);
}

function renderBookings(bookings) {
  bookingsContainer.innerHTML = "";

  if (!bookings.length) {
    bookingsContainer.innerHTML = "<p class='empty-text'>No bookings yet.</p>";
    return;
  }

  bookings.forEach((booking, index) => {
    bookingsContainer.innerHTML += `
      <article class="booking-card">
        <img src="${booking.image}" alt="${booking.roomName}">
        
        <div class="booking-card-content">
          <span class="hotel-city-tag">${booking.city}</span>
          <h3>${booking.hotelName}</h3>
          <p><strong>Room:</strong> ${booking.roomName}</p>
          <p>${booking.address}</p>
          <p><strong>Check In:</strong> ${booking.checkInDate}</p>
          <p><strong>Check Out:</strong> ${booking.checkOutDate}</p>

          <button class="danger-btn" onclick="deleteBooking(${index})">
            Delete Booking
          </button>
        </div>
      </article>
    `;
  });
}

function deleteBooking(index) {
  let myBookedRooms = JSON.parse(localStorage.getItem("myBookedRooms")) || [];

  myBookedRooms.splice(index, 1);
  localStorage.setItem("myBookedRooms", JSON.stringify(myBookedRooms));

  showMessage("Booking deleted successfully ✅", "success");

  setTimeout(() => {
    getBookings();
  }, 700);
}

function showMessage(text, type) {
  let oldMessage = document.querySelector(".custom-message");
  if (oldMessage) oldMessage.remove();

  const msg = document.createElement("div");
  msg.className = `custom-message ${type}`;
  msg.textContent = text;

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.classList.add("show");
  }, 10);

  setTimeout(() => {
    msg.classList.remove("show");
    setTimeout(() => msg.remove(), 300);
  }, 2000);
}

getBookings();