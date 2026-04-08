const hotelsContainer = document.getElementById("hotels");
const citiesSelect = document.getElementById("cities");

let allHotels = [];

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
      allHotels = data || [];
      renderCitiesFromHotels(allHotels);
      renderHotels(allHotels);
    })
    .catch(error => {
      console.error(error);
      hotelsContainer.innerHTML = "<p class='error-text'>Hotels could not be loaded.</p>";
    });
}

function renderCitiesFromHotels(hotels) {
  citiesSelect.innerHTML = `<option value="all">All Cities</option>`;

  const uniqueCities = [];
  const usedCityNames = new Set();

  hotels.forEach(hotel => {
    const cityName = hotel.city?.trim();

    if (cityName && !usedCityNames.has(cityName)) {
      usedCityNames.add(cityName);
      uniqueCities.push(cityName);
    }
  });

  uniqueCities.sort((a, b) => a.localeCompare(b));

  uniqueCities.forEach(cityName => {
    citiesSelect.innerHTML += `
      <option value="${cityName}">${cityName}</option>
    `;
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

function filterHotelsByCity(cityName) {
  if (cityName === "all") {
    renderHotels(allHotels);
    return;
  }

  const filteredHotels = allHotels.filter(hotel => hotel.city === cityName);
  renderHotels(filteredHotels);
}

function goToDetails(id) {
  localStorage.setItem("hotelId", id);
  window.location.href = "details.html";
}

citiesSelect.addEventListener("change", function () {
  const selectedCity = this.value;
  filterHotelsByCity(selectedCity);
});

getAllHotels();