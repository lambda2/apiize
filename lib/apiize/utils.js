let _ = require('lodash');

let utils = {
  stringToSlug: function (string) {
    return _.kebabCase(string);
  }
};

export default utils;
