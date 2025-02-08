export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com',
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
