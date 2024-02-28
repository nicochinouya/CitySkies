document.addEventListener("DOMContentLoaded", function() {
    const apiKey = 'f9c50dae0509d52dab4e01183c2051c6';
    const lat = 'YOUR_LATITUDE'; // Replace with your latitude
    const lon = 'YOUR_LONGITUDE'; // Replace with your longitude

    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const currentWeatherContainer = document.getElementById("currentWeather");
            const currentWeather = data.weather[0].main;
            const temperature = Math.round(data.main.temp - 273.15) + "°C"; // Convert temperature to Celsius

            const currentWeatherElement = document.createElement("div");
            currentWeatherElement.classList.add("current-weather");

            const currentWeatherInfo = document.createElement("p");
            currentWeatherInfo.textContent = `Current Weather: ${currentWeather}, Temperature: ${temperature}`;

            currentWeatherElement.appendChild(currentWeatherInfo);
            currentWeatherContainer.appendChild(currentWeatherElement);
        })
        .catch(error => console.error('Error fetching current weather data:', error));

    // Fetch 5-day forecast data
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.getElementById("forecast");

            for (let i = 0; i < data.list.length; i += 8) { // Fetching data for every 24 hours (8 items per day)
                const dayData = data.list[i];
                const date = new Date(dayData.dt * 1000);
                const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                const forecast = dayData.weather[0].main;
                const temperature = Math.round(dayData.main.temp - 273.15) + "°C"; // Converting temperature to Celsius

                const dayElement = document.createElement("div");
                dayElement.classList.add("day");

                const dayHeader = document.createElement("h3");
                dayHeader.textContent = day;

                const forecastParagraph = document.createElement("p");
                forecastParagraph.textContent = "Forecast: " + forecast;

                const temperatureParagraph = document.createElement("p");
                temperatureParagraph.textContent = "Temperature: " + temperature;

                dayElement.appendChild(dayHeader);
                dayElement.appendChild(forecastParagraph);
                dayElement.appendChild(temperatureParagraph);

                forecastContainer.appendChild(dayElement);
            }
        })
        .catch(error => console.error('Error fetching forecast data:', error));
});
