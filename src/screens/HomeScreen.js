import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Map from '../components/Map';
import LocationList from '../components/LocationList';
import LocationDetails from '../components/LocationDetails';
import AddLocation from '../components/AddLocation';
import AboutModal from '../components/AboutModal';
import { getCurrentLocation } from '../utils/locationServices';
import { getNearbyToilets } from '../utils/database';
import Menu from '../components/Menu';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../theme';
import Modal from '../components/Modal';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${props => props.theme.colors.background};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  margin-bottom: ${props => props.theme.spacing.md};
  padding: 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  width: 100%;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
`;

const Title = styled.h1`
  font-size: 17px;
  line-height: 22px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  padding: 0;
  flex: 1;
  text-align: center;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing.xl};
  flex: 1;
  padding: 0 16px 80px;
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
  margin: 4px 16px 0;
  padding: 8px 12px;
  background-color: ${props => `${props.theme.colors.error}10`};
  color: ${props => props.theme.colors.error};
  border-radius: 8px;
  font-size: 13px;
  line-height: 18px;
  font-weight: 400;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  svg {
    width: 16px;
    height: 16px;
  }
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize with system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  });
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    // Modern browsers
    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

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

  useEffect(() => {
    let unsubscribe;
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 1000; // 1 second

    const setupFirestoreListener = () => {
      try {
        const toiletLocationsRef = collection(db, 'toiletLocations');
        unsubscribe = onSnapshot(
          toiletLocationsRef,
          (snapshot) => {
            const locations = [];
            snapshot.forEach((doc) => {
              locations.push({ id: doc.id, ...doc.data() });
            });
            setNearbyToilets(locations);
            setIsReconnecting(false);
            retryCount = 0; // Reset retry count on successful connection
          },
          (error) => {
            console.error('Firestore error:', error);
            setIsReconnecting(true);
            
            // Retry connection if it's a network error
            if (error.code === 'unavailable' && retryCount < maxRetries) {
              retryCount++;
              setTimeout(() => {
                if (unsubscribe) {
                  unsubscribe();
                }
                setupFirestoreListener();
              }, retryDelay * retryCount);
            }
          }
        );
      } catch (error) {
        console.error('Error setting up Firestore listener:', error);
      }
    };

    setupFirestoreListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        <Header>
          <HeaderContent>
            <Title>In-a-Pinch</Title>
            <Menu 
              onUpdateLocation={handleRefreshLocation}
              onToggleTheme={handleToggleTheme}
              isDarkMode={isDarkMode}
              onAboutClick={() => setIsAboutModalOpen(true)}
            />
          </HeaderContent>
          {locationError && (
            <ErrorMessage>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {locationError}
            </ErrorMessage>
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

        <AboutModal 
          isOpen={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
        />
      </Container>
    </ThemeProvider>
  );
};

export default HomeScreen; 