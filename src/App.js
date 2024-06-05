// src/App.js
import React, { useState, useEffect, FormEvent } from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import MapDisplay from './components/MapDisplay';
import './App.css';
import { Container, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const App = () => {
  const [location, setLocation] = useState({ lat: 51.505, lon: -0.09 });
  const [zoom, setZoom] = useState(13);
  const [unit, setUnit] = useState('metric');
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if (savedHistory) {
      setSearchHistory(savedHistory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleMapClick = (latlng) => {
    const newLocation = { lat: latlng.lat, lon: latlng.lng };
    setLocation(newLocation);
    fetchCityName(latlng.lat, latlng.lng);
    addToSearchHistory(newLocation);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const lat = parseFloat(event.target.latitude.value);
    const lon = parseFloat(event.target.longitude.value);
    if (!isNaN(lat) && !isNaN(lon)) {
      const newLocation = { lat, lon };
      setLocation(newLocation);
      fetchCityName(lat, lon);
      addToSearchHistory(newLocation);
    }
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchByName = async () => {
    try {
      const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: searchQuery,
          limit: 1,
          appid: process.env.REACT_APP_OPENWEATHERMAP_API_KEY
        }
      });

      if (response.data.length > 0) {
        const { lat, lon, name } = response.data[0];
        const newLocation = { lat, lon };
        setLocation(newLocation);
        setCityName(name);
        addToSearchHistory(newLocation);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const fetchCityName = async (lat, lon) => {
    try {
      const response = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse`, {
        params: {
          lat,
          lon,
          limit: 1,
          appid: process.env.REACT_APP_OPENWEATHERMAP_API_KEY
        }
      });

      if (response.data.length > 0) {
        setCityName(response.data[0].name);
      } else {
        setCityName('');
      }
    } catch (error) {
      console.error('Error fetching city name:', error);
    }
  };

  const addToSearchHistory = (location) => {
    const newHistory = [...searchHistory, location];
    if (newHistory.length > 5) {
      newHistory.shift();
    }
    setSearchHistory(newHistory);
  };

  const handleHistoryClick = (location) => {
    setLocation(location);
    fetchCityName(location.lat, location.lon);
  };

  return (
    <Container className="container">
      <h1>Weather Application</h1>
      <form onSubmit={handleFormSubmit}>
        <TextField label="Latitude" name="latitude" type="number" step="0.01" required />
        <TextField label="Longitude" name="longitude" type="number" step="0.01" required />
        <FormControl>
          <InputLabel>Unit</InputLabel>
          <Select value={unit} onChange={handleUnitChange}>
            <MenuItem value="metric">Celsius</MenuItem>
            <MenuItem value="imperial">Fahrenheit</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained">Get Weather</Button>
      </form>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField label="Location Name" value={searchQuery} onChange={handleSearchQueryChange} />
        <Button variant="contained" onClick={handleSearchByName}>Search by Name</Button>
      </div>
      {searchHistory.length > 0 && (
        <div className="recent-searches">
          <h3>Recent Searches:</h3>
          <ul>
            {searchHistory.map((loc, index) => (
              <li key={index} onClick={() => handleHistoryClick(loc)}>
                {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="weather-container">
        <WeatherDisplay lat={location.lat} lon={location.lon} unit={unit} cityName={cityName} />
      </div>
      <div className="map-container">
        <MapDisplay lat={location.lat} lon={location.lon} zoom={zoom} onMapClick={handleMapClick} />
      </div>
      
    </Container>
  );
};

export default App;
