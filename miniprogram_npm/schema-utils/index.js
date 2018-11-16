module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1542342913376, function(require, module, exports) {
/* eslint-disable
  strict
*/

'use strict';

const validateOptions = require('./validateOptions');

module.exports = validateOptions;

}, function(modId) {var map = {"./validateOptions":1542342913377}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542342913377, function(require, module, exports) {
/* eslint-disable
  strict,
  no-param-reassign
*/

'use strict';

const fs = require('fs');
const path = require('path');

const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');

const ValidationError = require('./ValidationError');

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  errorDataPath: 'property',
});

ajvKeywords(ajv, ['instanceof', 'typeof']);

const validateOptions = (schema, options, name) => {
  if (typeof schema === 'string') {
    schema = fs.readFileSync(path.resolve(schema), 'utf8');
    schema = JSON.parse(schema);
  }

  if (!ajv.validate(schema, options)) {
    throw new ValidationError(ajv.errors, name);
  }

  return true;
};

module.exports = validateOptions;

}, function(modId) { var map = {"./ValidationError":1542342913378}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542342913378, function(require, module, exports) {
/* eslint-disable
  strict
*/

'use strict';

class ValidationError extends Error {
  constructor(errors, name) {
    super();

    this.name = 'ValidationError';

    this.message = `${name || ''} Invalid Options\n\n`;

    errors.forEach((err) => {
      this.message += `options${err.dataPath} ${err.message}\n`;
    });

    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ValidationError;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1542342913376);
})()
//# sourceMappingURL=index.js.map