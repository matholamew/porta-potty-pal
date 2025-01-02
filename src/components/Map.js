import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
`;

const libraries = ['marker'];

const Map = ({ locations, userLocation, onMarkerClick, selectedLocation }) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const createMarkerContent = (isSelected) => {
    const pin = document.createElement('div');
    pin.className = 'custom-marker';
    pin.style.backgroundColor = isSelected ? '#2196F3' : '#4CAF50';
    pin.style.borderRadius = '50%';
    pin.style.padding = '8px';
    pin.style.border = '2px solid white';
    pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    return pin;
  };

  const createUserMarkerContent = () => {
    const pin = document.createElement('div');
    pin.className = 'user-marker';
    pin.style.backgroundColor = '#1976D2';
    pin.style.borderRadius = '50%';
    pin.style.padding = '6px';
    pin.style.border = '2px solid white';
    pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    return pin;
  };

  // Clean up existing markers
  const clearMarkers = () => {
    markers.forEach(marker => marker.map = null);
    setMarkers([]);
  };

  // Create and add markers when map or locations change
  useEffect(() => {
    if (!map || !window.google?.maps?.marker?.AdvancedMarkerElement) return;

    clearMarkers();
    const newMarkers = [];

    // Add location markers
    locations.forEach((loc) => {
      const marker = createMarker(loc);
      newMarkers.push(marker);
    });

    // Add user location marker
    if (userLocation) {
      const userMarker = createUserMarker();
      newMarkers.push(userMarker);
    }

    setMarkers(newMarkers);

    return () => clearMarkers();
  }, [map, locations, selectedLocation, userLocation]);

  const createMarker = (location) => {
    if (!map || !window.google?.maps?.marker?.AdvancedMarkerElement) return;

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position: { 
        lat: Number(location.lat), 
        lng: Number(location.lng)
      },
      map: map,
      title: location.name,
      content: createMarkerContent(selectedLocation?.id === location.id)
    });

    marker.addListener('click', () => onMarkerClick(location));
    return marker;
  };

  const createUserMarker = () => {
    if (!map || !userLocation || !window.google?.maps?.marker?.AdvancedMarkerElement) return;

    return new window.google.maps.marker.AdvancedMarkerElement({
      position: {
        lat: Number(userLocation.lat),
        lng: Number(userLocation.lng)
      },
      map: map,
      title: 'Your Location',
      content: createUserMarkerContent()
    });
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  return (
    <MapContainer>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        zoom={13}
        center={userLocation || { lat: 40.7128, lng: -74.0060 }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          mapId: process.env.REACT_APP_GOOGLE_MAPS_ID
        }}
        onLoad={onLoad}
        libraries={libraries}
      />
    </MapContainer>
  );
};

export default Map; 