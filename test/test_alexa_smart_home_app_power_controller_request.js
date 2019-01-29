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
        const mockRequest = mockHelper.load('sample_messages/PowerController/PowerController.TurnOn.request.json');

        context('with a request of PowerController', () => {
          context('with no camera powerController handler', () => {
            describe('output ErrorResponse', () => {
              it('responds with ErrorResponse message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.type);

                return expect(subject).to.eventually.become('INTERNAL_ERROR');
              });
            });
          });

          context('with a matching powercontroller handler', () => {
            const value = 'ON',
              timeOfSample = '2017-02-03T16:20:50.52Z',
              uncertaintyInMilliseconds = 500;

            describe('output stream controller', () => {
              it('handles reprompting correctly', () => {
                testApp.powerController((req, res) => {
                  res.powerController(value, timeOfSample, uncertaintyInMilliseconds);
                });

                const subject = testApp.request(mockRequest).then(response => response.context.properties[0].value);

                return expect(subject).to.eventually.become(value);
              });

              it('responds with expected message for promise', () => {
                testApp.powerController((req, res) => Promise.resolve().then(() => {
                  res.powerController(value, timeOfSample, uncertaintyInMilliseconds);
                }));

                const subject = testApp.request(mockRequest).then(response => response.context.properties[0].value);

                return expect(subject).to.eventually.become(value);
              });

              it('handles error for promise', () => {
                testApp.powerController((req, res) => Promise.reject(new Error('promise failure')));

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
