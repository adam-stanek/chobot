'use strict';
const expect = require('chai').expect;
const regExpFilter = require('../../src/utils/regExpFilter.js');

describe('utils/regExpFilter()', function () {
  var filter = regExpFilter(/[abcd]+/);

  it('works when called on a string', function () {
    expect(
      filter('abcd')
    ).to.be.deep.equal({
      matchedString: 'abcd',
      value: 'abcd'
    });
  });

  it('works when called on a previous match', function () {
    expect(
      filter({ matchedString: 'abcdefgh', value: 'abcdefgh' })
    ).to.be.deep.equal({
      matchedString: 'abcd',
      value: 'abcd'
    });
  });
});
