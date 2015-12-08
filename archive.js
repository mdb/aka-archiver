#! /usr/bin/env node

var Archiver = require('./archiver'),
    env = process.env;
    archiver = new Archiver({
      clientToken: env.AKAMAI_EDGEGRID_CLIENT_TOKEN,
      clientSecret: env.AKAMAI_EDGEGRID_CLIENT_SECRET,
      accessToken: env.AKAMAI_EDGEGRID_ACCESS_TOKEN,
      edgegridHost: env.AKAMAI_EDGEGRID_HOST
    });

archiver[process.argv[2]](process.argv[3])
  .then(function() {
    console.log('\naka-archive ' + process.argv[2] + ' complete');
   });
