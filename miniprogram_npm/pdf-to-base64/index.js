module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1542342913370, function(require, module, exports) {
/*
* @Author: shubhambansal
* @Date:   2018-10-27 06:48:33
* @Last Modified by:   Shubham Bansal
* @Last Modified time: 2018-10-27 07:35:07
*/
const pdf2base64 = require("./pdf-to-base64.js");
// const assert = require("assert");
// const pt = require("path");

let url = "http://www.africau.edu/images/default/sample.pdf";
// let path = pt.resolve("sample.pdf");
let validBase64 = new RegExp("^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{0,2}==)$","gim");

        pdf2base64(url)
        .then((data) => {
            console.log(validBase64.test(data), true);
        }).catch((err) => console.log(err, true));


}, function(modId) {var map = {"./pdf-to-base64.js":1542342913371}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542342913371, function(require, module, exports) {
/*
* @Author: shubhambansal
* @Date:   2018-10-27 06:30:04
* @Last Modified by:   shubhambansal
* @Last Modified time: 2018-10-27 06:59:59
*/
(function(escope){
    "use strict";

    function validUrl (url) {
        return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi.test(url);
    }

    function validTypePdf (pdf) {
        return /(\.(pdf))/gi.test(pdf);
    }

    function base64ToBrowser (buffer) {
        return window.btoa([].slice.call(new Uint8Array(buffer)).map(function(bin) { return String.fromCharCode(bin) }).join(""));
    }

    function base64ToNode (buffer) {
        return buffer.toString("base64");
    }

    function readFileAndConvert (fileName) {
        // var fileSystem = require("fs");
        // var path = require("path");

        // if (fileSystem.statSync(fileName).isFile()) {
        //     return base64ToNode(fileSystem.readFileSync(path.resolve(fileName)).toString("base64"));
        // }
        return null;
    }

    function isPdf (urlOrPdf) {
        if (validTypePdf(urlOrPdf)) {
            return Promise.resolve(readFileAndConvert(urlOrPdf));
        } else {
            return Promise.reject("[*] Occurent some error... [validTypePdf] == false");
        }
    }

    function isBrowser (urlOrPdf, param) {
        if (!("fetch" in window && "Promise" in window)) {
            return Promise.reject("[*] It's pdf2base64 not compatible with your browser.");
        }
        return fetch(urlOrPdf, param || {}).then(function(response){
            return response.arrayBuffer();
        }).then(base64ToBrowser);
    }

    function isNodeJs (urlOrPdf) {
        return isPdf(urlOrPdf);
    }

    function pdfToBase64(urlOrPdf, param) {
        if (typeof window !== "undefined" && ("document" in window && "navigator" in window)) {
            return isBrowser(urlOrPdf, param);
        } else {
            return isNodeJs(urlOrPdf);
        }
    }

    if (typeof module !== "undefined") {
        module.exports = pdfToBase64;
    } else {
        escope.pdfToBase64 = pdfToBase64;
    }

})(this);

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1542342913370);
})()
//# sourceMappingURL=index.js.map