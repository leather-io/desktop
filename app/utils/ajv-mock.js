/* eslint-disable no-warning-comments */

// This file acts as stub for Ajv, a schema validating library,
// that has been ignored with Webpack, owing to its use of `eval`
// Read more about Ajv's CSP issues here:
// https://github.com/ajv-validator/ajv#ajv-and-content-security-policies-csp
// Read more about the library causing the issue here
// https://github.com/sindresorhus/conf/issues/126

module.exports = function () {
  return {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    compile: () => {},
  };
};
