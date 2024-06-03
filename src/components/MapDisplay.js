import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapDisplay = ({ lat, lon, zoom, onCityClick }) => {
  const mapRef = useRef();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], zoom);
    }
  }, [lat, lon, zoom]);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
    }
  };

  const handleSuggestionClick = (lat, lon) => {
    onCityClick({ lat, lon });
    setSuggestions([]);
    setSearchQuery('');
  };

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onCityClick({ lat: latitude, lon: longitude });
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  };

  return (
    <MapContainer center={[lat, lon]} zoom={zoom} style={{ height: '100%', width: '100%' }} whenCreated={(map) => (mapRef.current = map)}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
      <div className="search-container">
        <input type="text" placeholder="Search city..." value={searchQuery} onChange={handleSearchChange} />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion) => (
              <li key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion.lat, suggestion.lon)}>
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={handleCurrentLocation}>Get Current Location</button>
    </MapContainer>
  );
};

export default MapDisplay;
