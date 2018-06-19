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
        const mockRequest = mockHelper.load('sample_messages/SceneController/SceneController.Activate.request.json');

        context('request without payload', () => {
          const expectedSceneController = 'Activate';

          describe('output stream controller have cause', () => {
            it('cause is PHYSICAL_INTERACTION', () => {
              testApp.sceneController((req, res) => {
                res.sceneController(expectedSceneController);
                const payloadObj = res.payloadObject;
                payloadObj.set('cause', {
                  type: 'PHYSICAL_INTERACTION',
                });
              });

              const subject = testApp.request(mockRequest).then(response => response.event.payload.cause);

              return expect(subject).to.eventually.become({
                type: 'PHYSICAL_INTERACTION',
              });
            });
          });
        });
      });
    });

    describe('#request', () => {
      describe('response', () => {
        const mockRequest = mockHelper.load('sample_messages/CameraStreamController/CameraStreamController.request.json');

        context('request with payload', () => {
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
          describe('output cameraStreams have imageUri', () => {
            it('have imageUri', () => {
              testApp.cameraStreamController((req, res) => {
                res.cameraStream(expectedCameraStream);
                const payloadObj = res.payloadObject;
                payloadObj.set('imageUri', 'https://username:password@link.to.image/image.jpg');
              });

              const subject = testApp.request(mockRequest).then(response => response.event.payload.imageUri);

              return expect(subject).to.eventually.become('https://username:password@link.to.image/image.jpg');
            });
          });
        });
      });
    });
  });
});
