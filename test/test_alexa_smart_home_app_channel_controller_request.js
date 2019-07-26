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
        const mockRequest = mockHelper.load('sample_messages/ChannelController/ChannelController.ChangeChannel.request.json');

        context('with a request of Channel Controller', () => {
          context('with no Channel Controller handler', () => {
            describe('output ErrorResponse', () => {
              it('responds with ErrorResponse message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.type);

                return expect(subject).to.eventually.become('INTERNAL_ERROR');
              });
            });
          });

          context('with a matching Channel handler', () => {
            const expectedChannel = [
              {
                namespace: 'Alexa.ChannelController',
                name: 'channel',
                value: {
                  number: '1234',
                  callSign: 'callsign1',
                  affiliateCallSign: 'callsign2',
                },
                timeOfSample: '2017-09-27T18:30:30.45Z',
                uncertaintyInMilliseconds: 200,
              },
              {
                namespace: 'Alexa.EndpointHealth',
                name: 'connectivity',
                value: {
                  value: 'OK',
                },
                timeOfSample: '2017-09-27T18:30:30.45Z',
                uncertaintyInMilliseconds: 200,
              },
            ];

            describe('output channel controller', () => {
              it('handles channel correctly', () => {
                testApp.channelController((req, res) => {
                  res.alexaResponse(expectedChannel);
                });

                const subject = testApp.request(mockRequest).then(response => response.context.properties);

                return expect(subject).to.eventually.become(expectedChannel);
              });

              it('responds with expected message for promise', () => {
                testApp.channelController((req, res) => Promise.resolve().then(() => {
                  res.alexaResponse(expectedChannel);
                }));

                const subject = testApp.request(mockRequest).then(response => response.context.properties);

                return expect(subject).to.eventually.become(expectedChannel);
              });

              it('handles error for promise', () => {
                testApp.channelController((req, res) => Promise.reject(new Error('promise failure')));

                const subject = testApp.request(mockRequest);

                return expect(subject).to.be.rejectedWith('promise failure');
              });
            });

            describe('output channel controller', () => {
              it('handles channel correctly', () => {
                testApp.channelController((req, res) => {
                  res.alexaResponse();
                });

                const subject = testApp.request(mockRequest).then(response => response.context);

                return expect(subject).to.eventually.become();
              });

              it('responds with expected message for promise', () => {
                testApp.channelController((req, res) => Promise.resolve().then(() => {
                  res.alexaResponse();
                }));

                const subject = testApp.request(mockRequest).then(response => response.context);

                return expect(subject).to.eventually.become();
              });

              it('handles error for promise', () => {
                testApp.channelController((req, res) => Promise.reject(new Error('promise failure')));

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
