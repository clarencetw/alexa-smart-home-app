/* jshint expr: true */


const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mockHelper = require('./helpers/mock_helper');

chai.use(chaiAsPromised);
const expect = chai.expect;
chai.config.includeStack = true;


describe('Alexa', () => {
  const Alexa = require('../index');

  describe('app', () => {
    let testApp;

    beforeEach(() => {
      testApp = new Alexa.app('testApp');
    });

    describe('#request', () => {
      describe('response', () => {
        const mockRequest = mockHelper.load('sample_messages/CameraStreamController/CameraStreamController.request.json');

        context('with a request of CameraStreamController', () => {
          context('with no camera streamcontroller handler', () => {
            describe('output ErrorResponse', () => {
              it('responds with ErrorResponse message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.type);

                return expect(subject).to.eventually.become('INTERNAL_ERROR');
              });
            });
          });

          context('with a matching streamcontroller handler', () => {
            const expectedCameraStream = {
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
            };
            describe('output cameraStreams', () => {
              it('handles reprompting correctly', () => {
                testApp.cameraStreamController((req, res) => {
                  res.cameraStream(expectedCameraStream);
                });

                const subject = testApp.request(mockRequest).then(response => response.event.payload.cameraStreams);

                return expect(subject).to.eventually.become([expectedCameraStream]);
              });

              it('combines multiple cameraStreams', () => {
                testApp.cameraStreamController((req, res) => {
                  res.cameraStream(expectedCameraStream)
                    .cameraStream(expectedCameraStream);
                });

                const subject = testApp.request(mockRequest).then(response => response.event.payload.cameraStreams);

                return expect(subject).to.eventually.become([expectedCameraStream, expectedCameraStream]);
              });

              it('responds with expected message for promise', () => {
                testApp.cameraStreamController((req, res) => Promise.resolve().then(() => {
                  res.cameraStream(expectedCameraStream);
                }));

                const subject = testApp.request(mockRequest).then(response => response.event.payload.cameraStreams);

                return expect(subject).to.eventually.become([expectedCameraStream]);
              });

              it('handles error for promise', () => {
                testApp.cameraStreamController((req, res) => Promise.reject(new Error('promise failure')));

                const subject = testApp.request(mockRequest);

                return expect(subject).to.be.rejectedWith('promise failure');
              });

              it('responds have endpointId', () => {
                testApp.powerController((req, res) => Promise.resolve().then(() => {
                  res.powerController(value, timeOfSample, uncertaintyInMilliseconds);
                }));

                const subject = testApp.request(mockRequest).then(response => response.event.endpoint.endpointId);

                return expect(subject).to.eventually.become(mockRequest.directive.endpoint.endpointId);
              });
            });
          });
        });
      });
    });
  });
});
