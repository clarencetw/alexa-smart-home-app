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
        const mockRequest = mockHelper.load('sample_messages/RTCSessionController/RTCSessionController.InitiateSessionWithOffer.request.json');

        context('with a request of RTCSessionController', () => {
          context('with no RTCSessionController handler', () => {
            describe('output ErrorResponse', () => {
              it('responds with ErrorResponse message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.type);

                return expect(subject).to.eventually.become('INTERNAL_ERROR');
              });
            });
          });

          context('with a matching RTCSessionController handler', () => {
            const expectedRTCSessionController = {
              sessionId: 'the session identifier',
              offer: {
                format: 'SDP',
                value: '<SDP offer value>',
              },
            };

            describe('output RTCSession controller', () => {
              it('handles rtcSessionController correctly', () => {
                testApp.rtcSessionController((req, res) => {
                  res.rtcSessionController('InitiateSessionWithOffer', expectedRTCSessionController);
                });

                const subject = testApp.request(mockRequest).then(response => response.event.payload);

                return expect(subject).to.eventually.become(expectedRTCSessionController);
              });

              it('responds with expected message for promise', () => {
                testApp.rtcSessionController((req, res) => Promise.resolve().then(() => {
                  res.rtcSessionController('InitiateSessionWithOffer', expectedRTCSessionController);
                }));

                const subject = testApp.request(mockRequest).then(response => response.event.payload);

                return expect(subject).to.eventually.become(expectedRTCSessionController);
              });

              it('handles error for promise', () => {
                testApp.rtcSessionController((req, res) => Promise.reject(new Error('promise failure')));

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
