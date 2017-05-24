// Zero-copy generator
function *routeWalk(routeStack) {
  var top, route;
  var fixedStackLength = routeStack.length;
  var indexStack = [ 1 ];
    
  yield routeStack;

  for(var i = 0; i < routeStack[fixedStackLength - 1].children.length; i++) {
    routeStack.push(routeStack[fixedStackLength - 1].children[i]);
    yield routeStack;

    indexStack.push(0);
    top = 1;

    while(top > 0) {
      route = routeStack[top + fixedStackLength - 1]
      if(route.children[indexStack[top]]) {
        routeStack.push(route.children[indexStack[top]]);
        yield routeStack;

        if(route.children[indexStack[top]].children.length > 0) {
          indexStack.push(0);
          indexStack[top]++;
          top++;
        } else {
          routeStack.pop();
          indexStack[top]++;
        }

      } else {
        routeStack.pop();
        indexStack.pop();
        top--;
      }
    }
  }
}

module.exports = routeWalk