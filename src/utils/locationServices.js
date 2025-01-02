export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    // For development/testing - remove in production
    if (process.env.REACT_APP_USE_DEFAULT_LOCATION === 'true') {
      console.log('Using default location');
      return resolve({
        latitude: 40.7128,
        longitude: -74.0060 // New York coordinates
      });
    }

    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    // Check if running on iOS Safari
    const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Very permissive options for iOS
    const options = {
      enableHighAccuracy: false,
      timeout: isIOSSafari ? 30000 : 20000,
      maximumAge: isIOSSafari ? 60000 : 30000,
    };

    let attemptCount = 0;
    const maxAttempts = 2;

    const handleError = (error) => {
      console.error('Location error:', error);
      attemptCount++;

      // Try to use cached location as fallback
      const cachedPosition = localStorage.getItem('lastKnownLocation');
      if (cachedPosition) {
        try {
          const { latitude, longitude } = JSON.parse(cachedPosition);
          console.log('Using cached location as fallback');
          resolve({ latitude, longitude });
          return;
        } catch (e) {
          console.warn('Error parsing cached location:', e);
        }
      }

      if (attemptCount < maxAttempts) {
        console.log(`Retrying location request (attempt ${attemptCount + 1}/${maxAttempts})`);
        setTimeout(attemptLocation, 2000);
      } else {
        let message = 'Unable to get your location. ';
        
        if (isIOSSafari) {
          message = 'Please enable location services:\n' +
                   'Settings > Safari > Location > Allow';
        } else {
          message = 'Please check your location settings and try again.';
        }
        
        reject(new Error(message));
      }
    };

    const attemptLocation = (isBackground = false) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = Number(position.coords.latitude);
          const longitude = Number(position.coords.longitude);

          if (!isNaN(latitude) && !isNaN(longitude)) {
            // Cache the location
            localStorage.setItem('lastKnownLocation', JSON.stringify({
              latitude,
              longitude,
              timestamp: Date.now()
            }));

            console.log('Location obtained:', { latitude, longitude });
            if (!isBackground) {
              resolve({ latitude, longitude });
            }
          } else if (!isBackground) {
            handleError(new Error('Invalid coordinates received'));
          }
        },
        (error) => {
          if (!isBackground) {
            handleError(error);
          }
        },
        options
      );
    };

    // Try to get cached position first
    const cachedPosition = localStorage.getItem('lastKnownLocation');
    if (cachedPosition) {
      try {
        const { latitude, longitude, timestamp } = JSON.parse(cachedPosition);
        const age = Date.now() - timestamp;
        if (age < 300000) { // 5 minutes
          console.log('Using cached location');
          resolve({ latitude, longitude });
          // Still try to get fresh location in background
          attemptLocation(true);
          return;
        }
      } catch (e) {
        console.warn('Error parsing cached location:', e);
      }
    }

    // Start first attempt
    attemptLocation();
  });
}; 