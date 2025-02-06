// src/environments/environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4200', // Since we're using localStorage, this isn't used but included for future API integration
  localStorage: {
    userKey: 'recyclehub_user',
    usersKey: 'recyclehub_users',
    collectionsKey: 'recyclehub_collections',
    pointsKey: 'recyclehub_points'
  },
  pointsConfig: {
    plastic: 2,  // points per kg
    glass: 1,
    paper: 1,
    metal: 5
  },
  maxCollectionWeight: 10, // in kg
  minCollectionWeight: 1,
  maxPendingRequests: 3,
  voucherConversion: {
    100: 50,  // 100 points = 50 Dh
    200: 120, // 200 points = 120 Dh
    500: 350  // 500 points = 350 Dh
  },
  collectionHours: {
    start: 9,  // 09:00
    end: 18    // 18:00
  }
};

// src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com', // For future use
  localStorage: {
    userKey: 'recyclehub_user',
    usersKey: 'recyclehub_users',
    collectionsKey: 'recyclehub_collections',
    pointsKey: 'recyclehub_points'
  },
  pointsConfig: {
    plastic: 2,
    glass: 1,
    paper: 1,
    metal: 5
  },
  maxCollectionWeight: 10,
  minCollectionWeight: 1,
  maxPendingRequests: 3,
  voucherConversion: {
    100: 50,
    200: 120,
    500: 350
  },
  collectionHours: {
    start: 9,
    end: 18
  }
};
