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
    },
    mockPut = function(path, data, resp) {
      return nock('https://host.com')
        .put(path, data)
        .reply(200, resp);
    };

describe('archiver', function() {
  var result;

  describe('backup functionality', function() {
    afterEach(function() {
      fs.unlinkSync(result);
    });

    describe('#domain', function() {
      it('performs a request to the proper domain endpoint and archives its response', function(done) {
        result = 'someDomain_domain.json';

        mockGet('/config-gtm/v1/domains/someDomain', 'domains');

        archiver.domain('someDomain')
          .then(function() {
            assert.equal(fs.readFileSync(result), 'domains');

            done();
          });
      });
    });

    describe('#properties', function() {
      it('performs a request to the proper properties endpoint and archives its response', function(done) {
        result = 'someDomain_properties.json';

        mockGet('/config-gtm/v1/domains/someDomain/properties', 'properties');

        archiver.properties('someDomain')
          .then(function() {
            assert.equal(fs.readFileSync(result), 'properties');

            done();
          });
      });
    });

    describe('#dataCenters', function() {
      it('performs a request to the proper data centers endpoint and archives its response', function(done) {
        result = 'someDomain_dataCenters.json';

        mockGet('/config-gtm/v1/domains/someDomain/datacenters', 'dataCenters');

        archiver.dataCenters('someDomain')
          .then(function() {
            assert.equal(fs.readFileSync(result), 'dataCenters');

            done();
          });
      });
    });

    describe('#datacenters', function() {
      it('performs a request to the proper data centers endpoint and archives its response', function(done) {
        result = 'someDomain_dataCenters.json';

        mockGet('/config-gtm/v1/domains/someDomain/datacenters', 'dataCenters');

        archiver.datacenters('someDomain')
          .then(function() {
            assert.equal(fs.readFileSync(result), 'dataCenters');

            done();
          });
      });
    });

    describe('#all', function() {
      beforeEach(function() {
        mockGet('/config-gtm/v1/domains/someDomain', 'domain');
        mockGet('/config-gtm/v1/domains/someDomain/properties', 'properties');
        mockGet('/config-gtm/v1/domains/someDomain/datacenters', 'dataCenters');
      });

      it('performs a request to the proper domains endpoint and archives its response', function(done) {
        result = 'someDomain_domain.json';

        archiver.all('someDomain')
          .then(function() {
            assert.equal(fs.readFileSync(result), 'domain');

            done();
          });
      });

      it('performs a request to the proper domains endpoint and archives its response', function(done) {
        result = 'someDomain_properties.json';

        archiver.all('someDomain')
          .then(function(err) {
            assert.equal(fs.readFileSync(result), 'properties');

            done();
          });
      });

      it('performs a request to the proper data centers endpoint and archives its response', function(done) {
        result = 'someDomain_dataCenters.json';

        archiver.all('someDomain')
          .then(function(err) {
            assert.equal(fs.readFileSync(result), 'dataCenters');

            done();
          });
      });
    });
  });

  describe('restoration functionality', function() {
    describe('#restore', function() {
      it('performs a PUT request to the proper domain endpoint with the data it is passed', function(done) {
        var result = 'someDomain_domain.json';

        fs.writeFileSync(result, 'fakeData');
        mockPut('/config-gtm/v1/domains/someDomain', 'fakeData', 'fakeResp');

        archiver.restore('someDomain_domain.json')
          .then(function(data) {
            assert.equal(data, 'fakeResp');

            fs.unlinkSync(result);

            done();
          });
      });
    });
  });
});
