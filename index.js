

const alexa = {};
const defaults = require('lodash.defaults');
const bodyParser = require('body-parser');
const normalizeApiPath = require('./lib/normalize-api-path');

alexa.response = function (header, payload, endpoint) {
  const self = this;
  this.resolved = false;
  this.response = {
    event: {
      context: {},
      header: {},
      payload: {},
      endpoint: {},
    },
  };
  this.endpoints = [];
  this.endpoint = function (obj) {
    if (typeof this.response.event.payload.endpoints === 'undefined') {
      this.response.event.payload.endpoints = this.endpoints;
      this.payloadObject.set('endpoints', []);
    }
    if (typeof obj !== 'undefined') {
      this.endpoints.push(obj);
      this.payloadObject.set('endpoints', this.endpoints);
    }
    this.setHeaderName('Discover.Response');
    return this;
  };
  this.payloadObject = new alexa.payload();
  this.setPayload = function (payloadJSON) {
    this.response.event.payload = payloadJSON;
  };
  this.setContext = function (contextJSON) {
    this.response.context = contextJSON;
  };
  this.setEventContext = function (contextJSON) {
    this.response.event.context = contextJSON;
  };
  this.endpointObject = endpoint;

  this.cameraStreams = [];
  this.cameraStream = function (obj) {
    if (typeof this.response.event.endpoint === 'undefined') {
      this.response.event.endpoint = endpoint.details;
    }
    if (Object.keys(this.response.event.endpoint).length === 0) {
      this.response.event.endpoint = endpoint.details;
    }
    if (typeof this.response.event.payload.cameraStreams === 'undefined') {
      this.response.event.payload.cameraStreams = this.cameraStreams;
      this.payloadObject.set('cameraStreams', this.cameraStreams);
    }
    if (typeof obj !== 'undefined') {
      this.cameraStreams.push(obj);
    }
    this.setHeaderName('Response');
    return this;
  };

  this.errorResponse = function (type, message) {
    if (typeof this.response.event.endpoint === 'undefined') {
      this.response.event.endpoint = endpoint.details;
    }
    if (Object.keys(this.response.event.endpoint).length === 0) {
      this.response.event.endpoint = endpoint.details;
    }
    this.response.event.payload.type = type;
    this.response.event.payload.message = message;
    this.payloadObject.clear();
    this.payloadObject.set('type', type);
    this.payloadObject.set('message', message);
    this.setHeaderName('ErrorResponse');
    this.setHeaderNamespace('Alexa');
    return this;
  };

  this.sceneController = function (name) {
    if (typeof this.response.event.endpoint === 'undefined') {
      this.response.event.endpoint = endpoint.details;
    }
    if (Object.keys(this.response.event.endpoint).length === 0) {
      this.response.event.endpoint = endpoint.details;
    }

    this.setHeaderName(name);
    this.setHeaderNamespace('Alexa.SceneController');
    return this;
  };

  this.powerController = function (value, timeOfSample, uncertaintyInMilliseconds) {
    if (typeof this.response.event.endpoint === 'undefined') {
      this.response.event.endpoint = endpoint.details;
    }
    if (Object.keys(this.response.event.endpoint).length === 0) {
      this.response.event.endpoint = endpoint.details;
    }

    this.setContext({
      properties: [{
        namespace: 'Alexa.PowerController',
        name: 'powerState',
        value,
        timeOfSample,
        uncertaintyInMilliseconds,
      }],
    });
    this.setHeaderName('Response');
    this.setHeaderNamespace('Alexa');
    return this;
  };

  this.authorization = function () {
    this.setHeaderName('AcceptGrant.Response');
    this.setHeaderNamespace('Alexa.Authorization');
    return this;
  };

  this.mediametadatas = [];
  this.mediametadataerrors = [];
  this.mediametadata = function (obj, errObj) {
    if (typeof this.response.event.payload.media === 'undefined') {
      this.response.event.payload.media = this.mediametadatas;
      this.payloadObject.set('media', this.mediametadatas);
    }
    if (typeof obj !== 'undefined') {
      this.mediametadatas.push(obj);
    }
    if (typeof this.response.event.payload.errors === 'undefined') {
      this.response.event.payload.errors = this.mediametadataerrors;
      this.payloadObject.set('errors', this.mediametadataerrors);
    }
    if (typeof errObj !== 'undefined') {
      this.mediametadataerrors.push(errObj);
    }
    this.setHeaderName('GetMediaMetadata.Response');
    return this;
  };

  this.rtcSessionController = function (headerName, obj) {
    if (typeof this.response.event.endpoint === 'undefined') {
      this.response.event.endpoint.endpointId = endpoint.details.endpointId;
    }
    if (Object.keys(this.response.event.endpoint).length === 0) {
      this.response.event.endpoint = endpoint.details;
    }

    if (typeof obj !== 'undefined') {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        this.payloadObject.set(keys[i], obj[keys[i]]);
      }
    }
    this.setHeaderName(headerName);
    this.setHeaderNamespace('Alexa.RTCSessionController');
    return this;
  };

  this.speaker = function (properties) {
    if (typeof this.response.event.endpoint === 'undefined') {
      this.response.event.endpoint = endpoint.details;
    }
    if (Object.keys(this.response.event.endpoint).length === 0) {
      this.response.event.endpoint = endpoint.details;
    }

    if (Array.isArray(properties)) {
      this.setContext({
        properties,
      });
    }

    this.setHeaderName('Response');
    this.setHeaderNamespace('Alexa.Speaker');
    return this;
  };

  this.alexaResponse = function (properties, eventProperties) {
    if (typeof this.response.event.endpoint === 'undefined') {
      this.response.event.endpoint = endpoint.details;
    }
    if (Object.keys(this.response.event.endpoint).length === 0) {
      this.response.event.endpoint = endpoint.details;
    }

    if (Array.isArray(properties)) {
      this.setContext({
        properties,
      });
    }

    if (typeof eventProperties === 'object') {
      this.setEventContext({
        properties: eventProperties,
      });
    }

    this.setHeaderName('Response');
    this.setHeaderNamespace('Alexa');
    return this;
  };

  this.securityPanelController = function (value, timeOfSample, uncertaintyInMilliseconds, obj) {
    if (typeof this.response.event.endpoint === 'undefined') {
      this.response.event.endpoint = endpoint.details;
    }
    if (Object.keys(this.response.event.endpoint).length === 0) {
      this.response.event.endpoint = endpoint.details;
    }
    this.setContext({
      properties: [{
        namespace: 'Alexa.SecurityPanelController',
        name: 'armState',
        value,
        timeOfSample,
        uncertaintyInMilliseconds,
      }],
    });
    if (typeof obj !== 'undefined') {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        this.payloadObject.set(keys[i], obj[keys[i]]);
      }
    }

    this.setHeaderName('Arm.Response');
    this.setHeaderNamespace('Alexa.SecurityPanelController');
    return this;
  };

  this.securityPanelControllerError = function (obj) {
    if (typeof this.response.event.endpoint === 'undefined') {
      this.response.event.endpoint = endpoint.details;
    }
    if (Object.keys(this.response.event.endpoint).length === 0) {
      this.response.event.endpoint = endpoint.details;
    }
    if (typeof obj !== 'undefined') {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        this.payloadObject.set(keys[i], obj[keys[i]]);
      }
    }
    this.setHeaderName('ErrorResponse');
    this.setHeaderNamespace('Alexa.SecurityPanelController');
    return this;
  };

  this.setHeaderName = function (name) {
    if (typeof this.response.event.header.name === 'undefined') {
      this.response.event.header = JSON.parse(JSON.stringify(header.details));
    }
    this.response.event.header.name = name;
  };
  this.setHeaderNamespace = function (name) {
    if (typeof this.response.event.header.namespace === 'undefined') {
      this.response.event.header = JSON.parse(JSON.stringify(header.details));
    }
    this.response.event.header.namespace = name;
  };
  this.prepare = function () {
    this.setPayload(this.payloadObject.getDetails());
  };
};

