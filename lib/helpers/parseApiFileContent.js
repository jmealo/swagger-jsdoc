const doctrine = require('doctrine');
const path = require('path');
const jsYaml = require('js-yaml');
const lineColumn = require('line-column');

/**
 * Parse the provided API file content.
 *
 * @function
 * @param {string} fileContent - Content of the file
 * @param {string} file - Filename
 * @param {object}
 * @returns {{jsdoc: array, yaml: array, sourcemap: object}} JSDoc comments and Yaml files
 * @requires doctrine
 */

function parseApiFileContent(fileContent, file) {
  const jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
  const yaml = [];
  const jsDocComments = [];
  const jsDocLines = [];
  const ext = path.extname(file);

  if (ext === '.yaml' || ext === '.yml') {
    yaml.push(jsYaml.safeLoad(fileContent));
  } else {
    const matches = fileContent.matchAll(jsDocRegex);
    const finder = lineColumn(fileContent);

    for (const match of matches) {
      const startOffset = match.index;
      const endOffset = match.index + match[0].length;
      const comment = doctrine.parse(match[0], { unwrap: true });
      jsDocComments.push(comment);
      jsDocLines.push({
        start: finder.fromIndex(startOffset),
        end: finder.fromIndex(endOffset),
        comment,
        commentRaw: match[0],
        file,
      });
    }
  }

  return {
    yaml,
    jsdoc: jsDocComments,
  };
}

module.exports = parseApiFileContent;
