"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/extract-files";
exports.ids = ["vendor-chunks/extract-files"];
exports.modules = {

/***/ "(rsc)/./node_modules/extract-files/public/ReactNativeFile.js":
/*!**************************************************************!*\
  !*** ./node_modules/extract-files/public/ReactNativeFile.js ***!
  \**************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = function ReactNativeFile(_ref) {\n  var uri = _ref.uri,\n    name = _ref.name,\n    type = _ref.type;\n  this.uri = uri;\n  this.name = name;\n  this.type = type;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvZXh0cmFjdC1maWxlcy9wdWJsaWMvUmVhY3ROYXRpdmVGaWxlLmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92ZWYyLTIwMjUtdjUvLi9ub2RlX21vZHVsZXMvZXh0cmFjdC1maWxlcy9wdWJsaWMvUmVhY3ROYXRpdmVGaWxlLmpzPzU5YTkiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFJlYWN0TmF0aXZlRmlsZShfcmVmKSB7XG4gIHZhciB1cmkgPSBfcmVmLnVyaSxcbiAgICBuYW1lID0gX3JlZi5uYW1lLFxuICAgIHR5cGUgPSBfcmVmLnR5cGU7XG4gIHRoaXMudXJpID0gdXJpO1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLnR5cGUgPSB0eXBlO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/extract-files/public/ReactNativeFile.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/extract-files/public/extractFiles.js":
/*!***********************************************************!*\
  !*** ./node_modules/extract-files/public/extractFiles.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar defaultIsExtractableFile = __webpack_require__(/*! ./isExtractableFile */ \"(rsc)/./node_modules/extract-files/public/isExtractableFile.js\");\n\nmodule.exports = function extractFiles(value, path, isExtractableFile) {\n  if (path === void 0) {\n    path = '';\n  }\n\n  if (isExtractableFile === void 0) {\n    isExtractableFile = defaultIsExtractableFile;\n  }\n\n  var clone;\n  var files = new Map();\n\n  function addFile(paths, file) {\n    var storedPaths = files.get(file);\n    if (storedPaths) storedPaths.push.apply(storedPaths, paths);\n    else files.set(file, paths);\n  }\n\n  if (isExtractableFile(value)) {\n    clone = null;\n    addFile([path], value);\n  } else {\n    var prefix = path ? path + '.' : '';\n    if (typeof FileList !== 'undefined' && value instanceof FileList)\n      clone = Array.prototype.map.call(value, function (file, i) {\n        addFile(['' + prefix + i], file);\n        return null;\n      });\n    else if (Array.isArray(value))\n      clone = value.map(function (child, i) {\n        var result = extractFiles(child, '' + prefix + i, isExtractableFile);\n        result.files.forEach(addFile);\n        return result.clone;\n      });\n    else if (value && value.constructor === Object) {\n      clone = {};\n\n      for (var i in value) {\n        var result = extractFiles(value[i], '' + prefix + i, isExtractableFile);\n        result.files.forEach(addFile);\n        clone[i] = result.clone;\n      }\n    } else clone = value;\n  }\n\n  return {\n    clone: clone,\n    files: files,\n  };\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvZXh0cmFjdC1maWxlcy9wdWJsaWMvZXh0cmFjdEZpbGVzLmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLCtCQUErQixtQkFBTyxDQUFDLDJGQUFxQjs7QUFFNUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmVmMi0yMDI1LXY1Ly4vbm9kZV9tb2R1bGVzL2V4dHJhY3QtZmlsZXMvcHVibGljL2V4dHJhY3RGaWxlcy5qcz8xNDBhIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGRlZmF1bHRJc0V4dHJhY3RhYmxlRmlsZSA9IHJlcXVpcmUoJy4vaXNFeHRyYWN0YWJsZUZpbGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBleHRyYWN0RmlsZXModmFsdWUsIHBhdGgsIGlzRXh0cmFjdGFibGVGaWxlKSB7XG4gIGlmIChwYXRoID09PSB2b2lkIDApIHtcbiAgICBwYXRoID0gJyc7XG4gIH1cblxuICBpZiAoaXNFeHRyYWN0YWJsZUZpbGUgPT09IHZvaWQgMCkge1xuICAgIGlzRXh0cmFjdGFibGVGaWxlID0gZGVmYXVsdElzRXh0cmFjdGFibGVGaWxlO1xuICB9XG5cbiAgdmFyIGNsb25lO1xuICB2YXIgZmlsZXMgPSBuZXcgTWFwKCk7XG5cbiAgZnVuY3Rpb24gYWRkRmlsZShwYXRocywgZmlsZSkge1xuICAgIHZhciBzdG9yZWRQYXRocyA9IGZpbGVzLmdldChmaWxlKTtcbiAgICBpZiAoc3RvcmVkUGF0aHMpIHN0b3JlZFBhdGhzLnB1c2guYXBwbHkoc3RvcmVkUGF0aHMsIHBhdGhzKTtcbiAgICBlbHNlIGZpbGVzLnNldChmaWxlLCBwYXRocyk7XG4gIH1cblxuICBpZiAoaXNFeHRyYWN0YWJsZUZpbGUodmFsdWUpKSB7XG4gICAgY2xvbmUgPSBudWxsO1xuICAgIGFkZEZpbGUoW3BhdGhdLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHByZWZpeCA9IHBhdGggPyBwYXRoICsgJy4nIDogJyc7XG4gICAgaWYgKHR5cGVvZiBGaWxlTGlzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBGaWxlTGlzdClcbiAgICAgIGNsb25lID0gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKHZhbHVlLCBmdW5jdGlvbiAoZmlsZSwgaSkge1xuICAgICAgICBhZGRGaWxlKFsnJyArIHByZWZpeCArIGldLCBmaWxlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KTtcbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSlcbiAgICAgIGNsb25lID0gdmFsdWUubWFwKGZ1bmN0aW9uIChjaGlsZCwgaSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZXh0cmFjdEZpbGVzKGNoaWxkLCAnJyArIHByZWZpeCArIGksIGlzRXh0cmFjdGFibGVGaWxlKTtcbiAgICAgICAgcmVzdWx0LmZpbGVzLmZvckVhY2goYWRkRmlsZSk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2xvbmU7XG4gICAgICB9KTtcbiAgICBlbHNlIGlmICh2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgICBjbG9uZSA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBpIGluIHZhbHVlKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBleHRyYWN0RmlsZXModmFsdWVbaV0sICcnICsgcHJlZml4ICsgaSwgaXNFeHRyYWN0YWJsZUZpbGUpO1xuICAgICAgICByZXN1bHQuZmlsZXMuZm9yRWFjaChhZGRGaWxlKTtcbiAgICAgICAgY2xvbmVbaV0gPSByZXN1bHQuY2xvbmU7XG4gICAgICB9XG4gICAgfSBlbHNlIGNsb25lID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNsb25lOiBjbG9uZSxcbiAgICBmaWxlczogZmlsZXMsXG4gIH07XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/extract-files/public/extractFiles.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/extract-files/public/isExtractableFile.js":
/*!****************************************************************!*\
  !*** ./node_modules/extract-files/public/isExtractableFile.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar ReactNativeFile = __webpack_require__(/*! ./ReactNativeFile */ \"(rsc)/./node_modules/extract-files/public/ReactNativeFile.js\");\n\nmodule.exports = function isExtractableFile(value) {\n  return (\n    (typeof File !== 'undefined' && value instanceof File) ||\n    (typeof Blob !== 'undefined' && value instanceof Blob) ||\n    value instanceof ReactNativeFile\n  );\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvZXh0cmFjdC1maWxlcy9wdWJsaWMvaXNFeHRyYWN0YWJsZUZpbGUuanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsc0JBQXNCLG1CQUFPLENBQUMsdUZBQW1COztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3ZlZjItMjAyNS12NS8uL25vZGVfbW9kdWxlcy9leHRyYWN0LWZpbGVzL3B1YmxpYy9pc0V4dHJhY3RhYmxlRmlsZS5qcz82YzRjIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0TmF0aXZlRmlsZSA9IHJlcXVpcmUoJy4vUmVhY3ROYXRpdmVGaWxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNFeHRyYWN0YWJsZUZpbGUodmFsdWUpIHtcbiAgcmV0dXJuIChcbiAgICAodHlwZW9mIEZpbGUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgRmlsZSkgfHxcbiAgICAodHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgQmxvYikgfHxcbiAgICB2YWx1ZSBpbnN0YW5jZW9mIFJlYWN0TmF0aXZlRmlsZVxuICApO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/extract-files/public/isExtractableFile.js\n");

/***/ })

};
;