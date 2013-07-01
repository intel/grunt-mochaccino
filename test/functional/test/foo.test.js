require('chai').should();

var bar = require('../src/bar');

describe('bar', function () {
  it('should tell a joke', function () {
    bar(true).should.equal('Man walks into a bar...');
  });

  it('should be serious when required', function () {
    bar().should.equal('This is a serious business');
  });
})
