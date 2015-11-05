var EdgeGrid = require('edgegrid'),
    endpoints = require('./endpoints'),
    fs = require('fs');

function Archiver(config) {
  this.eg = new EdgeGrid(
    config.clientToken,
    config.clientSecret,
    config.accessToken,
    config.edgegridHost
  );

  this.domain = function(domain, callback) {
    this._archive('domain', domain, callback);
  };

  this.properties = function(domain, callback) {
    this._archive('properties', domain, callback);
  };

  this.dataCenters = function(domain, callback) {
    this._archive('dataCenters', domain, callback);
  };

  this.datacenters = function(domain, callback) {
    this.dataCenters(domain, callback);
  };

  this.all = function(domain) {
    this.domain(domain);
    this.properties(domain);
    this.dataCenters(domain);
  };

  this._authenticate = function(path) {
    this.eg.auth({
      'path': path,
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': {}
    });
  };

  this._fetch = function(path, callback) {
    this._authenticate(path);

    this.eg.send(function(data, response) {
      callback(data);
    });
  };

  this._archive = function(type, domain, callback) {
    var file = domain + '_' + type + '.json';

    this._fetch(endpoints[type](domain), function(data) {
      fs.writeFile(file, data, function(err) {
        if(err) {
          return console.log(err);
        }

        console.log('Archived ' + domain + ' ' + type + ' data in ' + file);

        if (callback) { callback(err); }
      });
    });
  };
}

module.exports = Archiver;
