/* jshint expr: true */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const chaiString = require('chai-string');

chai.use(chaiString);
const expect = chai.expect;
chai.config.includeStack = true;
const mockHelper = require('./helpers/mock_helper');
const sinon = require('sinon');
const express = require('express');
const request = require('supertest');


describe('Alexa', () => {
  const Alexa = require('../index');

  describe('app', () => {
    let app;
    let testServer;
    let testApp;

    beforeEach(() => {
      app = express();
      testApp = new Alexa.app('testApp');
      testServer = app.listen(3000);
    });

    afterEach(() => {
      testServer.close();
    });

    context('#express fails when missing required field', () => {
      it('throws error on missing express app and express router', () => {
        try {
          testApp.express({});
        } catch (er) {
          return expect(er.message).to.eq('You must specify an express app or an express router to attach to.');
        }
      });
    });

    context('#express warns when redundant param is passed', () => {
      it("warns on given both params 'expressApp' and 'router'", () => {
        const bkp = console.warn.bind();
        console.warn = sinon.spy();
        testApp.express({
          expressApp: app,
          router: express.Router(),
        });
        const warning = "Usage deprecated: Both 'expressApp' and 'router' are specified.";
        expect(console.warn).to.have.been.calledWithExactly(warning);
        console.warn = bkp;
      });
    });

    context('#express with default options', () => {
      beforeEach(() => {
        testApp.express({
          expressApp: app,
        });
      });

      it('returns a response for a valid request', () => {
        const mockRequest = mockHelper.load('sample_messages/Discovery/Discovery.request.json');

        return request(testServer)
          .post('/testApp')
          .send(mockRequest)
          .expect(200)
          .then(response => expect(response.body.event.payload.endpoints).to.be.an('array').that.is.empty);
      });

      it('speaks an invalid request', () => request(testServer)
        .post('/testApp')
        .send({
          x: 1,
        })
        .expect(500)
        .then(response => expect(response.error.text).to.eq('Server Error')));

      it('fails with server error on bad request', () => {
        testApp.pre = function () {
          throw 'SOME ERROR';
        };
        return request(testServer)
          .post('/testApp')
          .send()
          .expect(500)
          .then(response => expect(response.error.text).to.eq('Server Error'));
      });
    });

    context('#express with pre and post functions', () => {
      const fired = {};
      const mockRequest = mockHelper.load('sample_messages/Discovery/Discovery.request.json');

      beforeEach(() => {
        testApp.express({
          expressApp: app,
          preRequest(json, request, response) {
            fired.preRequest = json;
          },
          postRequest(json, request, response) {
            fired.postRequest = json;
          },
        });
      });

      it('invokes pre and post functions', () => request(testServer)
        .post('/testApp')
        .send(mockRequest)
        .expect(200)
        .then(() => {
          expect(fired.preRequest).to.eql(mockRequest);
          expect(fired.postRequest.event.payload.endpoints).to.be.an('array').that.is.empty;
        }));
    });
  });
});
