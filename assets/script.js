const apiKey = 'f9c50dae0509d52dab4e01183c2051c6'; 

document.getElementById('location-form').addEventListener('submit', e => {
    e.preventDefault();
    const location = document.getElementById('location-input').value;
    getWeather(location);
});

async function getWeather(location) {
    try {
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();

        displayWeather(currentData, forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function displayWeather(currentData, forecastData) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h2>${currentData.name}, ${currentData.sys.country}</h2>
        <p>Current Temperature: ${currentData.main.temp}°C</p>
        <p>Weather: ${currentData.weather[0].main}</p>
        <p>Description: ${currentData.weather[0].description}</p>
        <p>Humidity: ${currentData.main.humidity}%</p>
        <p>Wind Speed: ${currentData.wind.speed} m/s</p>
    `;

    weatherInfo.innerHTML += '<h2>5-Day Forecast</h2>';
    const forecastList = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5);
    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add('forecast');
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000); 
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = forecast.main.temp;
        const weather = forecast.weather[0].main;
        const description = forecast.weather[0].description;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p>${day}</p>
            <p>${temp}°C</p>
            <p>${weather}</p>
            <p>${description}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
    weatherInfo.appendChild(forecastContainer);
}