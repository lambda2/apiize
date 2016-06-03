import assert from 'assert';
import Apify from '../lib';

describe('apify', function () {
  it('should be created', function () {
    let k = new Apify(function () {});
    assert(k !== undefined, 'should not be nil');
  });

  // it('should perform assertions', function () {

  //   let inputCallback = function (input, callback) {
  //     return callback(input + ', I\'m Andre the robot');
  //   };

  //   let k = new Apify(inputCallback);

  //   assert(k !== undefined, 'should not be nil');
  //   assert(k.params !== undefined, 'params should not be nil');
  //   assert(k.params.dataset !== undefined, 'default dataset should not be nil');
  // });

  // it('should manage errors', function () {

  //   let inputCallback = false;

  //   assert.throws(function () {
  //     new Apify(inputCallback, { dataset: 'i_do_not_exists'});
  //   }, /dataset/);

  //   assert.throws(function () {
  //     new Apify(inputCallback);
  //   }, /callback/);

  // });
});
