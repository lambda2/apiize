'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');
var Type = require('type-of-is');

var _require = require('./utils');

var stringToSlug = _require.stringToSlug;

var pluralize = require('pluralize');
var isJSON = require('is-json');

var _require2 = require('get-content');

var get = _require2.get;

var Promise = require('promise');
var Server = require('./server');
var EventEmitter = require('events');

var Apiize = (function (_EventEmitter) {
  _inherits(Apiize, _EventEmitter);

  // Take the url or the file to apiize

  function Apiize(data) {
    var _this = this;

    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Apiize);

    _get(Object.getPrototypeOf(Apiize.prototype), 'constructor', this).call(this);

    var defaults = { verbose: false };
    this.params = Object.assign(defaults, params);
    this.server = undefined;

    if (typeof data !== 'string') {
      throw 'The provided file or url must be a string (got ' + typeof data + ')';
    }
    this.dataToJson(data).then(function (response) {
      _this.rawData = response;
      _this.generate();
      _this.emit('ready', _this);
    })['catch'](function () {
      console.warn('The ' + data + ' content is not parsable.');
      throw new Error('The ' + data + ' content is not parsable.');
    });
  }

  _createClass(Apiize, [{
    key: 'dataToJson',
    value: function dataToJson(data) {
      return new Promise(function (accept, reject) {
        get(data).then(function (content) {
          if (isJSON(content)) {
            accept(JSON.parse(content));
          } else {
            reject(content);
          }
        })['catch'](function (e) {
          reject(e);
        });
      });
    }
  }, {
    key: 'generate',
    value: function generate() {
      var _this2 = this;

      // We collect all the available keys
      var values = {};
      var currentId = 1;

      // Manage root key
      if (this.params.root && this.rawData[0][this.params.root]) {
        this.rawData = _.map(this.rawData, function (e) {
          return Object.assign(e.id ? { id: e.id } : {}, e[_this2.params.root]);
        });
      }

      // Generate ids if needed
      _.each(this.rawData, function (e, i) {
        if (_.has(e, 'id') && Type.is(e.id, 'Integer')) {
          if (e.id > currentId) {
            currentId = e.id + 1;
          }
        } else {
          _this2.rawData[i].id = currentId;
          currentId++;
        }
      });

      _.each(this.rawData, function (e) {
        _.each(_.omit(e, ['id']), function (v, k) {
          if (!_.isEmpty(k)) {
            (function () {
              var arrayData = Type.is(v, 'Array') ? v : [v];
              var slug = stringToSlug(k);

              if (!_.has(values, slug)) {
                values[slug] = {};
              }

              _.each(arrayData, function (key) {
                if (!_.isEmpty(key)) {
                  var keySlug = stringToSlug(key);
                  values[slug][keySlug] = values[slug][keySlug] ? _.union(values[slug][keySlug], [e.id]) : [e.id];
                }
              });
            })();
          }
        });
      });
      this.data = values;
    }
  }, {
    key: 'indexCallbackForResource',
    value: function indexCallbackForResource(res, req, resource, values) {
      var response = _.map(values, function (val, key) {
        var _ref;

        return _ref = {}, _defineProperty(_ref, resource, key), _defineProperty(_ref, 'url', '/' + resource + '/' + key), _defineProperty(_ref, 'count', val.length), _ref;
      });
      res.json(response);
    }
  }, {
    key: 'showCallbackForResource',
    value: function showCallbackForResource(res, req, values, slug) {
      var _this3 = this;

      var ids = values[slug];
      var response = _.map(ids, function (e) {
        return _.find(_this3.rawData, { id: e });
      });
      res.json(response);
    }
  }, {
    key: 'randomCallbackForAll',
    value: function randomCallbackForAll(res) {
      res.json(_.sample(this.rawData));
    }
  }, {
    key: 'allCallbackForAll',
    value: function allCallbackForAll(res) {
      res.json(this.rawData);
    }
  }, {
    key: 'routes',
    value: function routes() {
      var _this4 = this;

      var resourceRoutes = _.flatten(_.map(this.data, function (v, k) {
        var indexRoute = '/' + pluralize(k);
        var showRoute = '/' + pluralize(k) + '/:id';
        return [{
          route: indexRoute,
          info: 'Return all the ' + pluralize(k),
          callback: function callback(req, res) {
            _this4.indexCallbackForResource(res, req, k, v);
          }
        }, {
          route: showRoute,
          info: 'Return the given ' + pluralize(k),
          callback: function callback(req, res) {
            _this4.showCallbackForResource(res, req, v, req.params.id);
          }
        }];
      }));

      var indexRoutes = [{
        route: '/',
        info: 'Return all items',
        callback: function callback(req, res) {
          _this4.allCallbackForAll(res, req);
        }
      }, {
        route: '/random',
        info: 'A random item',
        callback: function callback(req, res) {
          _this4.randomCallbackForAll(res, req);
        }
      }];
      return [].concat(_toConsumableArray(resourceRoutes), indexRoutes);
    }
  }, {
    key: 'serve',
    value: function serve() {
      this.server = new Server(this, this.params);
      this.server.listen();
    }
  }]);

  return Apiize;
})(EventEmitter);

exports['default'] = Apiize;
module.exports = exports['default'];