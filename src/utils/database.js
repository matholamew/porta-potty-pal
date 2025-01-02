import { db } from '../config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  GeoPoint,
  orderBy,
  limit,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  deleteDoc
} from 'firebase/firestore';

export const toiletLocationsCollection = 'toiletLocations';

export const addToiletLocation = async (location) => {
  try {
    const docRef = await addDoc(collection(db, toiletLocationsCollection), {
      name: location.name,
      location: new GeoPoint(location.latitude, location.longitude),
      rating: location.rating || 0,
      reviews: location.reviews || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding toilet location:', error);
    throw error;
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Radius of the earth in miles (was 6371 for km)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in miles
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

export const getNearbyToilets = async (lat, lng) => {
  try {
    const toiletsRef = collection(db, 'toiletLocations');
    const q = query(toiletsRef);
    const querySnapshot = await getDocs(q);
    
    const toilets = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Extract coordinates, handling both GeoPoint and direct lat/lng storage
      let latitude, longitude;
      
      if (data.location instanceof GeoPoint) {
        // If location is stored as a GeoPoint
        latitude = data.location.latitude;
        longitude = data.location.longitude;
      } else {
        // Fallback to direct lat/lng properties
        latitude = data.latitude;
        longitude = data.longitude;
      }

      // Only add locations with valid coordinates
      if (typeof latitude === 'number' && typeof longitude === 'number') {
        // Calculate distance
        const distance = calculateDistance(
          lat, 
          lng, 
          latitude,
          longitude
        );
        
        toilets.push({
          id: doc.id,
          ...data,
          // Add normalized coordinates
          latitude,
          longitude,
          // Add formatted coordinates for map
          lat: latitude,
          lng: longitude,
          distance
        });
      } else {
        console.warn('Invalid location data for document:', doc.id, data);
      }
    });

    // Sort toilets by distance
    toilets.sort((a, b) => a.distance - b.distance);

    console.log('Retrieved and sorted toilets:', toilets);
    return toilets;
  } catch (error) {
    console.error('Error getting toilets:', error);
    throw error;
  }
};

const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

export const addReview = async (locationId, review) => {
  try {
    const locationRef = doc(db, 'toiletLocations', locationId);
    const locationDoc = await getDoc(locationRef);
    
    if (!locationDoc.exists()) {
      throw new Error('Location not found');
    }

    const newReview = {
      ...review,
      date: new Date().toISOString()
    };

    const currentData = locationDoc.data();
    const updatedReviews = [...(currentData.reviews || []), newReview];
    const averageRating = calculateAverageRating(updatedReviews);

    await updateDoc(locationRef, {
      reviews: updatedReviews,
      rating: averageRating
    });

    return newReview;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const updateRating = async (toiletId, newRating) => {
  // Implementation for updating ratings
};

export const deleteLocation = async (locationId) => {
  try {
    const locationRef = doc(db, 'toiletLocations', locationId);
    await deleteDoc(locationRef);
    return true;
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
}; 