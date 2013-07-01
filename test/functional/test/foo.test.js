require('chai').should();

var foo = require('../src/foo');

describe('foo', function () {
  it('should punish the unfortunate', function () {
    foo(false).should.equal('You will fall into a hole');
  });
});
