import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import { GoogleMap } from '@react-google-maps/api';
import { addReview, deleteLocation } from '../utils/database';
import AddReview from './AddReview';
import RatingDisplay from './RatingDisplay';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.surface};
  height: 100%;
  
  @media (max-width: 768px) {
    min-height: 90vh;
  }
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${props => props.theme.colors.surface};
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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

const MapContainer = styled.div`
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const NavButton = styled.button`
  border: none;
  background: none;
  color: ${props => props.theme.colors.primary};
  font-size: 17px;
  padding: 12px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const LocationName = styled.h2`
  font-size: ${props => props.theme.typography.h2.fontSize};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  color: ${props => props.theme.colors.text.primary};
`;

const Rating = styled.div`
  font-size: 24px;
  margin: ${props => props.theme.spacing.sm} 0;
`;

const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  padding: 0;
  margin: 0;
`;

const ReviewsHeader = styled.h3`
  font-size: ${props => props.theme.typography.body.fontSize};
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
`;

const ReviewCard = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: 10px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const ReviewRating = styled.div`
  font-size: 18px;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ReviewText = styled.p`
  margin: ${props => props.theme.spacing.xs} 0;
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.body.fontSize};
`;

const ReviewDate = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.caption.fontSize};
  margin-top: ${props => props.theme.spacing.xs};
`;

const NoReviews = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-style: italic;
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
`;

const AddReviewButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  margin: 0;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.9;
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.body.fontSize};
  padding: ${props => props.theme.spacing.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  margin-bottom: ${props => props.theme.spacing.md};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ReportButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.75rem;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  opacity: 0.6;
  
  &:hover {
    opacity: 1;
    color: ${props => props.theme.colors.error};
  }
`;

const ReviewActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.xs};
`;

const Title = styled.h2`
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  flex: 1;
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const DeleteButton = styled.button`
  border: none;
  background: none;
  color: ${props => props.theme.colors.error};
  font-size: 17px;
  padding: 12px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const ConfirmationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ConfirmationBox = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 24px;
  border-radius: 14px;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 23px rgba(0, 0, 0, 0.12);
`;

const ConfirmationTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
`;

const ConfirmationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ConfirmButton = styled.button`
  flex: 1;
  min-height: 44px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  background: ${props => props.destructive ? props.theme.colors.error : props.theme.colors.background};
  color: ${props => props.destructive ? 'white' : props.theme.colors.text.primary};
  border: ${props => props.destructive ? 'none' : `1px solid ${props.theme.colors.gray[300]}`};

  &:active {
    opacity: 0.9;
  }
`;

const ConfirmationDescription = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  margin: 0;
  padding: 0;
`;

const libraries = ['marker'];

const handleReportComment = async (locationId, reviewDate) => {
  try {
    const reportRef = collection(db, 'reports');
    await addDoc(reportRef, {
      locationId,
      reviewDate,
      timestamp: new Date().toISOString(),
      type: 'comment'
    });
  } catch (error) {
    console.error('Error reporting comment:', error);
  }
};

const LocationDetails = ({ location, onBack, isLoaded }) => {
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const sortedReviews = [...(location.reviews || [])].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const averageRating = location.reviews?.length > 0
    ? location.reviews.reduce((sum, review) => sum + review.rating, 0) / location.reviews.length
    : location.rating || 0;

  const handleAddReview = async (review) => {
    try {
      setError(null);
      await addReview(location.id, review);
      setIsAddingReview(false);
    } catch (error) {
      console.error('Error adding review:', error);
      setError('Failed to add review. Please try again.');
    }
  };

  const createMarkerContent = () => {
    const container = document.createElement('div');
    container.className = 'marker-container';
    container.style.position = 'relative';
    container.style.transform = 'translate(-50%, -50%)';

    const marker = document.createElement('div');
    marker.className = 'custom-marker';
    marker.style.width = '32px';
    marker.style.height = '32px';
    marker.style.backgroundColor = '#4CAF50';
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

  const onLoad = useCallback((map) => {
    if (window.google?.maps?.marker?.AdvancedMarkerElement) {
      new window.google.maps.marker.AdvancedMarkerElement({
        position: { 
          lat: location.latitude, 
          lng: location.longitude 
        },
        map,
        title: location.name,
        content: createMarkerContent()
      });
    }
  }, [location]);

  const handleDelete = async () => {
    try {
      await deleteLocation(location.id);
      onBack(); // Close the details modal
    } catch (error) {
      setError('Failed to delete location. Please try again.');
    }
  };

  return (
    <Container>
      <Header>
        <NavButton onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back
        </NavButton>
        <Title>{location.name}</Title>
        <DeleteButton onClick={() => setShowDeleteConfirmation(true)}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </DeleteButton>
      </Header>

      <Content>
        <MapContainer>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: location.latitude, lng: location.longitude }}
              zoom={15}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                mapId: process.env.REACT_APP_GOOGLE_MAPS_ID
              }}
              onLoad={onLoad}
              libraries={libraries}
            />
          )}
        </MapContainer>

        <RatingDisplay rating={averageRating} />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ReviewsContainer>
          <ReviewsHeader>Logs ({sortedReviews.length})</ReviewsHeader>
          
          {isAddingReview ? (
            <AddReview 
              onSubmit={handleAddReview}
              onCancel={() => setIsAddingReview(false)}
            />
          ) : (
            <AddReviewButton onClick={() => setIsAddingReview(true)}>
              Log a Comment
            </AddReviewButton>
          )}

          <ReviewsList>
            {sortedReviews.length > 0 ? (
              sortedReviews.map((review, index) => (
                <ReviewCard key={index}>
                  <RatingDisplay rating={review.rating} size="18px" />
                  <ReviewText>{review.comment}</ReviewText>
                  <ReviewDate>
                    {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                  </ReviewDate>
                  <ReviewActions>
                    <ReportButton onClick={() => handleReportComment(location.id, review.date)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                      </svg>
                      Report
                    </ReportButton>
                  </ReviewActions>
                </ReviewCard>
              ))
            ) : (
              <NoReviews>No logs yet. Be the first to add one!</NoReviews>
            )}
          </ReviewsList>
        </ReviewsContainer>
      </Content>

      {showDeleteConfirmation && (
        <ConfirmationOverlay onClick={(e) => e.stopPropagation()}>
          <ConfirmationBox>
            <ConfirmationTitle>
              Are you sure you want to remove this location?
            </ConfirmationTitle>
            <ConfirmationDescription>
              This action will remove this location permanently.
            </ConfirmationDescription>
            <ConfirmationButtons>
              <ConfirmButton onClick={() => setShowDeleteConfirmation(false)}>
                No
              </ConfirmButton>
              <ConfirmButton destructive onClick={handleDelete}>
                Yes
              </ConfirmButton>
            </ConfirmationButtons>
          </ConfirmationBox>
        </ConfirmationOverlay>
      )}
    </Container>
  );
};

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  background-color: ${props => props.theme.colors.error}15;
  padding: ${props => props.theme.spacing.sm};
  margin: ${props => props.theme.spacing.md} 0;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.caption.fontSize};
`;

export default LocationDetails; 