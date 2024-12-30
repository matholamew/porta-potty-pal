import React, { useState } from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import { addReview } from '../utils/database';
import AddReview from './AddReview';
import RatingDisplay from './RatingDisplay';

const Container = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  margin-top: ${props => props.theme.spacing.lg};
`;

const ReviewsHeader = styled.h3`
  font-size: ${props => props.theme.typography.body.fontSize};
  font-weight: 600;
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  color: ${props => props.theme.colors.text.primary};
`;

const ReviewCard = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-bottom: ${props => props.theme.spacing.md};

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
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.body.fontSize};
  cursor: pointer;
  margin-top: ${props => props.theme.spacing.md};
  transition: opacity 0.2s ease;

  &:hover {
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

const LocationDetails = ({ location, onBack }) => {
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <Container>
      <BackButton onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to List
      </BackButton>
      
      <LocationName>{location.name}</LocationName>
      <RatingDisplay rating={averageRating} />

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      <ReviewsContainer>
        <ReviewsHeader>Reviews ({sortedReviews.length})</ReviewsHeader>
        
        {isAddingReview ? (
          <AddReview 
            onSubmit={handleAddReview}
            onCancel={() => setIsAddingReview(false)}
          />
        ) : (
          <AddReviewButton onClick={() => setIsAddingReview(true)}>
            Add Review
          </AddReviewButton>
        )}

        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, index) => (
            <ReviewCard key={index}>
              <RatingDisplay rating={review.rating} size="18px" />
              <ReviewText>{review.comment}</ReviewText>
              <ReviewDate>
                {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
              </ReviewDate>
            </ReviewCard>
          ))
        ) : (
          <NoReviews>No reviews yet. Be the first to review!</NoReviews>
        )}
      </ReviewsContainer>
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