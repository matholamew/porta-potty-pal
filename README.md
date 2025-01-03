
# Porta Potty Pal 🚽

A modern, user-friendly web application to help people find and review public restrooms near them. Built with React, Firebase, and Google Maps.

## Features

### Core Functionality
- **Real-time Location-based Search**: Find nearby restrooms based on your current location
- **Interactive Map**: Visual display of all nearby restrooms with custom markers
- **Location Details**: View detailed information about each restroom
- **Add New Locations**: Contribute to the community by adding new restroom locations
- **Reviews & Ratings**: Rate and review locations to help other users
- **Location Caching**: Offline support for last known locations
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing

### Location Information
- Generated unique names for each location
- Star-based rating system
- User comments and reviews
- Timestamp of when location was added
- Exact coordinates for precise navigation

### User Interface
- Modern, clean design
- Mobile-responsive layout
- iOS-optimized interface
- Smooth animations and transitions
- Intuitive navigation
- Accessibility-focused design

### Technical Features
- Progressive Web App (PWA) capabilities
- Real-time updates using Firebase
- Advanced Google Maps integration
- Geolocation services with fallback options
- Local storage for caching
- Error handling and retry mechanisms

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Google Maps API key

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_GOOGLE_MAPS_ID=your_google_maps_id
```

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/porta-potty-pal.git
cd porta-potty-pal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Firebase Setup

### Firestore Collections
The app uses the following Firestore collection:
- `toiletLocations`: Stores all restroom locations and their details
  - Fields:
    - `name`: String (generated unique name)
    - `latitude`: Number
    - `longitude`: Number
    - `rating`: Number (1-5)
    - `createdAt`: Timestamp
    - `reviews`: Array of review objects
      - `rating`: Number (1-5)
      - `comment`: String
      - `date`: Timestamp

### Security Rules
Basic security rules for Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

## Google Maps Integration

The app uses several Google Maps features:
- Maps JavaScript API
- Places API
- Geocoding API
- Advanced Markers

Make sure to enable these services in your Google Cloud Console.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Maps Platform
- Firebase
- React
- Styled Components
- All contributors and users of the app
