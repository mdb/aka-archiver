var git = require('simple-git'),
    path = require('path'),
    repo = git(path.resolve());

module.exports = {
  modifications: function(callback) {
    return new Promise(function(resolve, reject) {
      repo.status(function(err, status) {
        if (err) { reject(err); }

        resolve(status.modified);
      });
    });
  },

  add: function(files) {
    return new Promise(function(resolve, reject) {
      repo.add(files, function(err, success) {
        if (err) { reject(err); }

        resolve(success);
      });
    });
  },

  commit: function() {
    return new Promise(function(resolve, reject) {
      repo.commit('Archiving changes', function(err, success) {
        if (err) { reject(err); }

        resolve(success);
      });
    });
  },

  push: function(remote, branch) {
    return new Promise(function(resolve, reject) {
      repo.push(remote, branch, function(err, success) {
        if (err) { reject(err); }

        resolve(success);
      });
    });
  }
};
