import React from 'react';
import HomeScreen from './screens/HomeScreen';
import GoogleMapsProvider from './components/GoogleMapsProvider';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const App = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <AppContainer>
        <GoogleMapsProvider>
          {({ isLoaded }) => (
            <HomeScreen isLoaded={isLoaded} />
          )}
        </GoogleMapsProvider>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
