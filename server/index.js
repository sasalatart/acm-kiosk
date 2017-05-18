const app = require('./app');
const config = require('./config');

const PORT = config.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
