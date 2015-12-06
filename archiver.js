var EdgeGrid = require('edgegrid'),
    fs = require('fs'),
    endpoints = require('./endpoints'),
    Promise = require('promise'),
    Git = require('./git');

function Archiver(config) {
  var git = new Git(config);

  this.eg = new EdgeGrid(
    config.clientToken,
    config.clientSecret,
    config.accessToken,
    config.edgegridHost
  );

  this.domain = function(domain) {
    return this._savePromise('domain', domain);
  };

  this.properties = function(domain) {
    return this._savePromise('properties', domain);
  };

  this.dataCenters = function(domain) {
    return this._savePromise('dataCenters', domain);
  };

  this.datacenters = function(domain) {
    return this.dataCenters(domain);
  };

  this.all = function(domain) {
    var success = function() { return true; },
        domainBack = this.domain(domain).then(success),
        propsBack = this.properties(domain).then(success),
        dcsBack = this.dataCenters(domain).then(success);

    return new Promise(function(resolve, reject) {
      Promise.all([domainBack, propsBack, dcsBack]).then(function() {
        resolve('Saved full Akamai GTM');
      });
    });
  };

  this.restore = function(domainJsonFile) {
    return new Promise(function(resolve, reject) {
      this._restore(domainJsonFile, function(err, data) {
        if (err) { reject(err); }

        resolve(data);
      });
    }.bind(this));
  };

  this.archive = function() {
    return new Promise(function(resolve, reject) {
      git.modifications().then(function(mods) {
        if (!mods || !mods.length) {
          resolve('No changes to archive');
          return;
        }

        git.add(mods)
          .then(git.commit)
          .then(git.push)
            .then(function(data) {
              resolve('Archived changes');
            }, function(err) {
              console.log(err);
            });
      });
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
        if (err && callback) { callback(err, undefined); }

        console.log('Saved ' + domain + ' ' + type + ' data to ' + file);

        if (callback) { callback(undefined, data); }
      });
    });
  };

  this._savePromise = function(type, domain) {
    return new Promise(function(resolve, reject) {
      this._save(type, domain, function(err, data) {
        if (err) { reject(err); }

        resolve(data);
      });
    }.bind(this));
  };
}

module.exports = Archiver;
