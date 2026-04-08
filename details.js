const detailsContainer = document.getElementById("details");
const hotelId = Number(localStorage.getItem("hotelId"));

let currentHotel = null;
let roomTypes = [];
let myCustomerName = sessionStorage.getItem("myCustomerName");

const roomImagesByName = {
  "Premium Room": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
  "Deluxe Twin Room": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
  "Club Room": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
  "Junior Suite": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
  "Executive Suite": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
  "Deluxe Room": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  "Standard Room": "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
  "Superior Twin Room": "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
  "Superior Room": "https://ariaresortandspa.com/wp-content/uploads/2024/09/Superior-Room-Middle-Photo-scaled.jpg",
  "Executive Room": "https://www.hoteltentrem.com/semarang/wp-content/uploads/sites/4/2025/01/Room-2-A-Executive-King-Bedroom-1366x768.jpg",
  "Deluxe Double Room": "https://bluedolphinhotel.eu/wp-content/uploads/2023/04/01.Deluxe-Double-Room-Garden-View-1.jpg",
  "Club Twin Room": "https://www.princehotels.com/takanawa/wp-content/uploads/sites/10/2019/07/Club-Superior-Twin-Room-Grand-Prince-Hotel-Takanawa-Tokyo-180816-1.jpg",
  "Grand Deluxe Suite": "https://www.andamantra.com/images/rooms/grand-deluxe-2-bedroom/Pre-ADML-2.jpg",
  "Superior Room, City View (High Floor)": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/371926731.jpg?k=a47c1735dca9b6cc521c99cc668876e73c998214431a983aaaaa01261dc9de6c&o="
};

function getRoomImage(roomName) {
  return roomImagesByName[roomName] || (currentHotel ? currentHotel.featuredImage : "");
}

if (!myCustomerName) {
  myCustomerName = "Gela_" + Date.now();
  sessionStorage.setItem("myCustomerName", myCustomerName);
}

function getHotelDetails() {
  detailsContainer.innerHTML = `<p class="loading-text">Loading hotel details...</p>`;

  Promise.all([
    fetch(`https://hotelbooking.stepprojects.ge/api/Hotels/GetHotel/${hotelId}`).then(res => {
      if (!res.ok) {
        throw new Error("Failed to fetch hotel");
      }
      return res.json();
    }),
    fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetRoomTypes").then(res => {
      if (!res.ok) {
        throw new Error("Failed to fetch room types");
      }
      return res.json();
    })
  ])
    .then(([hotel, types]) => {
      currentHotel = hotel;
      roomTypes = types;
      renderPage();
    })
    .catch(error => {
      console.error(error);
      detailsContainer.innerHTML = `<p class="error-text">Could not load hotel details.</p>`;
    });
}

function renderPage() {
  const maxPrice = currentHotel.rooms && currentHotel.rooms.length
    ? Math.max(...currentHotel.rooms.map(room => room.pricePerNight))
    : 1000;

  detailsContainer.innerHTML = `
    <section class="detail-top">
      <div class="detail-image">
        <img src="${currentHotel.featuredImage}" alt="${currentHotel.name}">
      </div>

      <div class="detail-info">
        <span class="hotel-badge">${currentHotel.city}</span>
        <h1>${currentHotel.name}</h1>
        <p class="hotel-address">${currentHotel.address}</p>
        <p class="hotel-description">
          Explore available rooms and choose the one that fits your needs.
        </p>
        <a href="bookings.html" class="soft-btn">Go to Booked Rooms</a>
      </div>
    </section>

    <section class="filter-section">
      <div class="filter-tabs">
        <button class="filter-tab active" onclick="setRoomType('all', event)">All</button>
        ${roomTypes.map(type => `
          <button class="filter-tab" onclick="setRoomType('${type.id}', event)">
            ${type.name}
          </button>
        `).join("")}
      </div>

      <div class="filter-box">
        <div class="filter-item filter-price">
          <label>Price Per Night</label>
          <input type="range" id="priceRange" min="0" max="${maxPrice}" value="${maxPrice}">
          <div class="price-row">
            <span>0</span>
            <span id="priceValue">${maxPrice}</span>
          </div>
        </div>

        <div class="filter-item">
          <label>Room Type</label>
          <select id="roomType">
            <option value="all">All Rooms</option>
            ${roomTypes.map(type => `
              <option value="${type.id}">${type.name}</option>
            `).join("")}
          </select>
        </div>

        <div class="filter-item">
          <label>Check-in</label>
          <input type="date" id="checkIn">
        </div>

        <div class="filter-item">
          <label>Check-out</label>
          <input type="date" id="checkOut">
        </div>

        <div class="filter-item">
          <label>Guests</label>
          <input type="number" id="guests" min="1" value="1">
        </div>

        <div class="filter-actions">
          <button class="main-btn" onclick="applyFilter()">Apply Filter</button>
          <button class="reset-btn" onclick="resetFilter(${maxPrice})">Reset</button>
        </div>
      </div>
    </section>

    <section class="rooms-section">
      <div class="section-head">
        <h2>Available Rooms</h2>
        <p>Rooms will appear after you apply a filter</p>
      </div>

      <div id="rooms" class="rooms-grid hidden-rooms"></div>
    </section>
  `;

  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const checkInInput = document.getElementById("checkIn");
  const checkOutInput = document.getElementById("checkOut");

  priceRange.addEventListener("input", function (event) {
    priceValue.innerText = event.target.value;
  });

  const today = new Date().toISOString().split("T")[0];
  checkInInput.min = today;
  checkOutInput.min = today;

  checkInInput.addEventListener("change", function (event) {
    checkOutInput.min = event.target.value;

    if (checkOutInput.value && checkOutInput.value <= event.target.value) {
      checkOutInput.value = "";
    }
  });
}

