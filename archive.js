#! /usr/bin/env node

var archiver = require('./archiver');

archiver[process.argv[2]](process.argv[3]);
