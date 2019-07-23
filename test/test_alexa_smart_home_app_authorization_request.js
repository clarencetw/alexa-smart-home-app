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
        const mockRequest = mockHelper.load('sample_messages/Authorization/Authorization.AcceptGrant.request.json');

        context('with a request of Authorization', () => {
          context('with no Authorization handler', () => {
            describe('output ErrorResponse', () => {
              it('responds with ErrorResponse message', () => {
                const subject = testApp.request(mockRequest).then(response => response.event.payload.type);

                return expect(subject).to.eventually.become('INTERNAL_ERROR');
              });
            });
          });

          context('with a matching authorization handler', () => {
            const name = 'AcceptGrant.Response';

            describe('output stream controller', () => {
              it('handles reprompting correctly', () => {
                testApp.authorization((req, res) => {
                  res.authorization();
                });

                const subject = testApp.request(mockRequest).then(response => response.event.header.name);

                return expect(subject).to.eventually.become(name);
              });

              it('responds with expected message for promise', () => {
                testApp.authorization((req, res) => Promise.resolve().then(() => {
                  res.authorization();
                }));

                const subject = testApp.request(mockRequest).then(response => response.event.header.name);

                return expect(subject).to.eventually.become(name);
              });

              it('handles error for promise', () => {
                testApp.authorization((req, res) => Promise.reject(new Error('promise failure')));

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
