const apiKey = '9e5b048b8ff6ca2f442ab4f0fababe48';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.querySelector('.current-weather');
const forecastDiv = document.querySelector('.forecast');
const historyList = document.getElementById('history-list');

searchBtn.addEventListener('click', function() {
    const cityName = cityInput.value.trim();
    if (cityName) {
        fetchCurrentWeather(cityName);
        fetchForecast(cityName);
        addToHistory(cityName);
    }
});

function fetchCurrentWeather(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            currentWeatherDiv.innerHTML = `
                <p><strong>${data.name}</strong></p>
                <p>Date: ${new Date(data.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
            `;
        })
        .catch(error => {
            console.error("There was an error fetching the current weather.", error);
        });
}

function fetchForecast(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const dailyData = data.list.filter((entry) => entry.dt_txt.includes("12:00:00"));
            let forecastHTML = '';
            dailyData.forEach(day => {
                forecastHTML += `
                    <div class="forecast-day">
                        <p>Date: ${new Date(day.dt * 1000).toLocaleDateString()}</p>
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                        <p>Temperature: ${day.main.temp}°C</p>
                        <p>Humidity: ${day.main.humidity}%</p>
                        <p>Wind Speed: ${day.wind.speed} m/s</p>
                    </div>
                `;
            });
            forecastDiv.innerHTML = forecastHTML;
        })
        .catch(error => {
            console.error("There was an error fetching the forecast.", error);
        });
}

function addToHistory(cityName) {
    // Check if city already exists in history
    if (getSearchHistory().includes(cityName)) return;

    const li = document.createElement('li');
    li.textContent = cityName;

    // Indicate interactivity through styles
    li.style.cursor = 'pointer';
    li.style.textDecoration = 'none';
    li.addEventListener('mouseenter', function() {
        li.style.textDecoration = 'underline';
    });
    li.addEventListener('mouseleave', function() {
        li.style.textDecoration = 'none';
    });

    historyList.appendChild(li);
    li.addEventListener('click', function() {
        fetchCurrentWeather(cityName);
        fetchForecast(cityName);
    });

    // Save to localStorage
    const searchHistory = getSearchHistory();
    searchHistory.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function getSearchHistory() {
    return JSON.parse(localStorage.getItem('searchHistory')) || [];
}

function loadSearchHistory() {
    const searchHistory = getSearchHistory();
    searchHistory.forEach(cityName => addToHistory(cityName));
}

// Load search history from localStorage on page load
loadSearchHistory();
