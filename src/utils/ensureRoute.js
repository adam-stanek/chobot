'use strict';

// We don't really want to require whole React just for type check.
// This is how React itself determines ReactElement.
const REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

/**
 * Ensures given obj. is a Route instance. If it is a ReactElement it is converted.
 * @param  {Route|ReactElement}  matchingNode
 * @param  {Route} Route
 * @return {Route}
 * @throws Will throw an error if argument cannot be converted into Route.
 */
function ensureRoute(Route, obj) {
  if(obj instanceof Route)
    return obj;

  if(obj.$$typeof === REACT_ELEMENT_TYPE) {
    var props = {};
    for(var k in obj.props) {
      if(k !== 'children')
        props[k] = obj.props[k];
    }

    var children = obj.props.children ? (Array.isArray(obj.props.children)
      ? obj.props.children
      : [ obj.props.children ]) : [];

    return new Route(props, children);
  }

  throw new Error('Received unexpected argument. Expected Route or ReactElement.');
}

module.exports = ensureRoute;
