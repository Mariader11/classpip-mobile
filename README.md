# Classpip Mobile Application

[![Build Status](https://travis-ci.org/classpip/classpip-mobile.svg?branch=master)](https://travis-ci.org/classpip/classpip-mobile)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/bd643be13e654be1a662a6eea7a43b93)](https://www.codacy.com/app/classpip/classpip-mobile?utm_source=github.com&utm_medium=referral&utm_content=classpip/classpip-mobile&utm_campaign=Badge_Grade)
[![Coverage Status](https://coveralls.io/repos/github/classpip/classpip-mobile/badge.svg?branch=master)](https://coveralls.io/github/classpip/classpip-mobile?branch=master)

[![classpip-icon](https://github.com/classpip/classpip/raw/master/resources/icontext-land.png)](http://www.classpip.com/)

[Classpip](https://www.classpip.com) is a Mobile application for School Gamification. The application is builded around a stack of services and websites to provide a full experience in order to gamificate any educational environment.

This repository contains the mobile application for the [Classpip](https://www.classpip.com) architecture. With this application you could connect to the services oriented architecture.

## Global dependencies

Make sure you have NodeJS installed. Download the installer [here](https://nodejs.org/dist/latest-v5.x/) or use your favorite package manager. It's best to get the 5x version of node along with the 3x version of npm. This offers the best in stability and speed for building.

```script
npm install -g ionic@beta
npm install -g cordova
npm install -g gulp
npm install -g typings
```

Install ios-deploy to deploy iOS applications to devices.

```script
npm install -g ios-deploy
```

## Local dependencies

All the project dependencies are manage through [npmjs](https://www.npmjs.com/). This command will also download the typings configured in the __typings.json__ file. To install this dependencies you should run:

```script
npm install
```

## Development

For development purposes, you have to restore the ionic state of the application. All the platforms and plugins files are not uploaded into the repo but you could download with the following command:

```script
ionic state restore
```

To see all the **HTML5 development** you could run the following command to see with livereload all the changes on the browser.

```script
ionic serve
```

If you want to **emulate** your changes on the platform emulators: android ([Android Emulator](https://developer.android.com/studio/run/emulator.html) or [Genymotion](https://www.genymotion.com/)), iOS emulator

```script
ionic emulate [ios|android]
```

If you want to **test the application on real devices** or the browser emulator you could connect a real device in your computer and run:

```script
ionic run [ios|android|browser]
```

Finally if you want to build the application for generating the final artifacts for the market deployment you should run the following command for every platform:

```script
ionic build [ios|android] --release
```

## Testing

There are some unit tests configured in the application to validate the integrity of the code. This tests are running using karma over phantomJS. To tun the unit tests configured in the application you should run:

```script
npm test
```

## License

Classpip is released under the [Apache2 License](https://github.com/classpip/classpip-mobile/blob/master/LICENSE).