alexa.request = function (json) {
  this.data = json;

  this.namespace = function () {
    if (!(this.data && this.data.directive && this.data.directive.header && this.data.directive.header.namespace)) {
      console.error('missing request type:', this.data);
      return;
    }
    return this.data.directive.header.namespace;
  };

  this.isDiscover = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.Discover') === 0);
  };
  this.isCameraStreamController = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.CameraStreamController') === 0);
  };
  this.isSceneController = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.SceneController') === 0);
  };
  this.isPowerController = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.PowerController') === 0);
  };
  this.isAuthorization = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.Authorization') === 0);
  };
  this.isMediametadata = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.MediaMetadata') === 0);
  };
  this.isRTCSessionController = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.RTCSessionController') === 0);
  };
  this.isSpeaker = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.Speaker') === 0);
  };
  this.isAlexa = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa') === 0);
  };
  this.isStepSpeaker = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.StepSpeaker') === 0);
  };
  this.isSecurityPanelController = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.SecurityPanelController') === 0);
  };
  this.isChannelController = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.ChannelController') === 0);
  };
  this.isModeController = function () {
    const requestNamespace = this.namespace;
    return (requestNamespace && requestNamespace.indexOf('Alexa.ModeController') === 0);
  };

  this.namespace = null;
  this.name = null;
  this.messageId = null;
  this.header = null;

  if (this.data.directive && this.data.directive.header) {
    this.namespace = this.data.directive.header.namespace;
    this.name = this.data.directive.header.name;
    this.messageId = this.data.directive.header.messageId;
    this.header = this.data.directive.header;
  }

  const header = new alexa.header(json.directive.header);
  this.hasHeader = function () {
    return header.isAvailable();
  };
  this.getHeader = function () {
    return header;
  };

  const payload = new alexa.payload(json.directive.payload);
  this.hasPayload = function () {
    return payload.isAvailable();
  };
  this.getPayload = function () {
    return payload;
  };

  const endpoint = new alexa.endpoint(json.directive.endpoint);
  this.hasEndpoint = function () {
    return endpoint.isAvailable();
  };
  this.getEndpoint = function () {
    return endpoint;
  };
};

