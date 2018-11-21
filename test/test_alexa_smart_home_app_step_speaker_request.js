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
        const mockRequest = mockHelper.load('sample_messages/StepSpeaker/StepSpeaker.AdjustVolume.request.json');

        context('with a request of StepSpeaker', () => {
          context('with no StepSpeaker handler', () => {
            describe('output ErrorResponse', () => {
              it('responds with ErrorResponse message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.type);

                return expect(subject).to.eventually.become('INTERNAL_ERROR');
              });
            });
          });

          context('with a matching StepSpeaker handler', () => {
            describe('output StepSpeaker controller', () => {
              it('handles StepSpeaker correctly', () => {
                testApp.stepSpeaker((req, res) => {
                  res.alexaResponse();
                });

                const subject = testApp.request(mockRequest).then(response => response.context);

                return expect(subject).to.eventually.become();
              });

              it('responds with expected message for promise', () => {
                testApp.stepSpeaker((req, res) => Promise.resolve().then(() => {
                  res.alexaResponse();
                }));

                const subject = testApp.request(mockRequest).then(response => response.context);

                return expect(subject).to.eventually.become();
              });

              it('handles error for promise', () => {
                testApp.stepSpeaker((req, res) => Promise.reject(new Error('promise failure')));

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
