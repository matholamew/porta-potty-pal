const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Run once per day at midnight
exports.cleanupInactiveLocations = functions.pubsub.schedule('0 0 * * *').onRun(async (context) => {
  const db = admin.firestore();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    // Get all locations
    const locationsRef = db.collection('toiletLocations');
    const snapshot = await locationsRef.get();

    const batch = db.batch();
    let deleteCount = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Check if location has any reviews
      if (!data.reviews || data.reviews.length === 0) {
        // If no reviews, check creation date
        const createdAt = new Date(data.createdAt);
        if (createdAt < threeMonthsAgo) {
          batch.delete(doc.ref);
          deleteCount++;
        }
      } else {
        // If has reviews, check most recent review date
        const latestReview = data.reviews.reduce((latest, review) => {
          const reviewDate = new Date(review.date);
          return reviewDate > latest ? reviewDate : latest;
        }, new Date(0));

        if (latestReview < threeMonthsAgo) {
          batch.delete(doc.ref);
          deleteCount++;
        }
      }
    });

    // Commit the batch
    if (deleteCount > 0) {
      await batch.commit();
      console.log(`Deleted ${deleteCount} inactive locations`);
    } else {
      console.log('No inactive locations to delete');
    }

    return null;
  } catch (error) {
    console.error('Error cleaning up inactive locations:', error);
    return null;
  }
});

// Function to check reports and remove comments if threshold is met
exports.moderateComments = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snap, context) => {
    const report = snap.data();
    const db = admin.firestore();
    
    try {
      // Get all reports for this comment in the last 24 hours
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const reportsRef = collection(db, 'reports');
      const reportsSnapshot = await reportsRef
        .where('locationId', '==', report.locationId)
        .where('reviewDate', '==', report.reviewDate)
        .where('timestamp', '>', oneDayAgo.toISOString())
        .get();

      if (reportsSnapshot.size >= 3) {
        // Get the location document
        const locationRef = doc(db, 'toiletLocations', report.locationId);
        const locationDoc = await locationRef.get();
        
        if (locationDoc.exists()) {
          const locationData = locationDoc.data();
          
          // Filter out the reported review
          const updatedReviews = locationData.reviews.filter(
            review => review.date !== report.reviewDate
          );
          
          // Update the location document
          await locationRef.update({
            reviews: updatedReviews
          });
          
          // Calculate new average rating
          if (updatedReviews.length > 0) {
            const newAverage = updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length;
            await locationRef.update({
              rating: newAverage
            });
          }
          
          // Clean up reports for this comment
          const batch = db.batch();
          reportsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
          });
          await batch.commit();
          
          console.log(`Removed reported comment from location ${report.locationId}`);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error moderating comments:', error);
      return null;
    }
  }); 