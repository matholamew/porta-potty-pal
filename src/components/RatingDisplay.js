import React from 'react';
import styled from 'styled-components';

const RatingContainer = styled.div`
  font-size: ${props => props.size || '24px'};
  margin: ${props => props.theme.spacing.sm} 0;
  display: inline-flex;
  gap: 2px;
  
  span {
    cursor: ${props => props.interactive ? 'pointer' : 'default'};
    
    &.inactive {
      opacity: 0.25;
      filter: brightness(0.5) saturate(0.5);
    }
    
    ${props => props.interactive && `
      &:hover {
        transform: scale(1.1);
        opacity: 1;
        filter: none;
      }
    `}
  }
`;

const RatingDisplay = ({ rating, size, interactive, onRatingSelect }) => (
  <RatingContainer size={size} interactive={interactive}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={star <= Math.round(rating) ? 'active' : 'inactive'}
        onClick={() => interactive && onRatingSelect && onRatingSelect(star)}
      >
        💩
      </span>
    ))}
  </RatingContainer>
);

export default RatingDisplay; 