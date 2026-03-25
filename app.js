const hotelsContainer = document.getElementById("hotels");
const citiesSelect = document.getElementById("cities");

function getAllHotels() {
  fetch("https://hotelbooking.stepprojects.ge/api/Hotels/GetAll")
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to fetch hotels");
      }
      return res.json();
    })
    .then(data => {
      renderHotels(data);
    })
    .catch(error => {
      console.error(error);
      hotelsContainer.innerHTML = "<p>Hotels could not be loaded.</p>";
    });
}

function getAllCities() {
  fetch("https://hotelbooking.stepprojects.ge/api/Cities/GetAll")
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to fetch cities");
      }
      return res.json();
    })
    .then(data => {
      renderCities(data);
    })
    .catch(error => {
      console.error(error);
    });
}

function renderCities(cities) {
  cities.forEach(city => {
    citiesSelect.innerHTML += `
      <option value="${city.id}">${city.name}</option>
    `;
  });
}

function getHotelsByCity(cityId) {
  fetch(`https://hotelbooking.stepprojects.ge/api/Hotels/GetByCityId/${cityId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to fetch hotels by city");
      }
      return res.json();
    })
    .then(data => {
      renderHotels(data);
    })
    .catch(error => {
      console.error(error);
      hotelsContainer.innerHTML = "<p>Filtered hotels could not be loaded.</p>";
    });
}

function renderHotels(hotels) {
  hotelsContainer.innerHTML = "";

  hotels.forEach(hotel => {
    
    hotelsContainer.innerHTML += `
      <div class="card">
        <img src="${hotel.featuredImage || 'https://via.placeholder.com/250x180'}" alt="${hotel.name}">
        <h3>${hotel.name}</h3>
        <p>City: ${hotel.city || "Unknown"}</p>
        <p>${hotel.address || "No address"}</p>
        <button onclick="goToDetails(${hotel.id})">View Details</button>
      </div>
    `;
  });
}

function goToDetails(id) {
  localStorage.setItem("hotelId", id);
  window.location.href = "details.html";
}

citiesSelect.addEventListener("change", function () {
  const selectedCityId = this.value;

  if (selectedCityId === "all") {
    getAllHotels();
  } else {
    getHotelsByCity(selectedCityId);
  }
});
function goToBookings() {
  window.location.href = "bookings.html";
}
function goToRegister() {
  window.location.href = "register.html";
}

getAllHotels();
getAllCities();


