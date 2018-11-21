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
        const mockRequest = mockHelper.load('sample_messages/StateReport/ReportState.json');

        context('with a request of StateReport', () => {
          context('with no StateReport handler', () => {
            describe('output ErrorResponse', () => {
              it('responds with ErrorResponse message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.type);

                return expect(subject).to.eventually.become('INTERNAL_ERROR');
              });
            });
          });

          context('with a matching StateReport handler', () => {
            const expectedSpeaker = [
              {
                namespace: 'Alexa.Speaker',
                name: 'volume',
                value: 50,
                timeOfSample: '2017-09-27T18:30:30.45Z',
                uncertaintyInMilliseconds: 200,
              },
              {
                namespace: 'Alexa.Speaker',
                name: 'muted',
                value: false,
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

            describe('output StateReport controller', () => {
              it('handles StateReport correctly', () => {
                testApp.alexa((req, res) => {
                  res.alexaResponse(expectedSpeaker);
                });

                const subject = testApp.request(mockRequest).then(response => response.context.properties);

                return expect(subject).to.eventually.become(expectedSpeaker);
              });

              it('responds with expected message for promise', () => {
                testApp.alexa((req, res) => Promise.resolve().then(() => {
                  res.alexaResponse(expectedSpeaker);
                }));

                const subject = testApp.request(mockRequest).then(response => response.context.properties);

                return expect(subject).to.eventually.become(expectedSpeaker);
              });

              it('handles error for promise', () => {
                testApp.alexa((req, res) => Promise.reject(new Error('promise failure')));

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
