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
  getDoc
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

export const getNearbyToilets = async (lat, lng) => {
  try {
    const toiletsRef = collection(db, 'toiletLocations');
    const q = query(toiletsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const toilets = [];
    querySnapshot.forEach((doc) => {
      toilets.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log('Retrieved toilets:', toilets);
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