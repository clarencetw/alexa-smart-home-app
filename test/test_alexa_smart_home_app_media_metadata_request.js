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
        const mockRequest = mockHelper.load('sample_messages/MediaMetadata/MediaMetadata.GetMediaMetadata.request.json');

        context('with a request of MediaMetadata', () => {
          context('with no camera mediametadata handler', () => {
            describe('output ErrorResponse', () => {
              it('responds with ErrorResponse message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.type);

                return expect(subject).to.eventually.become('INTERNAL_ERROR');
              });
            });
          });

          context('with a matching mediametadata handler', () => {
            const expectedMediametadata = {
              id: 'media Id from the request',
              cause: 'cause of media creation',
              recording: {
                name: 'Optional video name',
                startTime: '2018-06-29T19:20:41Z',
                endTime: '2018-06-29T19:21:41Z',
                videoCodec: 'H264',
                audioCodec: 'AAC',
                uri: {
                  value: 'https://somedomain/somevideo.mp4',
                  expireTime: '2018-06-29T19:31:41Z',
                },
                thumbnailUri: {
                  value: 'https://somedomain/someimage.png',
                  expireTime: '2018-06-29T19:31:41Z',
                },
              },
            };
            describe('output mediametadata', () => {
              it('handles reprompting correctly', () => {
                testApp.mediametadata((req, res) => {
                  res.mediametadata(expectedMediametadata);
                });

                const subject = testApp.request(mockRequest).then(response => response.event.payload.media);

                return expect(subject).to.eventually.become([expectedMediametadata]);
              });

              it('combines multiple mediametadata', () => {
                testApp.mediametadata((req, res) => {
                  res.mediametadata(expectedMediametadata)
                    .mediametadata(expectedMediametadata);
                });

                const subject = testApp.request(mockRequest).then(response => response.event.payload.media);

                return expect(subject).to.eventually.become([expectedMediametadata, expectedMediametadata]);
              });

              it('responds with expected message for promise', () => {
                testApp.mediametadata((req, res) => Promise.resolve().then(() => {
                  res.mediametadata(expectedMediametadata);
                }));

                const subject = testApp.request(mockRequest).then(response => response.event.payload.media);

                return expect(subject).to.eventually.become([expectedMediametadata]);
              });

              it('handles error for promise', () => {
                testApp.mediametadata((req, res) => Promise.reject(new Error('promise failure')));

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
