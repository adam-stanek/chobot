const createTsTransformPath = require('@zerollup/ts-transform-paths')

function getCustomTransformers(program) {
  const tsTransformPath = createTsTransformPath(program)

  return {
    before: [tsTransformPath.before],
    // after: [tsTransformPath.afterDeclarations],
  }
}

module.exports = getCustomTransformers
