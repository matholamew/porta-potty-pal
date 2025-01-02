import React from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['marker'];

const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return children({ isLoaded });
};

export default GoogleMapsProvider; 