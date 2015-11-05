var Archiver = require('../archiver'),
    archiver = new Archiver({
      clientToken: 'clientToken',
      clientSecret: 'clientSecret',
      accessToken: 'accessToken',
      edgegridHost: 'https://host.com'
    }),
    fs = require('fs'),
    assert = require('assert'),
    request = require('supertest'),
    nock = require('nock'),
    mockGet = function(path, resp) {
      return nock('https://host.com')
        .get(path)
        .reply(200, resp);
    };

describe('archiver', function() {
  var result;

  afterEach(function() {
    fs.unlinkSync(result);
  });

  describe('#domain', function() {
    it('performs a request to the proper domain endpoint and archives its response', function(done) {
      result = 'someDomain_domain.json';

      mockGet('/config-gtm/v1/domains/someDomain', 'domains');

      archiver.domain('someDomain', function(err) {
        assert.equal(fs.readFileSync(result), 'domains');

        done();
      });
    });
  });

  describe('#properties', function() {
    it('performs a request to the proper properties endpoint and archives its response', function(done) {
      result = 'someDomain_properties.json';

      mockGet('/config-gtm/v1/domains/someDomain/properties', 'properties');

      archiver.properties('someDomain', function(err) {
        assert.equal(fs.readFileSync(result), 'properties');

        done();
      });
    });
  });

  describe('#dataCenters', function() {
    it('performs a request to the proper data centers endpoint and archives its response', function(done) {
      result = 'someDomain_dataCenters.json';

      mockGet('/config-gtm/v1/domains/someDomain/datacenters', 'dataCenters');

      archiver.dataCenters('someDomain', function(err) {
        assert.equal(fs.readFileSync(result), 'dataCenters');

        done();
      });
    });
  });

  describe('#datacenters', function() {
    it('performs a request to the proper data centers endpoint and archives its response', function(done) {
      result = 'someDomain_dataCenters.json';

      mockGet('/config-gtm/v1/domains/someDomain/datacenters', 'dataCenters');

      archiver.datacenters('someDomain', function(err) {
        assert.equal(fs.readFileSync(result), 'dataCenters');

        done();
      });
    });
  });
});
