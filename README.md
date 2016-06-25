# apiize [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> A testing tool for bots interactions

**Turn any json file into a full, explorable, REST API.**

## Install

```sh
$ npm install -g apiize
```


## Command line usage

- Start a new server on a given JSON file or url

```bash
$ apiize ./test/datasets/punchlines.json

  ___        _ _
 / _ \      (_|_)
/ /_\ \_ __  _ _ _______
|  _  | '_ \| | |_  / _ \
| | | | |_) | | |/ /  __/
\_| |_/ .__/|_|_/___\___|
      | |
      |_|

💫  Express has taken the stage and is listening on port 1313

∙ GET /api/contents Return all the contents
∙ GET /api/contents/:id Return the given contents
∙ GET /api/tags Return all the tags
∙ GET /api/tags/:id Return the given tags
∙ GET /api/authors Return all the authors
∙ GET /api/authors/:id Return the given authors
∙ GET /api/albums Return all the albums
∙ GET /api/albums/:id Return the given albums
∙ GET /api/titles Return all the titles
∙ GET /api/titles/:id Return the given titles
∙ GET /api/ Return all items
∙ GET /api/random A random item

```

- Make requests on it

```bash
$ curl -H "Accept: application/json" "localhost:1313/"

{"endpoints":[{"url":"/api/contents","description":"Return all the contents"},{"url":"/api/contents/:id","description":"Return the given contents"},{"url":"/api/tags","description":"Return all the tags"},{"url":"/api/tags/:id","description":"Return the given tags"},{"url":"/api/authors","description":"Return all the authors"},{"url":"/api/authors/:id","description":"Return the given authors"},{"url":"/api/albums","description":"Return all the albums"},{"url":"/api/albums/:id","description":"Return the given albums"},{"url":"/api/titles","description":"Return all the titles"},{"url":"/api/titles/:id","description":"Return the given titles"},{"url":"/api/","description":"Return all items"},{"url":"/api/random","description":"A random item"}]}%
```

## Usage

```js
const Apiize = require('apiize');

// Here is the default options
const options = {
  verbose: false, // Output more verbose requests
  prefix: 'api', // The root endpoint of the API
  port: 1313 // The express server port.
};

// Turn the 'http://example.org/file.json' file into an API
let apiize = new Apiize('http://example.org/file.json', options);

// When apiize is ready
apiize.on('ready', function (server) {
  server.serve(); // run the server
});

```

## API

```js
var Apiize = require('apiize');

var api = new Apiize(link, options);
```

------------------

### Events

#### ready

Triggered when the file or the link is fully loaded, and the express server is ready to be started.

```js
var api = new Apiize(link, options);
api.on('ready', function (server) {
  server.serve(); // run the server
});

```


------------------

### Methods

#### new Apiize(link, options)

Create a new Apiize object using the given `link` and `options`.
The `link` argument must be a string of a JSON file or a JSON URL.

> Apiize accepts these properties in the options object.

- verbose

  > Defaults to `false`, add a more verbose logging of incoming requests.

  - Without `verbose`:
  `GET / 200 146 - 6.079 ms`

  - With `verbose`:
  `::1 - - [25/Jun/2016:15:41:06 +0000] "GET / HTTP/1.1" 200 750 "-" "curl/7.43.0"`

- prefix

  > Set the root path of the generated api routes. Defaults to `api`.

- port

  > Set the express server port. Defaults to `1313`.

#### on(event, callback)

Triggered when an event is emmmited (e.g., the `ready` event).

#### serve

Start the express server. Must be called when the `ready` event is called.


------------------

## License

MIT © [Andre Aubin](http://andral.kiwi)


[npm-image]: https://badge.fury.io/js/apiize.svg
[npm-url]: https://npmjs.org/package/apiize
[travis-image]: https://travis-ci.org/lambda2/apiize.svg?branch=master
[travis-url]: https://travis-ci.org/lambda2/apiize
[daviddm-image]: https://david-dm.org/lambda2/apiize.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/lambda2/apiize
[coveralls-image]: https://coveralls.io/repos/github/lambda2/apiize/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/lambda2/apiize?branch=master
