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
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const HomeScreen = ({ isLoaded }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyToilets, setNearbyToilets] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeLocation = async () => {
      setIsLoading(true);
      try {
        // Try to get location from localStorage first
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
          const parsed = JSON.parse(savedLocation);
          console.log('Loaded from storage:', parsed);
          setUserLocation(parsed);
        }

        // Get fresh location
        const location = await getCurrentLocation();
        console.log('Fresh location:', location);
        
        const userLoc = {
          lat: Number(location.latitude),
          lng: Number(location.longitude)
        };
        console.log('Formatted location:', userLoc);

        if (mounted) {
          setUserLocation(userLoc);
          localStorage.setItem('userLocation', JSON.stringify(userLoc));
          
          const toilets = await getNearbyToilets(
            userLoc.lat,
            userLoc.lng
          );
          setNearbyToilets(toilets);
          setLocationError(null);
        }
      } catch (error) {
        console.error('Error initializing:', error);
        if (mounted) {
          setLocationError('Unable to get your location. Please enable location services and refresh the page.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Add event listener for when the page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        initializeLocation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    initializeLocation();

    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
      const location = await getCurrentLocation();
      console.log('Got fresh location:', location);
      
      const userLoc = {
        lat: Number(location.latitude),
        lng: Number(location.longitude)
      };
      console.log('Formatted user location:', userLoc);
      
      setUserLocation(userLoc);
      localStorage.setItem('userLocation', JSON.stringify(userLoc));
      
      const toilets = await getNearbyToilets(
        userLoc.lat,
        userLoc.lng
      );
      setNearbyToilets(toilets);
      setLocationError(null);
    } catch (error) {
      console.error('Error refreshing location:', error);
      setLocationError('Unable to refresh your location. Please try again.');
    }
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
              onMarkerClick={setSelectedLocation}
              selectedLocation={selectedLocation}
              isLoaded={isLoaded}
            />
          ) : (
            <div>Loading map...</div>
          )}
        </MapContainer>

        <Grid>
          <LocationList
            locations={nearbyToilets}
            onLocationSelect={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
          <div>
            {selectedLocation ? (
              <LocationDetails 
                location={selectedLocation} 
                onBack={() => setSelectedLocation(null)}
              />
            ) : (
              userLocation && isLoaded && (
                <AddLocation
                  userLocation={userLocation}
                  onLocationAdded={handleLocationAdded}
                  isLoaded={isLoaded}
                />
              )
            )}
          </div>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default HomeScreen; 