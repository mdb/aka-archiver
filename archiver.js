var EdgeGrid = require('edgegrid'),
    endpoints = require('./endpoints'),
    fs = require('fs'),
    eg = new EdgeGrid(
      process.env.AKAMAI_EDGEGRID_CLIENT_TOKEN,
      process.env.AKAMAI_EDGEGRID_CLIENT_SECRET,
      process.env.AKAMAI_EDGEGRID_ACCESS_TOKEN,
      process.env.AKAMAI_EDGEGRID_HOST
    );

function authenticate(path) {
  eg.auth({
    'path': path,
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json'
    },
    'body': {}
  });
}

function fetch(path, callback) {
  authenticate(path);

  eg.send(function(data, response) {
    callback(data);
  });
}

function archive(type, domain) {
  var file = domain + '_' + type + '.json';

  fetch(endpoints[type](domain), function(data) {
    fs.writeFile(file, data, function(err) {
      if(err) {
        return console.log(err);
      }

      console.log('Archived ' + domain + ' ' + type + ' data in ' + file);
    });
  });
}

module.exports = {
  domain: function(domain) {
    archive('domain', domain);
  },

  properties: function(domain) {
    archive('properties', domain);
  },

  dataCenters: function(domain) {
    archive('dataCenters', domain);
  },

  datacenters: function(domain) {
    this.dataCenters(domain);
  },

  all: function(domain) {
    this.domain(domain);
    this.properties(domain);
    this.dataCenters(domain);
  }
};
