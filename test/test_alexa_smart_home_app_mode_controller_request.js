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
        const mockRequest = mockHelper.load('sample_messages/ModeController/ModeController.SetMode.request.json');

        context('with a request of Mode Controller', () => {
          context('with no Mode Controller handler', () => {
            describe('output ErrorResponse', () => {
              it('responds with ErrorResponse message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.type);

                return expect(subject).to.eventually.become('INTERNAL_ERROR');
              });
            });
          });

          context('with a matching Mode handler', () => {
            const expectedMode = [
              {
                "namespace": "Alexa.ModeController",
                "name": "mode",
                "instance": "Washer.WashCycle",
                "value": "WashCycle.Normal",
                "timeOfSample": "2017-02-03T16:20:50Z",
                "uncertaintyInMilliseconds": 0
              }
            ];

            describe('output channel controller', () => {
              it('handles channel correctly', () => {
                testApp.modeController((req, res) => {
                  res.alexaResponse(expectedMode);
                });

                const subject = testApp.request(mockRequest).then(response => response.context.properties);

                return expect(subject).to.eventually.become(expectedMode);
              });

              it('responds with expected message for promise', () => {
                testApp.modeController((req, res) => Promise.resolve().then(() => {
                  res.alexaResponse(expectedMode);
                }));

                const subject = testApp.request(mockRequest).then(response => response.context.properties);

                return expect(subject).to.eventually.become(expectedMode);
              });

              it('handles error for promise', () => {
                testApp.modeController((req, res) => Promise.reject(new Error('promise failure')));

                const subject = testApp.request(mockRequest);

                return expect(subject).to.be.rejectedWith('promise failure');
              });
            });

            describe('output channel controller', () => {
              it('handles channel correctly', () => {
                testApp.modeController((req, res) => {
                  res.alexaResponse();
                });

                const subject = testApp.request(mockRequest).then(response => response.context);

                return expect(subject).to.eventually.become();
              });

              it('responds with expected message for promise', () => {
                testApp.modeController((req, res) => Promise.resolve().then(() => {
                  res.alexaResponse();
                }));

                const subject = testApp.request(mockRequest).then(response => response.context);

                return expect(subject).to.eventually.become();
              });

              it('handles error for promise', () => {
                testApp.modeController((req, res) => Promise.reject(new Error('promise failure')));

                const subject = testApp.request(mockRequest);

                return expect(subject).to.be.rejectedWith('promise failure');
              });
            });
          });
        });
      });
    });
  });
});
