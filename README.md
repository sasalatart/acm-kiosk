# ACM-Kiosk

> ACM-PUC's kiosk management.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Docker Automated build](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)](sasalatart/acm-kiosk)
[![](https://images.microbadger.com/badges/version/sasalatart/acm-kiosk.svg)](https://microbadger.com/images/sasalatart/acm-kiosk)
[![](https://images.microbadger.com/badges/image/sasalatart/acm-kiosk.svg)](https://microbadger.com/images/sasalatart/acm-kiosk)

### Setup

##### Development

1. Clone and cd into this repository
2. Run `npm install` (or `yarn install`)
3. Set the environment variables:
  - `DB_HOST` ('localhost' should work), or alternatively `MONGODB_URI`
  - `FB_CLIENT_ID` (your app Facebook Client ID)
  - `FB_CLIENT_SECRET` (your app Facebook Client Secret)
4. Turn on your local mongodb server if that is the case
5. run `gulp watch` (turns on the frontend code watchers)
6. run `nodemon server/index.js` (turns on the backend server)

Remember to set `localhost` as your App Domain and `http://localhost/` as your
Site URL at [Developers.Facebook](https://developers.facebook.com/).

##### Docker

```sh
# Set the environment variables
$ export HOST=your-deployment-host
$ export PORT=80
$ export FB_CLIENT_ID=your-Facebook-Client-ID
$ export FB_CLIENT_SECRET=your-Facebook-Client-Secret
$ export SECRET_TOKEN=any-string

# Build & run
$ docker-compose up -d
```

The server's machine should now be redirecting its port 80 to the container's
port 8888.

To stop:
```sh
$ docker-compose stop
```

Remember that your App Domain and your Site URL at [Developers.Facebook](https://developers.facebook.com/) should be configured
according to ACM_KIOSK_HOST's value.
