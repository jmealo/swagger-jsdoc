const fs = require('fs');
const parseApiFileContent = require('./parseApiFileContent');
/**
 * Parses the provided API file for JSDoc comments.
 * @function
 * @param {string} file - File to be parsed
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 */
function parseApiFile(file) {
  const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
  return parseApiFileContent(fileContent, file);
}

module.exports = parseApiFile;
