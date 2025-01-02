import React from 'react';
import styled from 'styled-components';
import RatingDisplay from './RatingDisplay';

const ListContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ListHeader = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.divider};
  font-size: ${props => props.theme.typography.h2.fontSize};
  line-height: ${props => props.theme.typography.h2.lineHeight};
  font-weight: ${props => props.theme.typography.h2.fontWeight};
  color: ${props => props.theme.colors.text.primary};
`;

const ScrollContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.md};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray[100]};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray[400]};
    border-radius: 4px;
  }
`;

const LocationCard = styled.div`
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.selected ? props.theme.colors.gray[100] : props.theme.colors.surface};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: ${props => props.theme.spacing.xxl};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.selected && `
    border: 2px solid ${props.theme.colors.primary};
  `}
`;

const LocationName = styled.h3`
  font-size: ${props => props.theme.typography.body.fontSize};
  line-height: ${props => props.theme.typography.body.lineHeight};
  font-weight: 600;
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  color: ${props => props.theme.colors.text.primary};
`;

const Rating = styled.div`
  font-size: 20px;
  margin: ${props => props.theme.spacing.xs} 0;
`;

const ReviewCount = styled.p`
  font-size: ${props => props.theme.typography.caption.fontSize};
  line-height: ${props => props.theme.typography.caption.lineHeight};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const LocationInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Distance = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.text.secondary};
`;

const LocationList = ({ locations, onLocationSelect, selectedLocation }) => {
  const getAverageRating = (location) => {
    if (!location.reviews || location.reviews.length === 0) {
      return location.rating || 0;
    }
    return location.reviews.reduce((sum, review) => sum + review.rating, 0) / location.reviews.length;
  };

  const formatDistance = (distance) => {
    if (distance < 0.1) {
      const feet = Math.round(distance * 5280);
      return `${feet}ft`;
    }
    return `${distance.toFixed(1)}mi`;
  };

  return (
    <ListContainer>
      <ListHeader>Local Loo-cations</ListHeader>
      <ScrollContainer>
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            onClick={() => onLocationSelect(location)}
            selected={selectedLocation?.id === location.id}
          >
            <LocationInfo>
              <LocationName>{location.name}</LocationName>
              <Distance>{formatDistance(location.distance)}</Distance>
            </LocationInfo>
            <RatingDisplay rating={getAverageRating(location)} size="18px" />
            {location.reviews && location.reviews.length > 0 && (
              <ReviewCount>
                {location.reviews.length} {location.reviews.length === 1 ? 'log' : 'logs'}
              </ReviewCount>
            )}
          </LocationCard>
        ))}
      </ScrollContainer>
    </ListContainer>
  );
};

export default LocationList; 