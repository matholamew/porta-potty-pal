import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Map from '../components/Map';
import LocationList from '../components/LocationList';
import LocationDetails from '../components/LocationDetails';
import AddLocation from '../components/AddLocation';
import { getCurrentLocation } from '../utils/locationServices';
import { getNearbyToilets } from '../utils/database';
import Menu from '../components/Menu';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../theme';
import Modal from '../components/Modal';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.header`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.h1.fontSize};
  line-height: ${props => props.theme.typography.h1.lineHeight};
  font-weight: ${props => props.theme.typography.h1.fontWeight};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing.xl};
`;

const LocationSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.small};
  overflow: hidden;
`;

const DetailsSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const ErrorMessage = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.error}15;
  color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin: ${props => props.theme.spacing.md} 0;
  font-size: ${props => props.theme.typography.body.fontSize};
  min-height: ${props => props.theme.spacing.xxl};
  display: flex;
  align-items: center;
`;

const RefreshButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${props => props.theme.typography.body.fontSize};
  min-height: ${props => props.theme.spacing.xxl};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.7;
  }
`;

const MapContainer = styled.div`
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AddButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  z-index: 100;
  
  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  // Ensure minimum touch target size (44x44 points)
  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    border-radius: 22px;
    font-size: 20px;
  }
`;

const HomeScreen = ({ isLoaded }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyToilets, setNearbyToilets] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLocationError(null);
        const position = await getCurrentLocation();
        console.log('Setting user location:', position);
        
        // Format the location properly for Google Maps
        setUserLocation({
          lat: Number(position.latitude),
          lng: Number(position.longitude)
        });
        
        // Use the same format for getNearbyToilets
        const toilets = await getNearbyToilets(position.latitude, position.longitude);
        setNearbyToilets(toilets.map(toilet => ({
          ...toilet,
          // Ensure location is properly formatted for the map
          lat: toilet.location?.latitude || toilet.latitude,
          lng: toilet.location?.longitude || toilet.longitude
        })));
      } catch (error) {
        console.error('Location error:', error);
        setLocationError(error.message);
      }
    };

    fetchLocation();
  }, []);

  const handleLocationAdded = async () => {
    if (userLocation) {
      try {
        const toilets = await getNearbyToilets(
          userLocation.lat,
          userLocation.lng
        );
        console.log('Fetched toilets:', toilets);
        setNearbyToilets(toilets);
      } catch (error) {
        console.error('Error fetching toilets:', error);
      }
    }
  };

  // Add a refresh location button handler
  const handleRefreshLocation = async () => {
    try {
      setLocationError(null);
      const position = await getCurrentLocation();
      
      // Format the location properly
      setUserLocation({
        lat: Number(position.latitude),
        lng: Number(position.longitude)
      });
      
      const toilets = await getNearbyToilets(position.latitude, position.longitude);
      setNearbyToilets(toilets.map(toilet => ({
        ...toilet,
        lat: toilet.location?.latitude || toilet.latitude,
        lng: toilet.location?.longitude || toilet.longitude
      })));
    } catch (error) {
      console.error('Location refresh error:', error);
      setLocationError(error.message);
    }
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedLocation(null);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        <Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title>In-a-Pinch</Title>
            <Menu 
              onUpdateLocation={handleRefreshLocation}
              onToggleTheme={handleToggleTheme}
              isDarkMode={isDarkMode}
            />
          </div>
          {locationError && (
            <ErrorMessage>{locationError}</ErrorMessage>
          )}
        </Header>
        
        <MapContainer>
          {isLoaded ? (
            <Map
              locations={nearbyToilets}
              userLocation={userLocation}
              onMarkerClick={handleLocationSelect}
              selectedLocation={selectedLocation}
              isLoaded={isLoaded}
            />
          ) : (
            <div>Loading map...</div>
          )}
        </MapContainer>

        <Grid>
          <LocationSection>
            <LocationList
              locations={nearbyToilets}
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />
          </LocationSection>
        </Grid>

        <AddButton 
          onClick={() => setIsAddLocationModalOpen(true)}
          aria-label="Add new location"
        >
          +
        </AddButton>

        <Modal 
          isOpen={isAddLocationModalOpen} 
          onClose={() => setIsAddLocationModalOpen(false)}
        >
          {userLocation && isLoaded && (
            <AddLocation
              userLocation={userLocation}
              onLocationAdded={() => {
                handleLocationAdded();
                setIsAddLocationModalOpen(false);
              }}
              isLoaded={isLoaded}
              onClose={() => setIsAddLocationModalOpen(false)}
            />
          )}
        </Modal>

        <Modal 
          isOpen={isDetailsModalOpen} 
          onClose={handleCloseDetailsModal}
        >
          {selectedLocation && (
            <LocationDetails 
              location={selectedLocation} 
              onBack={handleCloseDetailsModal}
              isLoaded={isLoaded}
            />
          )}
        </Modal>
      </Container>
    </ThemeProvider>
  );
};

export default HomeScreen; 