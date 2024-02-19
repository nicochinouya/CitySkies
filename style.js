const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "f9c50dae0509d52dab4e01183c2051c6";

const createWeatherCardHTML = (cityName, weatherItem, index) => {
    const { dt_txt, main, weather, wind } = weatherItem;
    const temperature = (main.temp - 273.15).toFixed(2);
    const date = dt_txt.split(" ")[0];
    
    if (index === 0) {
        return `
            <div class="details">
                <h2>${cityName} (${date})</h2>
                <h6>Temperature: ${temperature}°C</h6>
                <h6>Wind: ${wind.speed} M/S</h6>
                <h6>Humidity: ${main.humidity}%</h6>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="weather-icon">
                <h6>${weather[0].description}</h6>
            </div>
        `;
    } else {
        return `
            <li class="card">
                <h3>(${date})</h3>
                <img src="https://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="weather-icon">
                <h6>Temp: ${temperature}°C</h6>
                <h6>Wind: ${wind.speed} M/S</h6>
                <h6>Humidity: ${main.humidity}%</h6>
            </li>
        `;
    }
};

const fetchWeatherData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        return await response.json();
    } catch (error) {
        throw new Error('An error occurred while fetching weather data');
    }
};

const getWeatherDetails = async (cityName, latitude, longitude) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    try {
        const data = await fetchWeatherData(weatherUrl);
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            return !uniqueForecastDays.includes(forecastDate) && uniqueForecastDays.push(forecastDate);
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCardHTML(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });
    } catch (error) {
        alert(error.message);
    }
};

const getCityCoordinates = async () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return alert('Name a City or Town');

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    try {
        const data = await fetchWeatherData(geoUrl);
        if (data.length === 0) return alert(`No coordinates found for ${cityName}`);
        
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    } catch (error) {
        alert(error.message);
    }
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetchWeatherData(reverseGeoUrl)
                .then(data => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(error => alert(error.message));
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        }
    );
};

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
