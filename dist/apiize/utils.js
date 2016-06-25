'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _ = require('lodash');

var utils = {
  stringToSlug: function stringToSlug(string) {
    return _.kebabCase(string);
  }
};

exports['default'] = utils;
module.exports = exports['default'];