function setRoomType(typeId, event) {
  const roomTypeSelect = document.getElementById("roomType");
  roomTypeSelect.value = typeId;

  document.querySelectorAll(".filter-tab").forEach(button => {
    button.classList.remove("active");
  });

  event.target.classList.add("active");
}

function validateDates(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    showMessage("Please choose check-in and check-out dates ❌", "error");
    return false;
  }

  const checkInDateObj = new Date(checkIn);
  const checkOutDateObj = new Date(checkOut);

  if (checkOutDateObj <= checkInDateObj) {
    showMessage("Check-out must be after check-in ❌", "error");
    return false;
  }

  return true;
}

function applyFilter() {
  const maxPrice = Number(document.getElementById("priceRange").value);
  const selectedTypeId = document.getElementById("roomType").value;
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;
  const guests = Number(document.getElementById("guests").value);
  const roomsContainer = document.getElementById("rooms");

  if (!validateDates(checkIn, checkOut)) {
    return;
  }

  let rooms = [...currentHotel.rooms];

  rooms = rooms.filter(room => room.pricePerNight <= maxPrice);

  if (selectedTypeId !== "all") {
    rooms = rooms.filter(room => String(room.roomTypeId) === String(selectedTypeId));
  }

  if (guests > 0) {
    rooms = rooms.filter(room => {
      if (!room.maximumGuests) {
        return true;
      }
      return room.maximumGuests >= guests;
    });
  }

  roomsContainer.classList.remove("hidden-rooms");

  if (!rooms.length) {
    roomsContainer.innerHTML = `<p class="error-text">No rooms match this filter.</p>`;
    return;
  }

roomsContainer.innerHTML = rooms.map(room => `
  <article class="room-card">
    <div class="room-card-image">
      <img src="${getRoomImage(room.name)}" alt="${room.name}">
    </div>

    <div class="room-card-content">
      <h3>${room.name}</h3>

      <div class="room-meta">
        <span class="room-hotel">${currentHotel.name}</span>
        <span class="room-price">€ ${room.pricePerNight}</span>
      </div>

      <p class="room-night-text">a night</p>

      <button
        class="main-btn room-book-btn"
        onclick="bookHotel(${currentHotel.id}, ${room.id})"
      >
        Book this room
      </button>
    </div>
  </article>
`).join("");
}

function resetFilter(maxPrice) {
  document.getElementById("priceRange").value = maxPrice;
  document.getElementById("priceValue").innerText = maxPrice;
  document.getElementById("roomType").value = "all";
  document.getElementById("checkIn").value = "";
  document.getElementById("checkOut").value = "";
  document.getElementById("guests").value = 1;

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("checkIn").min = today;
  document.getElementById("checkOut").min = today;

  document.querySelectorAll(".filter-tab").forEach(button => {
    button.classList.remove("active");
  });

  const firstTab = document.querySelector(".filter-tab");
  if (firstTab) {
    firstTab.classList.add("active");
  }

  const roomsContainer = document.getElementById("rooms");
  roomsContainer.innerHTML = "";
  roomsContainer.classList.add("hidden-rooms");
}

function bookHotel(hotelId, roomId) {
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

  if (!validateDates(checkIn, checkOut)) {
    return;
  }

  const room = currentHotel.rooms.find(item => item.id === roomId);

  if (!room) {
    showMessage("Room not found ❌", "error");
    return;
  }

  const bookingInfo = {
    hotelId: currentHotel.id,
    roomId: room.id,
    hotelName: currentHotel.name,
    roomName: room.name,
    city: currentHotel.city,
    address: currentHotel.address,
    image: getRoomImage(room.name),
    checkInDate: checkIn,
    checkOutDate: checkOut,
    customerName: myCustomerName
  };

  console.log("BOOKING PAYLOAD:", {
    hotelId: hotelId,
    roomId: roomId,
    customerName: myCustomerName,
    checkInDate: checkIn,
    checkOutDate: checkOut
  });

  fetch("https://hotelbooking.stepprojects.ge/api/Booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      hotelId: hotelId,
      roomId: roomId,
      customerName: myCustomerName,
      checkInDate: checkIn,
      checkOutDate: checkOut
    })
  })
    .then(res => {
      return res.text().then(text => {
        console.log("BOOKING RESPONSE:", res.status, text);

        if (!res.ok) {
          if (text.includes("already booked")) {
            throw new Error("This room is already booked for the selected dates ❌");
          }
          throw new Error(text || "Booking failed ❌");
        }

        return text;
      });
    })
    .then(() => {
      let myBookedRooms = JSON.parse(localStorage.getItem("myBookedRooms")) || [];
      myBookedRooms.push(bookingInfo);
      localStorage.setItem("myBookedRooms", JSON.stringify(myBookedRooms));

      showMessage("Room booked successfully ✅", "success");

      setTimeout(() => {
        window.location.href = "bookings.html";
      }, 1200);
    })
    .catch(error => {
      console.error(error);
      showMessage(error.message || "Booking failed ❌", "error");
    });
}

function showMessage(text, type) {
  let oldMessage = document.querySelector(".custom-message");
  if (oldMessage) {
    oldMessage.remove();
  }

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

getHotelDetails();