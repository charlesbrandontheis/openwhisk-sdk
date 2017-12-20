const assert = require('assert');
const nock = require('nock');
const extend = require('extend');
const omit = require('object.omit');
const openwhisk = require('openwhisk');
const auth = require('../../resources/auth');
const { adapt, negativeHandler } = require('../../resources/test-helper');
let listClassifiers = require('../../../actions/natural-language-classifier-v1/list-classifiers');

let ow;
let credentials;
let payload = {};

before(() => {
  if (process.env.TEST_OPENWHISK) {
    ow = openwhisk(auth.ow);
    listClassifiers = adapt(
      listClassifiers,
      'natural-language-classifier-v1/list-classifiers',
      ow
    );
    credentials = auth.natural_language_classifier;
  } else {
    credentials = {
      username: 'username',
      password: 'password'
    };
    beforeEach(() => {
      nock('https://gateway.watsonplatform.net/natural-language-classifier')
        .get('/api/v1/classifiers')
        .reply(200, {});
    });
  }
  payload = extend({}, payload, credentials);
});

describe('list-classifiers', () => {
  it('should fail if credentials are missing', () => {
    const params = omit(payload, ['username', 'password']);
    return listClassifiers
      .test(params)
      .then(() => {
        assert.fail('No failure on missing credentials');
      })
      .catch(err => negativeHandler(err));
  });
  it('should generate a valid payload', () => {
    const params = payload;
    return listClassifiers
      .test(params)
      .then(() => {
        assert.ok(true);
      })
      .catch(() => {
        assert.fail('Failure on valid payload');
      });
  });
});
