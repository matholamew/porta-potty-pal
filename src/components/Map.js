import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.secondary};
`;

const Map = ({ locations, userLocation, onMarkerClick, selectedLocation }) => {
  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
  };

  const center = userLocation || { lat: 40.7128, lng: -74.0060 };

  return (
    <MapContainer>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        zoom={13}
        center={center}
        options={mapOptions}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#000000",
              strokeWeight: 1,
              scale: 2,
              anchor: new window.google.maps.Point(12, 22),
            }}
          />
        )}
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ 
              lat: location.latitude, 
              lng: location.longitude 
            }}
            onClick={() => onMarkerClick(location)}
            animation={selectedLocation?.id === location.id ? window.google.maps.Animation.BOUNCE : null}
          />
        ))}
      </GoogleMap>
    </MapContainer>
  );
};

export default Map; 