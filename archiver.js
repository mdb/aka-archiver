var EdgeGrid = require('edgegrid'),
    fs = require('fs'),
    Promise = require('promise'),
    endpoints = require('./endpoints'),
    git = require('./git');

function Archiver(config) {
  this.eg = new EdgeGrid(
    config.clientToken,
    config.clientSecret,
    config.accessToken,
    config.edgegridHost
  );

  this.domain = function(domain, callback) {
    this._save('domain', domain, callback);
  };

  this.properties = function(domain, callback) {
    this._save('properties', domain, callback);
  };

  this.dataCenters = function(domain, callback) {
    this._save('dataCenters', domain, callback);
  };

  this.datacenters = function(domain, callback) {
    this.dataCenters(domain, callback);
  };

  this.restore = function(domainJsonFile, callback) {
    this._restore(domainJsonFile, callback);
  };

  this.all = function(domain) {
    this.domain(domain);
    this.properties(domain);
    this.dataCenters(domain);
  };

  this.archive = function() {
    git.modifications(function(err, mods) {
      if (err) { console.log(err); }

      if (mods) {
        git.add(mods, function(err, success) {
          if (err) { console.log(err); }

          git.commit(function(err, success) {
            if (err) { console.log(err); }

            console.log('Archived changes!');
          });
        });
      }
    });
  };

  this._authenticate = function(opts) {
    var options = {
      path: opts.path,
      method: opts.method || 'GET',
      body: opts.body || {},
    };

    this.eg.auth({
      path: options.path,
      method: options.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: options.body
    });
  };

  this._restore = function(jsonFile, callback) {
    var domain = jsonFile.split('_domain.json')[0];

    fs.readFile(jsonFile, 'utf8', function(err, data) {
      if (err && callback) {
        callback(err, undefined);
      }

      this._authenticate({
        path: endpoints.domain(domain),
        method: 'PUT',
        body: data
      });

      this.eg.send(function(data, response) {
        if (callback) {
          callback(undefined, data);
        }
      });
    }.bind(this));
  };

  this._fetch = function(path, callback) {
    this._authenticate({ path: path });

    this.eg.send(function(data, response) {
      callback(data);
    });
  };

  this._save = function(type, domain, callback) {
    var file = domain + '_' + type + '.json';

    this._fetch(endpoints[type](domain), function(data) {
      fs.writeFile(file, data, function(err) {
        if (err) { return console.log(err, undefined); }

        console.log('Archived ' + domain + ' ' + type + ' data in ' + file);

        if (callback) { callback(undefined, data); }
      });
    });
  };
}

module.exports = Archiver;
