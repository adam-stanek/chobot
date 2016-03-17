'use strict';

function regExpFilter(rx) {
  return (value) => {
    let str = typeof value === 'object' && value ? value.value : value;
    let m = rx.exec(str);
    if(m && str.indexOf(m[0]) === 0)
      return { matchedString: m[0], value: decodeURIComponent(m[0]) };

    return null;
  }
}

module.exports = regExpFilter;
