module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1542342913380, function(require, module, exports) {
'use strict';

const loader = require('./index');

module.exports = loader.default;
module.exports.pitch = loader.pitch;
}, function(modId) {var map = {"./index":1542342913381}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542342913381, function(require, module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
exports.pitch = pitch;

var _options = require('./options.json');

var _options2 = _interopRequireDefault(_options);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _schemaUtils = require('schema-utils');

var _schemaUtils2 = _interopRequireDefault(_schemaUtils);

var _NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');

var _NodeTargetPlugin2 = _interopRequireDefault(_NodeTargetPlugin);

var _SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

var _SingleEntryPlugin2 = _interopRequireDefault(_SingleEntryPlugin);

var _WebWorkerTemplatePlugin = require('webpack/lib/webworker/WebWorkerTemplatePlugin');

var _WebWorkerTemplatePlugin2 = _interopRequireDefault(_WebWorkerTemplatePlugin);

var _workers = require('./workers/');

var _workers2 = _interopRequireDefault(_workers);

var _Error = require('./Error');

var _Error2 = _interopRequireDefault(_Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable
  import/first,
  import/order,
  comma-dangle,
  linebreak-style,
  no-param-reassign,
  no-underscore-dangle,
  prefer-destructuring
*/
function loader() {}

function pitch(request) {
  const options = _loaderUtils2.default.getOptions(this) || {};

  (0, _schemaUtils2.default)(_options2.default, options, 'Worker Loader');

  if (!this.webpack) {
    throw new _Error2.default({
      name: 'Worker Loader',
      message: 'This loader is only usable with webpack'
    });
  }

  this.cacheable(false);

  const cb = this.async();

  const filename = _loaderUtils2.default.interpolateName(this, options.name || '[hash].worker.js', {
    context: options.context || this.rootContext || this.options.context,
    regExp: options.regExp
  });

  const worker = {};

  worker.options = {
    filename,
    chunkFilename: `[id].${filename}`,
    namedChunkFilename: null
  };

  worker.compiler = this._compilation.createChildCompiler('worker', worker.options);

  // Tapable.apply is deprecated in tapable@1.0.0-x.
  // The plugins should now call apply themselves.
  new _WebWorkerTemplatePlugin2.default(worker.options).apply(worker.compiler);

  if (this.target !== 'webworker' && this.target !== 'web') {
    new _NodeTargetPlugin2.default().apply(worker.compiler);
  }

  new _SingleEntryPlugin2.default(this.context, `!!${request}`, 'main').apply(worker.compiler);

  const subCache = `subcache ${__dirname} ${request}`;

  worker.compilation = compilation => {
    if (compilation.cache) {
      if (!compilation.cache[subCache]) {
        compilation.cache[subCache] = {};
      }

      compilation.cache = compilation.cache[subCache];
    }
  };

  if (worker.compiler.hooks) {
    const plugin = { name: 'WorkerLoader' };

    worker.compiler.hooks.compilation.tap(plugin, worker.compilation);
  } else {
    worker.compiler.plugin('compilation', worker.compilation);
  }

  worker.compiler.runAsChild((err, entries, compilation) => {
    if (err) return cb(err);

    if (entries[0]) {
      worker.file = entries[0].files[0];

      worker.factory = (0, _workers2.default)(worker.file, compilation.assets[worker.file].source(), options);

      if (options.fallback === false) {
        delete this._compilation.assets[worker.file];
      }

      return cb(null, `module.exports = function() {\n  return ${worker.factory};\n};`);
    }

    return cb(null, null);
  });
}
}, function(modId) { var map = {"./options.json":1542342913382,"./workers/":1542342913383,"./Error":1542342913384}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542342913382, function(require, module, exports) {
module.exports = {
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "inline": {
      "type": "boolean"
    },
    "fallback": {
      "type": "boolean"
    },
    "publicPath": {
      "type": "string"
    }
  },
  "additionalProperties": false
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542342913383, function(require, module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getWorker = (file, content, options) => {
  const publicPath = options.publicPath ? JSON.stringify(options.publicPath) : '__webpack_public_path__';

  const publicWorkerPath = `${publicPath} + ${JSON.stringify(file)}`;

  if (options.inline) {
    const InlineWorkerPath = JSON.stringify(`!!${_path2.default.join(__dirname, 'InlineWorker.js')}`);

    const fallbackWorkerPath = options.fallback === false ? 'null' : publicWorkerPath;

    return `require(${InlineWorkerPath})(${JSON.stringify(content)}, ${fallbackWorkerPath})`;
  }

  return `new Worker(${publicWorkerPath})`;
}; /* eslint-disable multiline-ternary */
exports.default = getWorker;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542342913384, function(require, module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class LoaderError extends Error {
  constructor(err) {
    super(err);

    this.name = err.name || 'Loader Error';
    this.message = `${err.name}\n\n${err.message}\n`;
    this.stack = false;
  }
}

exports.default = LoaderError;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1542342913380);
})()
//# sourceMappingURL=index.js.map