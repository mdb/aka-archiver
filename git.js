var git = require('simple-git'),
    path = require('path'),
    repo = git(path.resolve());

function Git(conf) {
  var config = {
    remote: conf && conf.remote ? conf.remote : 'origin',
    branch: conf && conf.branch ? conf.branch : 'master'
  };

  this.modifications = function(callback) {
    return new Promise(function(resolve, reject) {
      repo.status(function(err, status) {
        if (err) { reject(err); }

        resolve(status.modified);
      });
    });
  };

  this.add = function(files) {
    return new Promise(function(resolve, reject) {
      repo.add(files, function(err, success) {
        if (!files) { resolve('Nothing to add'); }
        if (err) { reject(err); }

        resolve(success);
      });
    });
  };

  this.commit = function() {
    return new Promise(function(resolve, reject) {
      repo.commit('Archiving changes', function(err, success) {
        if (err) { reject(err); }

        resolve(success);
      });
    });
  };

  this.push = function() {
    return new Promise(function(resolve, reject) {
      console.log('Pushing changes to ' + config.remote + ', ' + config.branch);
      repo.push(config.remote, config.branch, function(err, success) {
        if (err) { reject(err); }

        resolve(success);
      });
    });
  };
}

module.exports = Git;
