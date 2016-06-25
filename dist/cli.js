'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var program = require('commander');

var Apiize = require('./apiize');
var Info = require('../package.json');

// If we are called from the command line

exports['default'] = function () {
  program.version(Info.version).usage('[options] <file>').option('-p, --port <port>', 'Set the server port (default to 1313)', parseInt).option('-r, --root <root_key>', 'Get only data under the specified root key').option('-v, --verbose', 'Add additional logs').arguments('<file> [options]').action(function (cmd, env, o) {
    console.log('Action !', cmd, env, o.verbose);
    var apiize = new Apiize(cmd, o);
    apiize.on('ready', function (e) {
      e.serve();
    });
  }).parse(process.argv);

  if (process.argv.length === 2) {
    program.help();
  }
};

module.exports = exports['default'];