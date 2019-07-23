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
        const mockRequest = mockHelper.load('sample_messages/SecurityPanelController/SecurityPanelController.Disarm.request.json');

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
            const properties = [{
              namespace: 'Alexa.SecurityPanelController',
              name: 'armState',
              value: 'DISARMED',
              timeOfSample: '2017-02-03T16:20:50.52Z',
              uncertaintyInMilliseconds: 0,
            }];

            describe('output SecurityPanelController controller', () => {
              it('handles SecurityPanelController correctly', () => {
                testApp.securityPanelController((req, res) => {
                  res.alexaResponse(properties);
                });

                const subject = testApp.request(mockRequest).then(response => response.context.properties);

                return expect(subject).to.eventually.become(properties);
              });

              it('handles SecurityPanelController don\'t have properties', () => {
                testApp.securityPanelController((req, res) => {
                  res.alexaResponse();
                });

                const subject = testApp.request(mockRequest).then(response => response.event.header.name);

                return expect(subject).to.eventually.become('Response');
              });

              it('responds with expected message for promise', () => {
                testApp.securityPanelController((req, res) => Promise.resolve().then(() => {
                  res.alexaResponse(properties);
                }));

                const subject = testApp.request(mockRequest).then(response => response.context.properties);

                return expect(subject).to.eventually.become(properties);
              });

              it('handles error for promise', () => {
                testApp.securityPanelController((req, res) => Promise.reject(new Error('promise failure')));

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
