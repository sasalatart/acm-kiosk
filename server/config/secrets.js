module.exports = {
  APP_HOST: process.env.ACM_KIOSK_HOST || 'localhost',
  APP_PORT: process.env.ACM_KIOSK_PORT || '8888',
  DB_HOST: process.env.MONGO_HOST || 'mongo_db',
  DB_PORT: process.env.MONGO_PORT || '27017',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'napoleon',
  SESSION_SECRET: process.env.SESSION_SECRET || 'napoleon',
  FB_CLIENT_ID: process.env.ACM_KIOSK_FB_CLIENT_ID,
  FB_CLIENT_SECRET: process.env.ACM_KIOSK_FB_CLIENT_SECRET
};
