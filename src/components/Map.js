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
    const container = document.createElement('div');
    container.className = 'marker-container';
    container.style.position = 'relative';
    container.style.transform = 'translate(-50%, -50%)';

    const marker = document.createElement('div');
    marker.className = 'custom-marker';
    marker.style.width = '32px';
    marker.style.height = '32px';
    marker.style.backgroundColor = isSelected ? '#2196F3' : '#4CAF50';
    marker.style.borderRadius = '50%';
    marker.style.border = '3px solid white';
    marker.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    marker.style.position = 'relative';
    marker.style.zIndex = '1';
    marker.style.display = 'flex';
    marker.style.alignItems = 'center';
    marker.style.justifyContent = 'center';

    // Add restroom icon
    const icon = document.createElement('div');
    icon.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
      </svg>
    `;
    icon.style.lineHeight = '0';

    marker.appendChild(icon);
    container.appendChild(marker);
    return container;
  };

  const createUserMarkerContent = () => {
    const container = document.createElement('div');
    container.className = 'user-marker-container';
    container.style.position = 'relative';
    container.style.transform = 'translate(-50%, -50%)';

    const ring = document.createElement('div');
    ring.style.width = '32px';
    ring.style.height = '32px';
    ring.style.borderRadius = '50%';
    ring.style.backgroundColor = 'rgba(25, 118, 210, 0.2)';
    ring.style.border = '2px solid #1976D2';
    ring.style.boxShadow = '0 0 0 2px rgba(25, 118, 210, 0.3)';
    ring.style.animation = 'pulse 2s infinite';

    const dot = document.createElement('div');
    dot.style.width = '12px';
    dot.style.height = '12px';
    dot.style.backgroundColor = '#1976D2';
    dot.style.borderRadius = '50%';
    dot.style.border = '2px solid white';
    dot.style.position = 'absolute';
    dot.style.top = '50%';
    dot.style.left = '50%';
    dot.style.transform = 'translate(-50%, -50%)';
    dot.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

    // Add pulse animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
        }
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
        }
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
        }
      }
    `;
    document.head.appendChild(style);

    container.appendChild(ring);
    container.appendChild(dot);
    return container;
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