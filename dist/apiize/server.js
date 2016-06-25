'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('colors');
var morgan = require('morgan');
var express = require('express');
var app = express();
var expressRouter = express.Router;
var responseTime = require('response-time');

var Server = (function () {

  // Create a new Express server

  function Server(apiize) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Server);

    var defaults = {
      port: 1313,
      prefix: 'api'
    };

    this.apiize = apiize;
    this.params = Object.assign(defaults, params);
    app.use(responseTime());

    // Set json header
    app.use(function (req, res, next) {
      res.header('Content-Type', 'application/json');
      next();
    });

    console.log(this.apiize.params.verbose);
    app.use(morgan(this.apiize.params.verbose ? 'combined' : 'tiny'));

    this.server = false;
    this.routes = this.apiize.routes();

    // Mount routes
    app.use('/api', this.router());
    app.use(this.index());
    app.use(function (req, res) {
      res.status(404).json({ error: 'Not found', message: 'Unable to find route to ' + req.path });
    });
  }

  // Handle root path

  _createClass(Server, [{
    key: 'index',
    value: function index() {
      var _this = this;

      var router = expressRouter();

      router.get('/', function (req, res) {
        res.format({

          'text/html': function textHtml() {
            // The client requested an html page
            res.send('\n            <p>This api only respond to json, please try to request this endpoint with <code>application/json</code> Content Type.</p>\n          ');
          },
          'default': function _default() {
            // Will print the index ouf available routes
            res.json(_this.jsonIndex(_this.routes));
          }
        });
      });

      // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var route = _step.value;

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

    // Create index ouf routes on the root path
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
      return this.indexCache;
    }

    // Create routes
  }, {
    key: 'router',
    value: function router() {
      var router = expressRouter();
      // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.routes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var route = _step2.value;

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

    // Stop the server
  }, {
    key: 'stop',
    value: function stop() {
      if (this.server) {
        this.server.close();
        this.server = false;
      }
    }

    // Say hello and print routes
  }, {
    key: 'hello',
    value: function hello() {
      console.log('\n  ___        _ _         \n / _ \\      (_|_)        \n/ /_\\ \\_ __  _ _ _______ \n|  _  | \'_ \\| | |_  / _ \\\n| | | | |_) | | |/ /  __/\n\\_| |_/ .__/|_|_/___\\___|\n      | |                \n      |_|                \n    '.rainbow);
      console.log('💫 ' + (' Express has taken the stage and is listening on port ' + this.params.port + '\n').green);
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.routes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var route = _step3.value;

          var info = route.info ? (' ' + route.info).grey : '';
          console.log('∙ '.green + ('GET /' + this.params.prefix + route.route) + info);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    // Start the server
  }, {
    key: 'listen',
    value: function listen() {
      this.server = app.listen(this.params.port);
      this.hello();
    }
  }]);

  return Server;
})();

exports['default'] = Server;
module.exports = exports['default'];