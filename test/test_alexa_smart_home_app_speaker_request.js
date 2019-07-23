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
        const mockRequest = mockHelper.load('sample_messages/Speaker/Speaker.SetVolume.request.json');

        context('with a request of Speaker', () => {
          context('with no Speaker handler', () => {
            describe('output ErrorResponse', () => {
              it('responds with ErrorResponse message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.type);

                return expect(subject).to.eventually.become('INTERNAL_ERROR');
              });
            });
          });

          context('with a matching Speaker handler', () => {
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

            describe('output speaker controller', () => {
              it('handles speaker correctly', () => {
                testApp.speaker((req, res) => {
                  res.speaker(expectedSpeaker);
                });

                const subject = testApp.request(mockRequest).then(response => response.context.properties);

                return expect(subject).to.eventually.become(expectedSpeaker);
              });

              it('responds with expected message for promise', () => {
                testApp.speaker((req, res) => Promise.resolve().then(() => {
                  res.speaker(expectedSpeaker);
                }));

                const subject = testApp.request(mockRequest).then(response => response.context.properties);

                return expect(subject).to.eventually.become(expectedSpeaker);
              });

              it('handles error for promise', () => {
                testApp.speaker((req, res) => Promise.reject(new Error('promise failure')));

                const subject = testApp.request(mockRequest);

                return expect(subject).to.be.rejectedWith('promise failure');
              });
            });

            describe('output speaker controller', () => {
              it('handles speaker correctly', () => {
                testApp.speaker((req, res) => {
                  res.speaker();
                });

                const subject = testApp.request(mockRequest).then(response => response.context);

                return expect(subject).to.eventually.become();
              });

              it('responds with expected message for promise', () => {
                testApp.speaker((req, res) => Promise.resolve().then(() => {
                  res.speaker();
                }));

                const subject = testApp.request(mockRequest).then(response => response.context);

                return expect(subject).to.eventually.become();
              });

              it('handles error for promise', () => {
                testApp.speaker((req, res) => Promise.reject(new Error('promise failure')));

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
