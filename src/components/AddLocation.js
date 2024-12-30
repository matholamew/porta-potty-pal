import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { addDoc, collection } from 'firebase/firestore';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { db } from '../firebase';
import { generateToiletName } from '../utils/nameGenerator';
import RatingDisplay from './RatingDisplay';

const Form = styled.form`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  color: ${props => props.theme.colors.text.primary};
`;

const Title = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const Description = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin: ${props => props.theme.spacing.xs} 0;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[400]};
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
    box-shadow: none;
  }
`;

const RatingContainer = styled.div`
  margin: ${props => props.theme.spacing.md} 0;
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  background-color: ${props => `${props.theme.colors.error}15`};
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.875rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.md} 0;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const MapPickerContainer = styled.div`
  margin: ${props => props.theme.spacing.md} 0;
  height: 300px;
  border-radius: ${props => props.theme.borderRadius.sm};
  overflow: hidden;
`;

const LocationButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  &:hover {
    opacity: 0.9;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const LoadingMessage = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  text-align: center;
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const AddLocation = ({ userLocation, onLocationAdded, isLoaded }) => {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [generatedName, setGeneratedName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(userLocation || { lat: 40.7128, lng: -74.0060 });

  useEffect(() => {
    setGeneratedName(generateToiletName());
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  const handleMapClick = (e) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setSelectedLocation(newLocation);
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
      <Title>Add New Location</Title>
      <Description>{generatedName}</Description>
      
      <LocationButton type="button" onClick={handleUseCurrentLocation}>
        <svg viewBox="0 0 24 24" fill="currentColor">
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
              fullscreenControl: false
            }}
          >
            {selectedLocation && (
              <Marker
                position={selectedLocation}
                animation={window.google.maps.Animation.DROP}
              />
            )}
          </GoogleMap>
        )}
      </MapPickerContainer>

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
      
      <Button type="submit" disabled={isSubmitting || !selectedLocation}>
        {isSubmitting ? 'Adding...' : 'Add Location'}
      </Button>
    </Form>
  );
};

export default AddLocation; 