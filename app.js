const hotelsContainer = document.getElementById("hotels");
const citiesSelect = document.getElementById("cities");

function getAllHotels() {
  hotelsContainer.innerHTML = `<p class="loading-text">Loading hotels...</p>`;

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
      hotelsContainer.innerHTML = "<p class='error-text'>Hotels could not be loaded.</p>";
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
  hotelsContainer.innerHTML = `<p class="loading-text">Loading hotels...</p>`;

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
      hotelsContainer.innerHTML = "<p class='error-text'>Filtered hotels could not be loaded.</p>";
    });
}

function renderHotels(hotels) {
  hotelsContainer.innerHTML = "";

  if (!hotels || hotels.length === 0) {
    hotelsContainer.innerHTML = "<p class='empty-text'>No hotels found.</p>";
    return;
  }

  hotels.forEach(hotel => {
    hotelsContainer.innerHTML += `
      <article class="hotel-card">
        <div class="hotel-image-box">
          <img src="${hotel.featuredImage}" alt="${hotel.name}">
        </div>

        <div class="hotel-content">
          <span class="hotel-city-tag">${hotel.city}</span>
          <h3>${hotel.name}</h3>
          <p class="hotel-address">${hotel.address}</p>

          <div class="hotel-card-footer">
            <button class="primary-btn" onclick="goToDetails(${hotel.id})">View Details</button>
          </div>
        </div>
      </article>
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

getAllHotels();
getAllCities();