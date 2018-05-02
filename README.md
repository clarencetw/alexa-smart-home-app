## Table of Contents

* [Introduction](#introduction)
* [Features](#features)
* [Examples](#examples)
    * [Express](#express)
* [API](#api)
    * [request](#request)
    * [response](#response)
    * [payload](#payload)
    * [endpoint](#endpoint)
* [Request Handlers](#request-handlers)
    * [Discovery](#Discovery)
    * [CameraStreamController](#CameraStreamController)
* [Execute Code On Every Request](#execute-code-on-every-request)
    * [pre()](#pre)
    * [post()](#post)
* [License](#license)

# alexa-smart-home-app

A Node module to simplify the development of Alexa skills (applications.)
This module is clone for [alexa-app](https://github.com/alexa-js/alexa-app) then redesign for alexa smart home skill

[![NPM](https://img.shields.io/npm/v/alexa-smart-home-app.svg)](https://www.npmjs.com/package/alexa-smart-home-app/)
[![Build Status](https://travis-ci.org/clarencetw/alexa-smart-home-app.svg?branch=master)](https://travis-ci.org/clarencetw/alexa-smart-home-app)
[![Coverage Status](https://coveralls.io/repos/github/clarencetw/alexa-smart-home-app/badge.svg?branch=master)](https://coveralls.io/github/clarencetw/alexa-smart-home-app?branch=master)

## Introduction

This module parses HTTP JSON requests from the Alexa platform and builds the JSON response that consumed by an Alexa-compatible device, such as the Echo.

It provides a DSL for defining event.

## Features

## Examples

### Express

```javascript
var express = require("express");
var alexa = require("alexa-app");
var express_app = express();

var app = new alexa.app("sample");

// setup the alexa app and attach it to express before anything else
app.express({ expressApp: express_app });

// now POST calls to /sample in express will be handled by the app.request() function
// GET calls will not be handled

// from here on, you can setup any other express routes or middleware as normal
```

The express function accepts the following parameters.

* `expressApp` the express app instance to attach to
* `router` the express router instance to attach to
* `endpoint` the path to attach the express app or router to (e.g., passing `'mine'` attaches to `/mine`)
* `preRequest` function to execute before every POST
* `postRequest` function to execute after every POST

Either `expressApp` or `router` is required.

A full express example is available [here](example/express.js).

## API

Skills define handlers for Discovery, CameraStreamController, and SceneController, just like normal Alexa development. The alexa-smart-home-app module provides a layer around this functionality that simplifies the interaction. Each handler gets passed a request and response object, which are custom for this module.

### request

```javascript
// return the namespace of request received
String request.namespace()

// check if the namespace is discover
Boolean request.isDiscover()

// check if the namespace is camera stream controller
Boolean request.isCameraStreamController()

// check if the namespace is sceneController
Boolean request.isSceneController()

// return the header object
Dialog request.getHeader()

// check if you can read header
Boolean request.hasHeader()

// return the payload object
Dialog request.getPayload()

// check if you can read payload
Boolean request.hasPayload()

// return the endpoint object
Dialog request.getEndpoint()

// check if you can read endpoint
Boolean request.hasEndpoint()

// the raw request JSON object
request.data
```

### response

The response JSON object is automatically built for you. All you need to do is tell it what you want to output.

```javascript

// alexa-discovery @see https://developer.amazon.com/zh/docs/device-apis/alexa-discovery.html
// skill supports discovery
response.endpoint(Object endpoint)

// alexa-camerastreamcontroller @see https://developer.amazon.com/zh/docs/device-apis/alexa-camerastreamcontroller.html
// skill supports camerastreamcontroller
response.cameraStream(Object stream)

// alexa-camerastreamcontroller @see https://developer.amazon.com/zh/docs/device-apis/alexa-camerastreamcontroller.html
// skill supports camerastreamcontroller
response.sceneController(Object scene)

// alexa-errorresponse @see https://developer.amazon.com/zh/docs/device-apis/alexa-errorresponse.html
// skill supports error response
response.errorResponse(String type, String message)

// send the response to the Alexa device (success) immediately
// this returns a promise that you must return to continue the
// promise chain. Calling this is optional in most cases as it
// will be called automatically when the handler promise chain
// resolves, but you can call it and return its value in the
// chain to send the response immediately. You can also use it
// to send a response from `post` after failure.
async response.send()

// trigger a response failure
// the internal promise containing the response will be rejected, and should be handled by the calling environment
// instead of the Alexa response being returned, the failure message will be passed
// similar to `response.send()`, you must return the value returned from this call to continue the promise chain
// this is equivalent to calling `throw message` in handlers
// *NOTE:* this does not generate a response compatible with Alexa, so when calling it explicitly you may want to handle the response with `.error` or `.post`
async response.fail(String message)
```

### payload
```javascript
// check if you can read payload
Boolean request.hasPayload()

// get the payload object
var session = request.getPayload()

// return the value of a session variable
String payload.get(String key)

// payload details, as passed by Amazon in the request
payload.details = { ... }
```

### endpoint
```javascript
// check if you can read endpoint
Boolean request.hasEndpoint()

// get the payload object
var session = request.getEndpoint()

// return the value of a endpoint variable
String endpoint.get(String key)

// return the endpoint's scope
String endpoint.scope

// return the endpoint's endpointId
String endpoint.endpointId

// return the endpoint's cookie
String endpoint.cookie

// endpoint details, as passed by Amazon in the request
endpoint.details = { ... }
```

## Request Handlers

Your app can define a single handler for the `discovery` event and the `cameraStreamController` event, and `sceneController` event.

### Discovery

```javascript
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
```

### CameraStreamController

```javascript
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
```

## Execute Code On Every Request

In addition to specific event handlers, you can define functions that will run on every request.

### pre()

Executed before any event handlers. This is useful to setup new payload, validate the `token`, or do any other kind of validations.
You can perform asynchronous functionality in `pre` by returning a Promise.

```javascript
app.pre = function(request, response, namespace) {
  if (request.hasPayload() && request.getPayload().token != "User Token") {
    // fail ungracefully
    throw "Invalid token";
  }
};

// Asynchronous
app.pre = function(request, response, namespace) {
  return db.getUserToken().then(function(token) {
    if (request.hasPayload() && request.getPayload().token != token) {
      throw new Error("Invalid token");
    }
  });
};
```

Note that the `post()` method still gets called, even if the `pre()` function calls `send()` or `fail()`. The post method can always override anything done before it.

### post()

The last thing executed for every request. It is even called if there is an exception or if a response has already been sent. The `post()` function can change anything about the response. It can even turn a `return response.fail()` into a `return respond.send()` with entirely new content. If `post()` is called after an exception is thrown, the exception itself will be the 4th argument.

You can perform asynchronous functionality in `pre` by returning a Promise similar to `pre` or any of the handlers.

```javascript
app.post = function(request, response, namespace, exception) {
  if (exception) {
    // always turn an exception into a successful response
    return response.send();
  }
};
```

### Customizing Default Error Messages

```javascript
app.messages.INVALID_REQUEST_NAMESPACE = "Sorry, the application didn't know what to do with that namespace";
```

See the code for default messages you can override.

## License

Copyright (c) 2018 Clarence Lin

MIT License, see [LICENSE](LICENSE.md) for details.
