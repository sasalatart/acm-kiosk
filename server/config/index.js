module.exports = {
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || '8888',
  DB_HOST: process.env.MONGO_HOST || 'mongo_db',
  DB_PORT: process.env.MONGO_PORT || '27017',
  SECRET_TOKEN: process.env.SECRET_TOKEN || 'napoleon',
  FB_CLIENT_ID: process.env.FB_CLIENT_ID,
  FB_CLIENT_SECRET: process.env.FB_CLIENT_SECRET
};
