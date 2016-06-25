'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var express = require('express');
var app = express();
var expressRouter = express.Router;
var responseTime = require('response-time');

var Server = (function () {
  function Server(apiize) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Server);

    var defaults = {
      port: 1313,
      cache: true,
      prefix: 'api'
    };

    this.apiize = apiize;
    this.params = Object.assign(defaults, params);
    app.use(responseTime());

    app.use(function (req, res, next) {
      res.header('Content-Type', 'application/json');
      next();
    });

    // enable static caching
    if (this.params.cache) {}
    // app.use('/api', express.static('.cache', {extensions: ['json'], redirect: false}));

    // Mount routes
    app.use('/api', this.router());
    app.use(this.index());
    app.use(function (req, res) {
      res.status(404).json({ error: 'Not found', message: 'Unable to find route to ' + req.path });
    });
  }

  _createClass(Server, [{
    key: 'index',
    value: function index() {
      var _this = this;

      var router = expressRouter();
      var routes = this.apiize.routes();

      router.get('/', function (req, res) {
        res.format({

          'text/html': function textHtml() {
            res.send('\n            <p>This api only respond to json, please try to request this endpoint with <code>application/json</code> Content Type.</p>\n          ');
          },
          'default': function _default() {
            console.log("default");
            res.json(_this.jsonIndex(routes));
          }
        });
      });

      // console.log("routes :", routes);
      // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var route = _step.value;

          // console.log("Adding route", route.route, route);
          router.get(route.route, route.callback);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return router;
    }
  }, {
    key: 'jsonIndex',
    value: function jsonIndex(routes) {
      var _this2 = this;

      if (!this.indexCache) {
        this.indexCache = {
          endpoints: routes.map(function (r) {
            return { url: '/' + _this2.params.prefix + r.route, description: r.info };
          })
        };
      }
      // console.log("Reoutes: ", this.indexCache);
      return this.indexCache;
    }
  }, {
    key: 'router',
    value: function router() {
      var router = expressRouter();
      var routes = this.apiize.routes();
      // console.log("routes :", routes);
      // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = routes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var route = _step2.value;

          // console.log("Adding route", route.route, route);
          router.get(route.route, route.callback);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return router;
    }
  }, {
    key: 'listen',
    value: function listen() {
      app.listen(this.params.port);
    }
  }]);

  return Server;
})();

exports['default'] = Server;
module.exports = exports['default'];