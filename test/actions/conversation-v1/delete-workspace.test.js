const assert = require('assert');
const nock = require('nock');
const extend = require('extend');
const omit = require('object.omit');
const openwhisk = require('openwhisk');
const auth = require('../../resources/auth');
const { adapt, negativeHandler } = require('../../resources/test-helper');
const deleteWorkspace = require('../../../actions/conversation-v1/delete-workspace');

let ow;
let credentials;
let payload = {
  workspace_id: 'example_workspace_id'
};

before(() => {
  credentials = {
    username: 'username',
    password: 'password',
    version_date: 'version-date'
  };
  beforeEach(() => {
    nock('https://gateway.watsonplatform.net/conversation')
      .delete(`/api/v1/workspaces/${payload.workspace_id}`)
      .query({
        version: credentials.version_date
      })
      .reply(200, {});
  });
  payload = extend({}, payload, credentials);
});

describe('delete-workspace', () => {
  it('should fail if credentials are missing', () => {
    const params = omit(payload, ['username', 'password']);
    return deleteWorkspace
      .test(params)
      .then(() => {
        assert.fail('No failure on missing credentials');
      })
      .catch(err => negativeHandler(err));
  });
  it('should fail if version_date is missing', () => {
    const params = omit(payload, ['version_date']);
    return deleteWorkspace
      .test(params)
      .then(() => {
        assert.fail('No failure on missing version_date');
      })
      .catch(err => negativeHandler(err));
  });
  it('should generate a valid payload', () => {
    const params = payload;
    return deleteWorkspace
      .test(params)
      .then((res) => {
        assert.ok(true);
      })
      .catch(() => {
        assert.fail('Failure on valid payload');
      });
  });
});
