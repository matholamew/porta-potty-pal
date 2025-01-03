import React, { useState } from 'react';
import styled from 'styled-components';
import RatingDisplay from './RatingDisplay';

const ListContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
`;

const ListHeader = styled.button`
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.divider};
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  appearance: none;
  -webkit-appearance: none;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderTitle = styled.h2`
  font-size: 17px;
  line-height: 22px;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
`;

const ChevronIcon = styled.svg`
  width: 20px;
  height: 20px;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.3s ease;
  color: ${props => props.theme.colors.text.secondary};
`;

const ScrollContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px 16px;
  transition: all 0.3s ease;

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

const LocationCount = styled.span`
  font-size: 15px;
  color: ${props => props.theme.colors.text.secondary};
  margin-left: 8px;
`;

const LocationCard = styled.button`
  width: 100%;
  padding: ${props => props.isExpanded ? '12px 16px' : '8px 16px'};
  margin-bottom: 8px;
  border-radius: 12px;
  background: ${props => props.selected ? props.theme.colors.gray[100] : props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  
  &:focus {
    outline: none;
  }
  
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

const CompactView = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
`;

const ExpandedView = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const NameAndRating = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const LocationName = styled.span`
  font-size: 17px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LocationInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 4px;
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
  const [isOpen, setIsOpen] = useState(true);

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
      <ListHeader onClick={() => setIsOpen(!isOpen)} type="button">
        <HeaderContent>
          <HeaderTitle>Local Loo-cations</HeaderTitle>
          <LocationCount>({locations.length})</LocationCount>
        </HeaderContent>
        <ChevronIcon 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          isOpen={isOpen}
        >
          <path d="M19 9l-7 7-7-7" />
        </ChevronIcon>
      </ListHeader>
      <ScrollContainer>
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            onClick={() => onLocationSelect(location)}
            selected={selectedLocation?.id === location.id}
            isExpanded={isOpen}
          >
            {isOpen ? (
              <ExpandedView>
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
              </ExpandedView>
            ) : (
              <CompactView>
                <NameAndRating>
                  <LocationName>{location.name}</LocationName>
                  <RatingDisplay rating={getAverageRating(location)} size="16px" />
                </NameAndRating>
              </CompactView>
            )}
          </LocationCard>
        ))}
      </ScrollContainer>
    </ListContainer>
  );
};

export default LocationList; 