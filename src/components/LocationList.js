import React from 'react';
import styled from 'styled-components';
import RatingDisplay from './RatingDisplay';

const ListContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
`;

const ListHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.divider};
  min-height: 44px;
  display: flex;
  align-items: center;
`;

const HeaderTitle = styled.h2`
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
`;

const ScrollContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px 16px;

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

const LocationCard = styled.button`
  width: 100%;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  background: ${props => props.selected ? props.theme.colors.gray[100] : props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  &:active {
    transform: translateY(0);
    background: ${props => props.theme.colors.gray[100]};
  }
  
  ${props => props.selected && `
    border: 2px solid ${props.theme.colors.primary};
    background: ${props.theme.colors.gray[50]};
  `}

  &:last-child {
    margin-bottom: 0;
  }
`;

const LocationInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 4px;
`;

const LocationName = styled.span`
  font-size: 17px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-right: 8px;
`;

const Distance = styled.span`
  font-size: 15px;
  color: ${props => props.theme.colors.text.secondary};
`;

const ReviewCount = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 4px;
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
      <ListHeader>
        <HeaderTitle>Local Loo-cations</HeaderTitle>
      </ListHeader>
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