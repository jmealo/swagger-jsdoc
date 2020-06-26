const createSpecification = require('./createSpecification');
const parseApiFile = require('./parseApiFile');
const convertGlobPaths = require('./convertGlobPaths');
const finalizeSpecificationObject = require('./finalizeSpecificationObject');
const updateSpecificationObject = require('./updateSpecificationObject');
const diff = require('diff');
const yaml = require('js-yaml');

function getSpecificationObject(options) {
  // Get input definition and prepare the specification's skeleton
  const definition = options.swaggerDefinition || options.definition;
  const specification = createSpecification(definition);

  // Parse the documentation containing information about APIs.
  const apiPaths = convertGlobPaths(options.apis);

  let lastSpec = yaml.safeDump(finalizeSpecificationObject(specification));

  // HACK: Generate the entire spec for each file, diff it against the last to determine which parts of the spec comes from each file
  for (let i = 0; i < apiPaths.length; i += 1) {
    const parsedFile = parseApiFile(apiPaths[i]);
    parsedFile.path = apiPaths[i];
    updateSpecificationObject(parsedFile, specification);
    // TODO: Can we generate a source map using diffLines, or do we need to diff the object?
    const finalObject = yaml.safeDump(
      finalizeSpecificationObject(specification)
    );
    const newLines = diff.diffLines(lastSpec, finalObject);
    console.log();
    console.log(apiPaths[i]);
    console.log(newLines);
  }

  return finalizeSpecificationObject(specification);
}

module.exports = getSpecificationObject;