alexa.header = function (header) {
  const isAvailable = (typeof header !== 'undefined');
  this.isAvailable = function () {
    return isAvailable;
  };
  if (isAvailable) {
    this.details = header;
    this.details.namespace = this.details.namespace || null;
    this.details.name = this.details.name || null;
    this.details.messageId = this.details.messageId || null;
  } else {
    this.details = {};
  }
};

alexa.payload = function (payload) {
  const isAvailable = (typeof payload !== 'undefined');
  this.isAvailable = function () {
    return isAvailable;
  };

  this.get = function (key) {
    return this.getDetails()[key];
  };
  this.set = function (key, value) {
    // payload[key] = value;
    this.details[key] = value;
  };
  this.clear = function (key) {
    if (typeof key === 'string') {
      if (typeof this.details[key] !== 'undefined') {
        delete this.details[key];
      }
    } else {
      this.details = {};
    }
  };

  this.details = payload || {};
  this.scope = (typeof payload !== 'undefined') ? payload.scope : {};

  this.getScope = function () {
    return JSON.parse(JSON.stringify(this.scope));
  };
  this.getDetails = function () {
    return JSON.parse(JSON.stringify(this.details));
  };
};

alexa.endpoint = function (endpoint) {
  const isAvailable = (typeof endpoint !== 'undefined');
  this.isAvailable = function () {
    return isAvailable;
  };
  if (isAvailable) {
    this.get = function (key) {
      return this.getScope()[key];
    };
    this.set = function (key, value) {
      endpoint[key] = value;
    };

    this.details = endpoint;
    this.scope = endpoint.scope || {};
    this.endpointId = endpoint.endpointId;
    this.cookie = endpoint.cookie || {};
  } else {
    this.get = function () {
      throw 'NO_ENDPOINT';
    };
    this.details = {};
    this.scope = {};
    this.cookie = {};
  }
  this.getScope = function () {
    return JSON.parse(JSON.stringify(this.scope));
  };
};

alexa.apps = {};

