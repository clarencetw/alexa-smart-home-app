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
        const mockRequest = mockHelper.load('sample_messages/SceneController/SceneController.Activate.request.json');

        context('request without endpoint', () => {
          const expectedSceneController = 'Activate';

          describe('output stream controller have cause', () => {
            it('endpointId is endpoint-001', () => {
              testApp.sceneController((req, res) => {
                res.sceneController(expectedSceneController);
                const endpointObj = res.endpointObject;
                endpointObj.set('endpointId', 'endpoint-001');
              });

              const subject = testApp.request(mockRequest).then(response => response.event.endpoint.endpointId);

              return expect(subject).to.eventually.become('endpoint-001');
            });
          });
        });

        context('request have endpoint', () => {
          describe('output stream controller have cause', () => {
            it('endpointId is endpoint-001', () => {
              testApp.sceneController((req, res) => {
                const endpointObj = req.getEndpoint();

                return expect(endpointObj.isAvailable()).to.be.true;
              });

              const subject = testApp.request(mockRequest).then(response => response);
            });
          });
        });
      });
    });

    describe('#request', () => {
      describe('response', () => {
        const mockRequest = mockHelper.load('sample_messages/SceneController/SceneController.Activate.request.json');

        context('request without endpoint', () => {
          const expectedSceneController = 'Activate';

          describe('output stream controller have cause', () => {
            it('scope is object', () => {
              testApp.sceneController((req, res) => {
                res.sceneController(expectedSceneController);
                const endpointObj = res.endpointObject;
                endpointObj.set('scope', {
                  type: 'BearerToken',
                  token: 'access-token-from-Amazon',
                });
              });

              const subject = testApp.request(mockRequest).then(response => response.event.endpoint.scope);

              return expect(subject).to.eventually.become({
                type: 'BearerToken',
                token: 'access-token-from-Amazon',
              });
            });
          });
        });
      });
    });
  });
});
