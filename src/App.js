import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css"; // Import your CSS file

function App() {
  const [city, setCity] = useState("Omagh");
  const [temperature, setTemperature] = useState("");
  const [description, setDescription] = useState("");
  const [humidity, setHumidity] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [forecastDays, setForecastDays] = useState([]);

  useEffect(() => {
    searchCity(city);
  }, []);

  function updateWeatherData(response) {
    const { data } = response;
    const windSpeedApiRound = Math.round(data.wind.speed * 10) / 10;
    const date = new Date(data.time * 1000);

    setTemperature(Math.round(data.temperature.current));
    setCity(data.city);
    setDescription(data.condition.description);
    setHumidity(`${data.temperature.humidity}%`);
    setWindSpeed(`${windSpeedApiRound}km/h`);
  }

  function updateForecastData(response) {
    const { data } = response;
    const forecastHtml = data.daily.slice(1, 6).map((day) => {
      const dayName = new Date(day.time * 1000).toLocaleDateString("en-US", {
        weekday: "short",
      });
      return (
        <div className="forecast-day" key={day.time}>
          <div className="forecast-day">{dayName}</div>
          <div className="forecast-icon">
            <img src={day.condition.icon_url} alt="weather-icon" />
          </div>
          <div>
            <strong className="forecast-temp-max">
              {Math.round(day.temperature.maximum)}º
            </strong>
            <span className="forecast-temp-min">
              | {Math.round(day.temperature.minimum)}º
            </span>
          </div>
        </div>
      );
    });
    setForecastDays(forecastHtml);
  }

  function formatDate(date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    let weekDays = [
      `Sunday`,
      `Monday`,
      `Tuesday`,
      `Wednesday`,
      `Thursday`,
      `Friday`,
      `Saturday`,
    ];
    let day = weekDays[date.getDay()];
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${day} ${hours}:${minutes}`;
  }

  function searchCity(city) {
    const apiKey = "t2a8732d5be070bfd9a04c0a8o4eba02";
    const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
    axios
      .get(apiUrl)
      .then(updateWeatherData)
      .catch((error) => {
        console.error("Error fetching the weather data: ", error);
      });

    const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
    axios
      .get(forecastUrl)
      .then(updateForecastData)
      .catch((error) => {
        console.error("Error fetching the forecast data: ", error);
      });
  }

  function applySearch(event) {
    event.preventDefault();
    const searchInputElement = document.querySelector("#search-input");
    searchCity(searchInputElement.value);
  }

  return (
    <div className="app-container">
      <header>
        <form id="search-form" onSubmit={applySearch}>
          <input
            type="search"
            placeholder="Enter a city..."
            required
            className="search-form-input"
            id="search-input"
          />
          <input type="submit" value="Search" className="search-form-button" />
        </form>
      </header>
      <main className="main-container">
        <div>
          <h1 className="city" id="search-city">
            {city}
          </h1>
          <p>
            <span id="time">{formatDate(new Date())}</span>
            <br />
            <strong id="description">{description}</strong>
            <br />
            Humidity: <strong id="humidity">{humidity}</strong>,
            <br />
            Wind Speed: <strong id="wind-speed">{windSpeed}</strong>
          </p>
        </div>

        <div className="weather-temp-container">
          <div className="weather-temp-icon" id="icon"></div>
          <div className="weather-temp-value" id="temp-value">
            {temperature}
          </div>
          <div className="weather-temp-units">ºC</div>
        </div>
      </main>
      <div className="weather-forecast-container">
        <div className="weather-forecast">{forecastDays}</div>
      </div>

      <footer>
        This project was coded by{" "}
        <a
          href="https://www.linkedin.com/in/camilla-luna-mcgoldrick-7982b7303/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Camilla Luna-McGoldrick
        </a>
        , is{" "}
        <a
          href="https://github.com/millamcg1/weather_app_react"
          target="_blank"
          rel="noopener noreferrer"
        >
          open-sourced on GitHub
        </a>{" "}
        and{" "}
        <a href="#" target="_blank" rel="noopener noreferrer">
          hosted on Netlify.
        </a>
      </footer>
    </div>
  );
}

export default App;
