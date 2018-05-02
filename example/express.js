const express = require('express');
const alexa = require('../index');

const PORT = process.env.port || 3000;
const app = express();

// ALWAYS setup the alexa app and attach it to express before anything else.
const endpoint = '';
const alexaApp = new alexa.app('test');

alexaApp.express({
  expressApp: app,
});

app.set('view engine', 'ejs');

alexaApp.discovery((request, response) => {
  response.endpoint({
    endpointId: 'uniqueIdOfCameraEndpoint',
    manufacturerName: 'the manufacturer name of the endpoint',
    modelName: 'the model name of the endpoint',
    friendlyName: 'Camera',
    description: 'a description that is shown to the customer',
    displayCategories: ['CAMERA'],
    cookie: {
      key1: 'arbitrary key/value pairs for skill to reference this endpoint.',
      key2: 'There can be multiple entries',
      key3: 'but they should only be used for reference purposes.',
      key4: 'This is not a suitable place to maintain current endpoint state.',
    },
    capabilities: [{
      type: 'AlexaInterface',
      interface: 'Alexa.CameraStreamController',
      version: '3',
      cameraStreamConfigurations: [
        {
          protocols: ['RTSP'],
          resolutions: [{ width: 1920, height: 1080 }, { width: 1280, height: 720 }],
          authorizationTypes: ['BASIC'],
          videoCodecs: ['H264', 'MPEG2'],
          audioCodecs: ['G711'],
        },
        {
          protocols: ['RTSP'],
          resolutions: [{ width: 1920, height: 1080 }, { width: 1280, height: 720 }],
          authorizationTypes: ['NONE'],
          videoCodecs: ['H264'],
          audioCodecs: ['AAC'],
        },
      ],
    }],
  });
});

alexaApp.cameraStreamController((request, response) => {
  response.cameraStream({
    uri: 'rtsp://username:password@link.to.video:443/feed1.mp4',
    expirationTime: '2017-09-27T20:30:30.45Z',
    idleTimeoutSeconds: 30,
    protocol: 'RTSP',
    resolution: {
      width: 1920,
      height: 1080,
    },
    authorizationType: 'BASIC',
    videoCodec: 'H264',
    audioCodec: 'AAC',
  });
});

app.listen(PORT);
console.log(`Listening on port ${PORT}, try http://localhost:${PORT}/${endpoint}`);

