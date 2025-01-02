import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { addDoc, collection } from 'firebase/firestore';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { db } from '../firebase';
import { generateToiletName } from '../utils/nameGenerator';
import RatingDisplay from './RatingDisplay';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.surface};
  height: 100%;
  
  @media (max-width: 768px) {
    /* Full height on mobile */
    min-height: 100vh;
  }
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${props => props.theme.colors.surface};
  padding: 12px 16px; /* iOS standard header padding */
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px; /* Apple minimum touch target */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const NavButton = styled.button`
  border: none;
  background: none;
  color: ${props => props.theme.colors.primary};
  font-size: 17px; /* iOS standard font size */
  font-weight: 400;
  padding: 12px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 17px; /* iOS standard font size */
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  flex: 1;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

const MapSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 100%;
`;

const MapPickerContainer = styled.div`
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  width: 100%;
`;

const LocationButton = styled.button`
  width: 100%;
  min-height: 44px;
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 10px;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${props => props.theme.colors.primary};
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 10px;
  font-size: 17px;
  line-height: 1.4;
  min-height: 100px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  -webkit-appearance: none;
  resize: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const SubmitButton = styled.button`
  position: sticky;
  bottom: 0;
  width: 100%;
  min-height: 44px; /* Apple minimum touch target */
  padding: 12px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  font-size: 17px; /* iOS standard font size */
  font-weight: 600;
  margin-top: auto;
  
  @media (max-width: 768px) {
    border-radius: 0;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  background-color: ${props => `${props.theme.colors.error}15`};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.caption.fontSize};
  text-align: center;
  margin: 0;
`;

const LoadingMessage = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  text-align: center;
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const RatingContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 12px 0;
`;

const AddLocation = ({ userLocation, onLocationAdded, isLoaded, onClose }) => {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [generatedName, setGeneratedName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(userLocation || { lat: 40.7128, lng: -74.0060 });
  const [currentMarker, setCurrentMarker] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    setGeneratedName(generateToiletName());
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  const onLoad = map => {
    setMap(map);
  };

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  const createMarkerContent = () => {
    const pin = document.createElement('div');
    pin.className = 'custom-marker';
    pin.style.backgroundColor = '#4CAF50';
    pin.style.borderRadius = '50%';
    pin.style.padding = '8px';
    pin.style.border = '2px solid white';
    pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    return pin;
  };

  useEffect(() => {
    if (map && selectedLocation && window.google?.maps?.marker?.AdvancedMarkerElement) {
      // Clear existing marker
      if (currentMarker) {
        currentMarker.map = null;
      }

      // Create new marker
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position: selectedLocation,
        map: map,
        title: 'Selected Location',
        content: createMarkerContent()
      });

      setCurrentMarker(marker);
    }
  }, [map, selectedLocation]);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setSelectedLocation(userLocation);
      setMapCenter(userLocation);
    } else {
      setError('Unable to get your current location');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      setError('Please select a location on the map');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newLocation = {
        name: generatedName,
        rating: Number(rating),
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        createdAt: new Date().toISOString(),
        reviews: [{
          rating: Number(rating),
          comment: comment.trim(),
          date: new Date().toISOString()
        }],
        timestamp: new Date()
      };

      const toiletLocationsRef = collection(db, 'toiletLocations');
      await addDoc(toiletLocationsRef, newLocation);
      
      setRating(3);
      setComment('');
      setSelectedLocation(null);
      setGeneratedName(generateToiletName());
      onLocationAdded();
    } catch (error) {
      console.error('Error adding location:', error);
      setError(`Failed to add location: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header>
        <NavButton type="button" onClick={onClose}>Cancel</NavButton>
        <Title>Add Location</Title>
        <NavButton type="submit" disabled={isSubmitting || !selectedLocation}>
          {isSubmitting ? 'Adding...' : 'Add'}
        </NavButton>
      </Header>
      
      <Content>
        <MapSection>
          <LocationButton type="button" onClick={handleUseCurrentLocation}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
            </svg>
            Use Current Location
          </LocationButton>
          
          <MapPickerContainer>
            {!isLoaded ? (
              <LoadingMessage>Loading map...</LoadingMessage>
            ) : (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={14}
                onClick={handleMapClick}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  mapId: process.env.REACT_APP_GOOGLE_MAPS_ID
                }}
                onLoad={onLoad}
                onUnmount={onUnmount}
              />
            )}
          </MapPickerContainer>
        </MapSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <RatingContainer>
          <RatingDisplay 
            rating={rating}
            interactive={true}
            onRatingSelect={setRating}
          />
        </RatingContainer>
        
        <TextArea
          placeholder="Add a comment about this location..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </Content>
    </Form>
  );
};

export default AddLocation; 