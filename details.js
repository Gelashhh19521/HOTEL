const detailsContainer = document.getElementById("details");

const hotelId = Number(localStorage.getItem("hotelId"));
console.log("hotelId:", hotelId);

let myCustomerName = sessionStorage.getItem("myCustomerName");

if (!myCustomerName) {
  myCustomerName = "Gela_" + Date.now();
  sessionStorage.setItem("myCustomerName", myCustomerName);
}

function getHotelDetails() {
  fetch(`https://hotelbooking.stepprojects.ge/api/Hotels/GetHotel/${hotelId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to fetch hotel details");
      }
      return res.json();
    })
    .then(data => {
      renderDetails(data);
    })
    .catch(err => {
      console.error(err);
      detailsContainer.innerHTML = "<p>Could not load details</p>";
    });
}

function renderDetails(hotel) {
  let roomsHtml = "";

  if (!hotel.rooms || hotel.rooms.length === 0) {
    roomsHtml = `<p style="color:red;">No rooms available ❌</p>`;
  } else {
    hotel.rooms.forEach(room => {
      roomsHtml += `
        <div style="margin-bottom: 15px;">
          <p><strong>Room ID:</strong> ${room.id}</p>
          <button class="book-btn" onclick="bookHotel(${hotel.id}, ${room.id})">
            Book this room
          </button>
        </div>
      `;
    });
  }

  detailsContainer.innerHTML = `
    <img src="${hotel.featuredImage}">
    <h2>${hotel.name}</h2>
    <p><strong>City:</strong> ${hotel.city}</p>
    <p><strong>Address:</strong> ${hotel.address}</p>
    <p><strong>Your booking name:</strong> ${myCustomerName}</p>
    <h3>Rooms:</h3>
    ${roomsHtml}
  `;
}

function bookHotel(hotelId, roomId) {
  fetch("https://hotelbooking.stepprojects.ge/api/Booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      hotelId: hotelId,
      roomId: roomId,
      customerName: myCustomerName,
      checkInDate: "2035-05-10",
      checkOutDate: "2035-05-15"
    })
  })
  .then(res => {
    return res.text().then(text => {
      if (!res.ok) {
        throw new Error(text);
      }
      return text;
    });
  })
  .then(text => {
    console.log("BOOKING RESPONSE:", text);
    alert("Booked successfully! ✅");
  })
  .catch(err => {
    console.error(err);
    alert(err.message);
  });
}

function goToBookings() {
  window.location.href = "bookings.html";
}

getHotelDetails();