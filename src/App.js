import React from 'react';
import HomeScreen from './screens/HomeScreen';
import GoogleMapsProvider from './components/GoogleMapsProvider';

function App() {
  return (
    <GoogleMapsProvider>
      {({ isLoaded }) => (
        <HomeScreen isLoaded={isLoaded} />
      )}
    </GoogleMapsProvider>
  );
}

export default App;
