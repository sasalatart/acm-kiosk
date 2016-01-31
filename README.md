# ACM-Kiosk

ACM-PUC's kiosk management.

### Setup

##### Development

1. Make sure that at least [NodeJS](https://nodejs.org/en/), and [MongoDB](https://www.mongodb.org/) are installed.
2. Clone and cd into this repository
3. Run `npm install`
4. Set the environment variables:
  - MONGO_HOST ('localhost' should work)
  - ACM_KIOSK_FB_CLIENT_ID (your app Facebook Client ID)
  - ACM_KIOSK_FB_CLIENT_SECRET (your app Facebook Client Secret)
5. Open another shell instance and run `mongod`
6. Run `npm start`

Remember to set `localhost` as your App Domain and `http://localhost/` as your
Site URL at [Developers.Facebook](https://developers.facebook.com/).

##### Docker

```sh
# Set the environment variables
$ export ACM_KIOSK_HOST=your-deployment-host
$ export ACM_KIOSK_PORT=80
$ export ACM_KIOSK_FB_CLIENT_ID=your-Facebook-Client-ID
$ export ACM_KIOSK_FB_CLIENT_SECRET=your-Facebook-Client-Secret
$ export COOKIE_SECRET=any-string
$ export SESSION_SECRET=any-string

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
