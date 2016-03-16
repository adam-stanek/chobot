global.chai = require('chai');
global.expect = global.chai.expect;

global.JSX = {
  createElement: (tagName, props, ...children) => {
    if(typeof tagName !== 'function')
      throw new Error('Unexpected JSX element');

    return new tagName(props, children);
  }
}

require('@dobby/babel-register')();
