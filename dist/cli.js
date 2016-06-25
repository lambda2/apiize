#!/usr/bin/env node

'use strict';

var program = require('commander');

var Apiize = require('./apiize');
var Info = require('../package.json');

// If we are called from the command line
if (require.main === module) {
  program.version(Info.version).usage('[options] <file>').option('-p, --port <port>', 'Set the server port (default to 1313)', parseInt).option('-r, --root <root_key>', 'Get only data under the specified root key').option('-v, --verbose', 'Add additional logs').option('-c, --cache', 'Enable static caching').arguments('<file> [options]').action(function (cmd, env, o) {
    // console.log('Action !', cmd, env, o);
    var apiize = new Apiize(cmd, o);
    apiize.on('ready', function (e) {
      e.serve();
    });
  }).parse(process.argv);
}