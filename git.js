var git = require('simple-git'),
    path = require('path'),
    repo = git(path.resolve());

module.exports = {
  modifications: function(callback) {
    repo.status(function(err, status) {
      if (err) { callback(err, undefined); }

      callback(undefined, status.modified);
    });
  },

  add: function(files, callback) {
    repo.add(files, function(err, success) {
      if (err) { callback(err, undefined); }

      callback(undefined, success);
    });
  },

  commit: function(callback) {
    repo.commit('Archiving changes', function(err, success) {
      if (err) { callback(err, undefined); }

      callback(undefined, success);
    });
  },
};
