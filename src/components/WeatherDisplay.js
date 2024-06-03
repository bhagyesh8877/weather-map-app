// src/components/WeatherDisplay.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const WeatherDisplay = ({ lat, lon, unit }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            lat,
            lon,
            appid: process.env.REACT_APP_OPENWEATHERMAP_API_KEY,
            units: unit
          }
        });
        setWeather(response.data);
      } catch (err) {
        setError(err);
      }
    };

    if (lat && lon) {
      fetchWeather();
    }
  }, [lat, lon, unit]);

  if (error) {
    return <div>Error fetching weather data</div>;
  }

  if (!weather) {
    return <div>Loading...</div>;
  }

  const isDayTime = new Date().getHours() > 6 && new Date().getHours() < 18;
  const iconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="weather-info">
      <h2>Weather Information</h2>
      <p>Temperature: {weather.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
      <p>Condition: {weather.weather[0].description}</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind Speed: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
      <p>Chance of Rain: {weather.clouds.all}%</p>
      <img src={iconUrl} alt="Weather Icon" />
    </div>
  );
};

WeatherDisplay.propTypes = {
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  unit: PropTypes.oneOf(['metric', 'imperial']).isRequired,
};

export default WeatherDisplay;
