// src/components/MapDisplay.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapDisplay = ({ lat, lon, zoom, onMapClick }) => {
  const [markerPosition, setMarkerPosition] = useState([lat, lon]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setMarkerPosition([e.latlng.lat, e.latlng.lng]);
        onMapClick(e.latlng);
      }
    });
    return null;
  };

  return (
    <MapContainer center={markerPosition} zoom={zoom} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={markerPosition} />
      <MapClickHandler />
    </MapContainer>
  );
};

MapDisplay.propTypes = {
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  onMapClick: PropTypes.func.isRequired,
};

export default MapDisplay;
