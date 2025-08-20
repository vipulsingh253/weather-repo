// API configuration
const apiKey = "f695f305cfe5e8ae91cb87b5afb45649";
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

// DOM Element Selectors
const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const weatherIcon = document.querySelector(".weather-icon");
const weatherDisplay = document.querySelector(".weather");
const errorDisplay = document.querySelector(".error");
const alertDisplay = document.querySelector(".alert");
const forecastContainer = document.querySelector(".forecast-container");
const recentSearchesContainer = document.querySelector(".recent-searches-container");

// Map weather conditions to icon images
const weatherIconMap = {
    "Clouds": "images/clouds.png",
    "Clear": "images/clear.png",
    "Rain": "images/rain.png",
    "Drizzle": "images/drizzle.png",
    "Mist": "images/mist.png",
    "Snow": "images/snow.png",
    "Haze": "images/mist.png"
};


//   Main function to fetch and display weather data for a city
  
 
async function fetchAndDisplayWeather(city) {
    try {
        const [currentWeather, forecastData] = await Promise.all([
            fetch(currentWeatherUrl + city + `&appid=${apiKey}`),
            fetch(forecastUrl + city + `&appid=${apiKey}`)
        ]);

        if (!currentWeather.ok || !forecastData.ok) {
            handleApiError();
            return;
        }

        const weatherData = await currentWeather.json();
        const forecastResult = await forecastData.json();

        updateCurrentWeatherUI(weatherData);
        updateForecastUI(forecastResult);
        updateRecentSearches(city);

        // Show weather info and hide error message 
        errorDisplay.classList.add("hidden");
        weatherDisplay.classList.remove("hidden");
        forecastContainer.classList.remove("hidden");

    } catch (error) {
        console.error("Error fetching data:", error);
        handleApiError();
    }
}


 /* Updates the UI with current weather data from the API */
     
 
function updateCurrentWeatherUI(data) {
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    weatherIcon.src = weatherIconMap[data.weather[0].main] || "images/clear.png";

    if (data.main.temp > 40) {
        alertDisplay.classList.remove("hidden");
    } else {
        alertDisplay.classList.add("hidden");
    }
}

/* Updates the UI with 5-day forecast data */
  
function updateForecastUI(data) {
    const forecastDaysContainer = document.querySelector(".forecast-days");
    forecastDaysContainer.innerHTML = "";

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        
        const card = document.createElement('div');
        // Applying Tailwind classes for the forecast card
        card.className = 'forecast-card bg-gradient-to-bl from-[#5b548a] to-[#00feba] p-4 rounded-2xl basis-[150px] grow text-center text-white';

        card.innerHTML = `
            <p class="date text-lg font-bold">${date}</p>
            <img src="${weatherIconMap[day.weather[0].main] || 'images/clear.png'}" class="icon w-20 mx-auto my-2.5" alt="weather icon">
            <p class="temp text-2xl font-bold mb-4">${Math.round(day.main.temp)}°c</p>
            <div class="info text-sm flex justify-center items-center mt-1">
                <img src="images/wind.png" alt="wind icon" class="w-5 mr-1.5">
                <span>${day.wind.speed} km/h</span>
            </div>
            <div class="info text-sm flex justify-center items-center mt-1">
                <img src="images/humidity.png" alt="humidity icon" class="w-5 mr-1.5">
                <span>${day.main.humidity}%</span>
            </div>
        `;
        forecastDaysContainer.appendChild(card);
    });
}


 /* Handles API errors by displaying an error message */
 
function handleApiError() {
    errorDisplay.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
    forecastContainer.classList.add("hidden");
}


 /* Manages the list of recently searched cities in localStorage */
 
function updateRecentSearches(city) {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    const normalizedCity = city.trim().toLowerCase();
    recentCities = recentCities.filter(c => c.toLowerCase() !== normalizedCity);
    recentCities.unshift(city);
    if (recentCities.length > 5) {
        recentCities = recentCities.slice(0, 5);
    }
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
    renderRecentSearches();
}


 /* Renders the recent searches dropdown from localStorage */
 
function renderRecentSearches() {
    const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    
    if (recentCities.length > 0) {
        recentSearchesContainer.classList.remove("hidden");
        const dropdownHTML = `
            <select id="recent-cities-dropdown" class="w-full p-2.5 rounded-2xl border-none bg-[#ebfffc] text-gray-700 text-base cursor-pointer">
                <option value="" disabled selected>Recent Searches...</option>
                ${recentCities.map(city => `<option value="${city}">${city}</option>`).join('')}
            </select>
        `;
        recentSearchesContainer.innerHTML = dropdownHTML;

        document.getElementById('recent-cities-dropdown').addEventListener('change', (event) => {
            const selectedCity = event.target.value;
            if (selectedCity) {
                fetchAndDisplayWeather(selectedCity);
            }
        });
    } else {
        recentSearchesContainer.classList.add("hidden");
    }
}

//  Event Listeners 

searchBtn.addEventListener("click", () => {
    if (searchBox.value) fetchAndDisplayWeather(searchBox.value);
});

searchBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && searchBox.value) fetchAndDisplayWeather(searchBox.value);
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const geoApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
            const response = await fetch(geoApiUrl);
            const data = await response.json();
            fetchAndDisplayWeather(data.name);
        }, (error) => {
            console.error("Geolocation error:", error);
            alert("Could not find your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

document.addEventListener('DOMContentLoaded', renderRecentSearches);