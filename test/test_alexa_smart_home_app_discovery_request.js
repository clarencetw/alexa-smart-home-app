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
        const mockRequest = mockHelper.load('sample_messages/Discovery/Discovery.request.json');

        context('with a request of Discovery', () => {
          context('with no discovery handler', () => {
            describe('output endpoint', () => {
              it('responds with empty endpoint message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.endpoints);

                return expect(subject).to.eventually.become([]);
              });
            });
          });

          context('with a matching discovery handler', () => {
            const expectedEndpoint = {
              endpointId: 'appliance-001',
              friendlyName: 'Living Room Light',
              description: 'Smart Light by Sample Manufacturer',
              manufacturerName: 'Sample Manufacturer',
              displayCategories: [
                'LIGHT',
              ],
              capabilities: [
                {
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
                  ],
                },
              ],
            };
            describe('output endpoint', () => {
              it('handles reprompting correctly', () => {
                testApp.discovery((req, res) => {
                  res.endpoint(expectedEndpoint);
                });

                const subject = testApp.request(mockRequest).then(response => response.event.payload.endpoints);

                return expect(subject).to.eventually.become([expectedEndpoint]);
              });

              it('combines multiple endpoint', () => {
                testApp.discovery((req, res) => {
                  res.endpoint(expectedEndpoint)
                    .endpoint(expectedEndpoint);
                });

                const subject = testApp.request(mockRequest).then(response => response.event.payload.endpoints);

                return expect(subject).to.eventually.become([expectedEndpoint, expectedEndpoint]);
              });

              it('responds with expected message for promise', () => {
                testApp.discovery((req, res) => Promise.resolve().then(() => {
                  res.endpoint(expectedEndpoint);
                }));

                const subject = testApp.request(mockRequest).then(response => response.event.payload.endpoints);

                return expect(subject).to.eventually.become([expectedEndpoint]);
              });

              it('handles error for promise', () => {
                testApp.discovery((req, res) => Promise.reject(new Error('promise failure')));

                const subject = testApp.request(mockRequest);

                return expect(subject).to.be.rejectedWith('promise failure');
              });
            });

            describe('requestToken', () => {
              it('handles reprompting correctly', () => {
                testApp.discovery((req, res) => {
                  expect(req.getPayload().scope.type).to.equal(mockRequest.directive.payload.scope.type);
                  expect(req.getPayload().scope.token).to.equal(mockRequest.directive.payload.scope.token);
                  res.endpoint(expectedEndpoint);
                });

                const subject = testApp.request(mockRequest).then(response => response.event.payload.endpoints);
              });
            });
          });
        });
      });
    });
  });
});
