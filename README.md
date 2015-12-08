[![Build Status](https://travis-ci.org/mdb/aka-archiver.svg?branch=master)](https://travis-ci.org/mdb/aka-archiver)

# aka-archiver

A Node-based CLI tool and NPM module that saves Akamai GTM configuration to local JSON files & git.

`aka-archiver` also offers Akamai GTM restoration functionality.

## Why?

Akamai provides no rollback functionality, version control, or backups of GTM domain, property, and data center configuration.

`aka-archiver` saves GTM configuration to JSON files. The JSON can be used to restore your Akamai GTM configuration should it disappear or be problematically modified.

## Installation

```
npm install -g aka-archiver
```

## Usage

`aka-archiver` can be used as an NPM module or as a CLI.

### Module usage

`aka-archiver`'s API leverages JavaScript promises.

#### Basic Usage, TL;DR

Back up all GTM configuration and commit/push the JSON configuration to a git repo:

```javascript
var Archiver = require('aka-archiver'),
    archiver = new Archiver({
      clientToken: 'yourClientToken',
      clientSecret: 'yourClientSecret',
      accessToken: 'yourAccessToken',
      edgegridHost: 'yourEdgegridHost'
    });

archiver.all()
  .then(archiver.archive)
  .then(function(msg) {
    console.log(msg);
  });
});
```

Note that this defaults to `origin`, `master`.

To declare a specific remote & branch:

```javascript
var Archiver = require('aka-archiver'),
    archiver = new Archiver({
      clientToken: 'yourClientToken',
      clientSecret: 'yourClientSecret',
      accessToken: 'yourAccessToken',
      edgegridHost: 'yourEdgegridHost',
      remote: 'your_remote',
      branch: 'your_branch'
    });
```

#### Full API

```javascript
var Archiver = require('aka-archiver'),
    archiver = new Archiver({
      clientToken: 'yourClientToken',
      clientSecret: 'yourClientSecret',
      accessToken: 'yourAccessToken',
      edgegridHost: 'yourEdgegridHost'
    });

archiver.all('yourdomain').then(function() {
  console.log('saved full GTM configuration to local JSON files!');
}, function(err) {
  // handle error
});

archiver.domain('yourdomain').then(function() {
  console.log('saved GTM domain configuration to local JSON file!');
}, function(err) {
  // handle error
});

archiver.properties('yourdomain').then(function() {
  console.log('saved GTM properties configuration to local JSON file!');
}, function(err) {
  // handle error
});

archiver.dataCenters('yourdomain').then(function() {
  console.log('saved GTM data centers configuration to local JSON file!');
}, function(err) {
  // handle error
});

archiver.archive().then(function() {
  console.log('Pushed local GTM JSON backup to git repository!');
}, function(err) {
  // handle error
});

archiver.restore('yourdomain_domain.json').then(function() {
  console.log('Restored GTM configuration to that contained in yourdomain_domain.json');
}, function(err) {
  // handle error
});
```

### Commandline usage

Set the following environment variables the proper values based on your Akamai account:

```
AKAMAI_EDGEGRID_CLIENT_TOKEN
AKAMAI_EDGEGRID_CLIENT_SECRET
AKAMAI_EDGEGRID_ACCESS_TOKEN
AKAMAI_EDGEGRID_HOST
```

Save all the GTM configuration:

```
aka-archive all yourdomain.akadns.net
```

Result:

* `yourdomain.akadns.net_domain.json`
* `yourdomain.akadns.net_properties.json`
* `yourdomain.akadns.net_dataCenters.json`

Save only domain configuration:

```
aka-archive domain yourdomain.akadns.net
```

Save only properties configuration:

```
aka-archive properties yourdomain.akadns.net
```

Save only data centers configuration:

```
aka-archive dataCenters yourdomain.akadns.net
```

Archive the saved JSON files by committing/pushing any changes to a git repo; this assumes the
command is executed from within a git repo and that the *.json files are already in the git repo:

```
aka-archive archive
```

Restore a GTM configuration, given a `yourdomain.akadns.net_domain.json` GTM domain backup:

```
aka-archive restore yourdomain.akadns.net_domain.json
```
