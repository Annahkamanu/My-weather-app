function getDate() {
  let today = new Date();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  let currentDay = days[today.getDay()];
  let months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let currentMonth = months[today.getMonth()];
  let currentDate = today.getDate();
  let currentYear = today.getFullYear();

  return ` Last updated ${currentDay}:${currentMonth} ${currentDate}:${currentYear} `;
}

let h2 = document.querySelector("#date");
h2.innerHTML = getDate();

function getTime() {
  let now = new Date();
  let currentTime = now.getHours();
  if (currentTime < 10) {
    currentTime = `0${currentTime}`;
  }
  let currentMinutes = now.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  return `${currentTime}:${currentMinutes}am/pm`;
}
let h3 = document.querySelector("#time");
h3.innerHTML = getTime();

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 7) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = searchInput.value;
}
let searchingForm = document.querySelector("#search-form");
searchingForm.addEventListener("submit", searchCity);

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchEngine(city);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

function showWeather(response) {
  console.log(response);
  document.querySelector("#city").innerHTML = response.data.name;
  let celciusChange = document.querySelector("#celcius-change");

  temp = Math.round(response.data.main.temp);
  celciusChange.innerHTML = `${temp}°C`;
  let humidity = document.querySelector("#humidity");
  let humid = response.data.main.humidity;
  humidity.innerHTML = `The Humidity is ${humid}%`;
  let wind = document.querySelector("#wind");
  let windspeed = Math.round(response.data.wind.speed);
  wind.innerHTML = `The wind speed is ${windspeed}m/h`;
  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].main;
  let weatherIcon = document.querySelector("#icon");
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

function searchEngine(city) {
  let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}
function searchLocation(position) {
  let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showWeather);
}
function getCurrentLocation(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(searchLocation);
}
let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);
searchEngine("Nairobi");

function temperature(event) {
  event.preventDefault();
  let celciusChange = document.querySelector("#celcius-change");
  celciusChange.innerHTML = `${temp}°C`;
}
let celciusButton = document.querySelector("#celcius");
celciusButton.addEventListener("click", temperature);

function fahrenheit(event) {
  event.preventDefault();
  let today = document.querySelector("#celcius-change");
  let fahrenheiTemperature = Math.round((temp * 9) / 5 + 32);
  today.innerHTML = `${fahrenheiTemperature}°F`;
}
let fahrenheitButton = document.querySelector("#fahrenheit");
fahrenheitButton.addEventListener("click", fahrenheit);

let temp = null;