alexa.app = function (name) {
  if (!(this instanceof alexa.app)) {
    throw new Error('Function must be called with the new keyword');
  }

  const self = this;
  this.name = name;
  this.messages = {
    INVALID_REQUEST_NAMESPACE: "Sorry, the application didn't know what to do with that namespace",
    NO_DISCOVERY_FUNCTION: 'Try telling the application what to do instead of discovery it',
    NO_CAMERASTREAMCONTROLLER_FUNCTION: "Sorry, the application can't handle this",
    NO_SCENECONTROLLER_FUNCTION: "Sorry, the application can't handle this",
    NO_POWERCONTROLLER_FUNCTION: "Sorry, the application can't handle this",
    NO_ALEXA_FUNCTION: 'Try telling the application what to do instead of opening it',
    NO_AUTHORIZATION_FUNCTION: "Sorry, the application can't handle this",
    NO_MEDIAMETADATA_FUNCTION: "Sorry, the application can't handle this",
    NO_RTCSESSIONCONTROLLER_FUNCTION: "Sorry, the application can't handle this",
    NO_SPEAKER_FUNCTION: "Sorry, the application can't handle this",
    NO_ALEXARESPONSE_FUNCTION: "Sorry, the application can't handle this",
    NO_STEPSPEAKER_FUNCTION: "Sorry, the application can't handle this",
    NO_SECURITYPANELCONTROLLER_FUNCTION: "Sorry, the application can't handle this",
    NO_CHANNELCONTROLLER_FUNCTION: "Sorry, the application can't handle this",
    NO_MODECONTROLLER_FUNCTION: "Sorry, the application can't handle this",
  };

  this.error = null;

  this.pre = function (/* request, response, type */) {};
  this.post = function (/* request, response, type */) {};

  this.discoveryFunc = null;
  this.discovery = function (func) {
    self.discoveryFunc = func;
  };

  this.alexaFunc = null;
  this.alexa = function (func) {
    self.alexaFunc = func;
  };

  this.cameraStreamControllerFunc = null;
  this.cameraStreamController = function (func) {
    self.cameraStreamControllerFunc = func;
  };

  this.sceneControllerFunc = null;
  this.sceneController = function (func) {
    self.sceneControllerFunc = func;
  };

  this.powerControllerFunc = null;
  this.powerController = function (func) {
    self.powerControllerFunc = func;
  };

  this.authorizationFunc = null;
  this.authorization = function (func) {
    self.authorizationFunc = func;
  };

  this.mediametadataFunc = null;
  this.mediametadata = function (func) {
    self.mediametadataFunc = func;
  };

  this.rtcSessionControllerFunc = null;
  this.rtcSessionController = function (func) {
    self.rtcSessionControllerFunc = func;
  };

  this.speakerFunc = null;
  this.speaker = function (func) {
    self.speakerFunc = func;
  };

  this.stepSpeakerFunc = null;
  this.stepSpeaker = function (func) {
    self.stepSpeakerFunc = func;
  };

  this.securityPanelControllerFunc = null;
  this.securityPanelController = function (func) {
    self.securityPanelControllerFunc = func;
  };

  this.channelControllerFunc = null;
  this.channelController = function (func) {
    self.channelControllerFunc = func;
  };

  this.modeControllerFunc = null;
  this.modeController = function (func) {
    self.modeControllerFunc = func;
  };

  this.request = function (request_json) {
    const request = new alexa.request(request_json);
    const response = new alexa.response(request.getHeader(), request.getPayload(), request.getEndpoint());
    let postExecuted = false;
    let requestNamespace = request.namespace;
    const promiseChain = Promise.resolve();

    // attach Promise resolve/reject functions to the response object
    response.send = function (exception) {
      response.prepare();
      let postPromise = Promise.resolve();
      if (typeof self.post === 'function' && !postExecuted) {
        postExecuted = true;
        postPromise = Promise.resolve(self.post(request, response, requestNamespace, exception));
      }
      return postPromise.then(() => {
        if (!response.resolved) {
          response.resolved = true;
        }
        return response.response;
      });
    };
    response.fail = function (msg, exception) {
      response.prepare();
      let postPromise = Promise.resolve();
      if (typeof self.post === 'function' && !postExecuted) {
        postExecuted = true;
        postPromise = Promise.resolve(self.post(request, response, requestNamespace, exception));
      }
      return postPromise.then(() => {
        if (!response.resolved) {
          response.resolved = true;
          throw msg;
        }
        // propagate successful response if it's already been resolved
        return response.response;
      });
    };

    return promiseChain.then(() => {
      // Call to `.pre` can also throw, so we wrap it in a promise here to
      // propagate errors to the error handler
      let prePromise = Promise.resolve();
      if (typeof self.pre === 'function') {
        prePromise = Promise.resolve(self.pre(request, response, requestNamespace));
      }
      return prePromise;
    }).then(() => {
      requestNamespace = request.namespace;
      if (!response.resolved) {
        if (requestNamespace === 'Alexa.Discovery') {
          if (typeof self.discoveryFunc === 'function') {
            return Promise.resolve(self.discoveryFunc(request, response));
          }
          throw 'NO_DISCOVERY_FUNCTION';
        } else if (requestNamespace === 'Alexa.CameraStreamController') {
          if (typeof self.cameraStreamControllerFunc === 'function') {
            return Promise.resolve(self.cameraStreamControllerFunc(request, response));
          }
          throw 'NO_CAMERASTREAMCONTROLLER_FUNCTION';
        } else if (requestNamespace === 'Alexa.SceneController') {
          if (typeof self.sceneControllerFunc === 'function') {
            return Promise.resolve(self.sceneControllerFunc(request, response));
          }
          throw 'NO_SCENECONTROLLER_FUNCTION';
        } else if (requestNamespace === 'Alexa.PowerController') {
          if (typeof self.powerControllerFunc === 'function') {
            return Promise.resolve(self.powerControllerFunc(request, response));
          }
          throw 'NO_POWERCONTROLLER_FUNCTION';
        } else if (requestNamespace === 'Alexa') {
          if (typeof self.alexaFunc === 'function') {
            return Promise.resolve(self.alexaFunc(request, response));
          }
          throw 'NO_ALEXA_FUNCTION';
        } else if (requestNamespace === 'Alexa.Authorization') {
          if (typeof self.authorizationFunc === 'function') {
            return Promise.resolve(self.authorizationFunc(request, response));
          }
          throw 'NO_AUTHORIZATION_FUNCTION';
        } else if (requestNamespace === 'Alexa.MediaMetadata') {
          if (typeof self.mediametadataFunc === 'function') {
            return Promise.resolve(self.mediametadataFunc(request, response));
          }
          throw 'NO_MEDIAMETADATA_FUNCTION';
        } else if (requestNamespace === 'Alexa.RTCSessionController') {
          if (typeof self.rtcSessionControllerFunc === 'function') {
            return Promise.resolve(self.rtcSessionControllerFunc(request, response));
          }
          throw 'NO_RTCSESSIONCONTROLLER_FUNCTION';
        } else if (requestNamespace === 'Alexa.Speaker') {
          if (typeof self.speakerFunc === 'function') {
            return Promise.resolve(self.speakerFunc(request, response));
          }
          throw 'NO_SPEAKER_FUNCTION';
        } else if (requestNamespace === 'Alexa') {
          if (typeof self.alexaFunc === 'function') {
            return Promise.resolve(self.alexaFunc(request, response));
          }
          throw 'NO_ALEXARESPONSE_FUNCTION';
        } else if (requestNamespace === 'Alexa.StepSpeaker') {
          if (typeof self.stepSpeakerFunc === 'function') {
            return Promise.resolve(self.stepSpeakerFunc(request, response));
          }
          throw 'NO_STEPSPEAKER_FUNCTION';
        } else if (requestNamespace === 'Alexa.SecurityPanelController') {
          if (typeof self.securityPanelControllerFunc === 'function') {
            return Promise.resolve(self.securityPanelControllerFunc(request, response));
          }
          throw 'NO_SECURITYPANELCONTROLLER_FUNCTION';
        } else if (requestNamespace === 'Alexa.ChannelController') {
          if (typeof self.channelControllerFunc === 'function') {
            return Promise.resolve(self.channelControllerFunc(request, response));
          }
          throw 'NO_CHANNELCONTROLLER_FUNCTION';
        } else if (requestNamespace === 'Alexa.ModeController') {
          if (typeof self.modeControllerFunc === 'function') {
            return Promise.resolve(self.modeControllerFunc(request, response));
          }
          throw 'NO_MODECONTROLLER_FUNCTION';
        } else {
          throw 'INVALID_REQUEST_NAMESPACE';
        }
      }
    })
      .then(() => response.send())
      .catch((e) => {
        if (typeof self.error === 'function') {
          // Default behavior of any error handler is to send a response
          return Promise.resolve(self.error(e, request, response)).then(() => {
            if (!response.resolved) {
              response.resolved = true;
              return response.send();
            }
            // propagate successful response if it's already been resolved
            return response.response;
          });
        } else if (typeof e === 'string' && self.messages[e]) {
          if (request.isDiscover()) {
            response.endpoint();
            return response.send(e);
          }
          if (request.isCameraStreamController() ||
              request.isSceneController() ||
              request.isPowerController() ||
              request.isAuthorization() ||
              request.isRTCSessionController() ||
              request.isMediametadata() ||
              request.isSpeaker() ||
              request.isAlexa() ||
              request.isStepSpeaker() ||
              request.isSecurityPanelController() ||
              request.isChannelController() ||
              request.isModeController()
          ) {
            response.errorResponse('INTERNAL_ERROR', self.messages[e]);
            return response.send(e);
          }
          return response.fail(self.messages[e]);
        }
        if (!response.resolved) {
          if (e.message) {
            return response.fail(`Unhandled exception: ${e.message}.`, e);
          } else if (typeof e === 'string') {
            return response.fail(`Unhandled exception: ${e}.`, e);
          }
          return response.fail('Unhandled exception.', e);
        }
        throw e;
      });
  };

  // attach Alexa endpoint to an express router
  //
  // @param object options.expressApp the express instance to attach to
  // @param router options.router router instance to attach to the express app
  // @param string options.endpoint the path to attach the router to (e.g., passing 'mine' attaches to '/mine')
  // @param bool options.checkCert when true, applies Alexa certificate checking (default true)
  // @param bool options.debug when true, sets up the route to handle GET requests (default false)
  // @param function options.preRequest function to execute before every POST
  // @param function options.postRequest function to execute after every POST
  // @throws Error when router or expressApp options are not specified
  // @returns this
  this.express = function (options) {
    if (!options.expressApp && !options.router) {
      throw new Error('You must specify an express app or an express router to attach to.');
    }

    const defaultOptions = {
      endpoint: `/${self.name}`,
    };

    options = defaults(options, defaultOptions);

    // In ExpressJS, user specifies their paths without the '/' prefix
    const deprecated = options.expressApp && options.router;
    const endpoint = deprecated ? '/' : normalizeApiPath(options.endpoint);
    const target = deprecated ? options.router : (options.expressApp || options.router);

    if (deprecated) {
      options.expressApp.use(normalizeApiPath(options.endpoint), options.router);
      console.warn("Usage deprecated: Both 'expressApp' and 'router' are specified.");
    }

    target.use(endpoint, bodyParser.json());

    // exposes POST /<endpoint> route
    target.post(endpoint, (req, res) => {
      let json = req.body,
        response_json;
      if (typeof json.directive === 'undefined') {
        console.error('Is missing directive');
        return res.status(500).send('Server Error');
      }
      // preRequest and postRequest may return altered request JSON, or undefined, or a Promise
      Promise.resolve(typeof options.preRequest === 'function' ? options.preRequest(json, req, res) : json)
        .then((json_new) => {
          if (json_new) {
            json = json_new;
          }
          return json;
        })
        .then(self.request)
        .then((app_response_json) => {
          response_json = app_response_json;
          return Promise.resolve(typeof options.postRequest === 'function' ? options.postRequest(app_response_json, req, res) : app_response_json);
        })
        .then((response_json_new) => {
          response_json = response_json_new || response_json;
          res.json(response_json).send();
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Server Error');
        });
    });
  };

  // add the app to the global list of named apps
  if (name) {
    alexa.apps[name] = self;
  }

  return this;
};

module.exports = alexa;
