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
        const mockRequest = mockHelper.load('sample_messages/SecurityPanelController/SecurityPanelController.Arm.request.json');

        context('with a request of SecurityPanelController', () => {
          context('with no SecurityPanelController handler', () => {
            describe('output ErrorResponse', () => {
              it('responds with ErrorResponse message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.type);

                return expect(subject).to.eventually.become('INTERNAL_ERROR');
              });
            });
          });

          context('with a matching SecurityPanelController handler', () => {
            const value = 'ARMED_AWAY',
              timeOfSample = '2017-02-03T16:20:50.52Z',
              uncertaintyInMilliseconds = 0;

            describe('output SecurityPanelController controller', () => {
              it('handles SecurityPanelController correctly', () => {
                testApp.securityPanelController((req, res) => {
                  res.securityPanelController(value, timeOfSample, uncertaintyInMilliseconds);
                });

                const subject = testApp.request(mockRequest).then(response => response.context.properties[0].value);

                return expect(subject).to.eventually.become(value);
              });

              it('handles SecurityPanelController correctly', () => {
                testApp.securityPanelController((req, res) => {
                  res.securityPanelController(value, timeOfSample, uncertaintyInMilliseconds);
                });

                const subject = testApp.request(mockRequest).then(response => response.event.header.name);

                return expect(subject).to.eventually.become('Arm.Response');
              });

              it('responds with expected message for promise', () => {
                testApp.securityPanelController((req, res) => Promise.resolve().then(() => {
                  res.securityPanelController(value, timeOfSample, uncertaintyInMilliseconds);
                }));

                const subject = testApp.request(mockRequest).then(response => response.context.properties[0].value);

                return expect(subject).to.eventually.become(value);
              });

              it('handles error for promise', () => {
                testApp.securityPanelController((req, res) => Promise.reject(new Error('promise failure')));

                const subject = testApp.request(mockRequest);

                return expect(subject).to.be.rejectedWith('promise failure');
              });

              it('responds have timeOfSample', () => {
                testApp.securityPanelController((req, res) => Promise.resolve().then(() => {
                  res.securityPanelController(value, timeOfSample, uncertaintyInMilliseconds);
                }));

                const subject = testApp.request(mockRequest).then(response => response.context.properties[0].timeOfSample);

                return expect(subject).to.eventually.become(timeOfSample);
              });

              it('responds have uncertaintyInMilliseconds', () => {
                testApp.securityPanelController((req, res) => Promise.resolve().then(() => {
                  res.securityPanelController(value, timeOfSample, uncertaintyInMilliseconds);
                }));

                const subject = testApp.request(mockRequest).then(response => response.context.properties[0].uncertaintyInMilliseconds);

                return expect(subject).to.eventually.become(uncertaintyInMilliseconds);
              });

              it('responds have payload exitDelayInSeconds', () => {
                testApp.securityPanelController((req, res) => Promise.resolve().then(() => {
                  res.securityPanelController(value, timeOfSample, uncertaintyInMilliseconds, {
                    exitDelayInSeconds: 0,
                  });
                }));

                const subject = testApp.request(mockRequest).then(response => response.event.payload.exitDelayInSeconds);

                return expect(subject).to.eventually.become(0);
              });

              it('handles SecurityPanelController error', () => {
                const payload = {
                  type: 'UNCLEARED_ALARM',
                  message: 'Unable to arm or disarm the security panel because it is in alarm status.',
                };

                testApp.securityPanelController((req, res) => {
                  res.securityPanelControllerError(payload);
                });

                const subject = testApp.request(mockRequest).then(response => response.event.payload);

                return expect(subject).to.eventually.become(payload);
              });
            });
          });
        });
      });
    });
  });
});
