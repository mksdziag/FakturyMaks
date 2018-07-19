// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"printThis.js":[function(require,module,exports) {
/*
 * printThis v1.12.3
 * @desc Printing plug-in for jQuery
 * @author Jason Day
 *
 * Resources (based on) :
 *              jPrintArea: http://plugins.jquery.com/project/jPrintArea
 *              jqPrint: https://github.com/permanenttourist/jquery.jqprint
 *              Ben Nadal: http://www.bennadel.com/blog/1591-Ask-Ben-Print-Part-Of-A-Web-Page-With-jQuery.htm
 *
 * Licensed under the MIT licence:
 *              http://www.opensource.org/licenses/mit-license.php
 *
 * (c) Jason Day 2015
 *
 * Usage:
 *
 *  $("#mySelector").printThis({
 *      debug: false,               // show the iframe for debugging
 *      importCSS: true,            // import page CSS
 *      importStyle: false,         // import style tags
 *      printContainer: true,       // grab outer container as well as the contents of the selector
 *      loadCSS: "path/to/my.css",  // path to additional css file - us an array [] for multiple
 *      pageTitle: "",              // add title to print page
 *      removeInline: false,        // remove all inline styles from print elements
 *      printDelay: 333,            // variable print delay
 *      header: null,               // prefix to html
 *      footer: null,               // postfix to html
 *      base: false,                // preserve the BASE tag, or accept a string for the URL
 *      formValues: true,           // preserve input/form values
 *      canvas: false,              // copy canvas elements (experimental)
 *      doctypeString: '...',       // enter a different doctype for older markup
 *      removeScripts: false,       // remove script tags from print content
 *      copyTagClasses: false       // copy classes from the html & body tag
 *  });
 *
 * Notes:
 *  - the loadCSS will load additional css (with or without @media print) into the iframe, adjusting layout
 */
;
(function ($) {

  function appendContent($el, content) {
    if (!content) return;

    // Simple test for a jQuery element
    $el.append(content.jquery ? content.clone() : content);
  }

  function appendBody($body, $element, opt) {
    // Clone for safety and convenience
    // Calls clone(withDataAndEvents = true) to copy form values.
    var $content = $element.clone(opt.formValues);

    if (opt.formValues) {
      // Copy original select and textarea values to their cloned counterpart
      // Makes up for inability to clone select and textarea values with clone(true)
      copyValues($element, $content, 'select, textarea');
    }

    if (opt.removeScripts) {
      $content.find('script').remove();
    }

    if (opt.printContainer) {
      // grab $.selector as container
      $content.appendTo($body);
    } else {
      // otherwise just print interior elements of container
      $content.each(function () {
        $(this).children().appendTo($body);
      });
    }
  }

  // Copies values from origin to clone for passed in elementSelector
  function copyValues(origin, clone, elementSelector) {
    var $originalElements = origin.find(elementSelector);

    clone.find(elementSelector).each(function (index, item) {
      $(item).val($originalElements.eq(index).val());
    });
  }

  var opt;
  $.fn.printThis = function (options) {
    opt = $.extend({}, $.fn.printThis.defaults, options);
    var $element = this instanceof jQuery ? this : $(this);

    var strFrameName = "printThis-" + new Date().getTime();

    if (window.location.hostname !== document.domain && navigator.userAgent.match(/msie/i)) {
      // Ugly IE hacks due to IE not inheriting document.domain from parent
      // checks if document.domain is set by comparing the host name against document.domain
      var iframeSrc = "javascript:document.write(\"<head><script>document.domain=\\\"" + document.domain + "\\\";</s" + "cript></head><body></body>\")";
      var printI = document.createElement('iframe');
      printI.name = "printIframe";
      printI.id = strFrameName;
      printI.className = "MSIE";
      document.body.appendChild(printI);
      printI.src = iframeSrc;
    } else {
      // other browsers inherit document.domain, and IE works if document.domain is not explicitly set
      var $frame = $("<iframe id='" + strFrameName + "' name='printIframe' />");
      $frame.appendTo("body");
    }

    var $iframe = $("#" + strFrameName);

    // show frame if in debug mode
    if (!opt.debug) $iframe.css({
      position: "absolute",
      width: "0px",
      height: "0px",
      left: "-600px",
      top: "-600px"
    });

    // $iframe.ready() and $iframe.load were inconsistent between browsers
    setTimeout(function () {

      // Add doctype to fix the style difference between printing and render
      function setDocType($iframe, doctype) {
        var win, doc;
        win = $iframe.get(0);
        win = win.contentWindow || win.contentDocument || win;
        doc = win.document || win.contentDocument || win;
        doc.open();
        doc.write(doctype);
        doc.close();
      }

      if (opt.doctypeString) {
        setDocType($iframe, opt.doctypeString);
      }

      var $doc = $iframe.contents(),
          $head = $doc.find("head"),
          $body = $doc.find("body"),
          $base = $('base'),
          baseURL;

      // add base tag to ensure elements use the parent domain
      if (opt.base === true && $base.length > 0) {
        // take the base tag from the original page
        baseURL = $base.attr('href');
      } else if (typeof opt.base === 'string') {
        // An exact base string is provided
        baseURL = opt.base;
      } else {
        // Use the page URL as the base
        baseURL = document.location.protocol + '//' + document.location.host;
      }

      $head.append('<base href="' + baseURL + '">');

      // import page stylesheets
      if (opt.importCSS) $("link[rel=stylesheet]").each(function () {
        var href = $(this).attr("href");
        if (href) {
          var media = $(this).attr("media") || "all";
          $head.append("<link type='text/css' rel='stylesheet' href='" + href + "' media='" + media + "'>");
        }
      });

      // import style tags
      if (opt.importStyle) $("style").each(function () {
        $head.append(this.outerHTML);
      });

      // add title of the page
      if (opt.pageTitle) $head.append("<title>" + opt.pageTitle + "</title>");

      // import additional stylesheet(s)
      if (opt.loadCSS) {
        if ($.isArray(opt.loadCSS)) {
          jQuery.each(opt.loadCSS, function (index, value) {
            $head.append("<link type='text/css' rel='stylesheet' href='" + this + "'>");
          });
        } else {
          $head.append("<link type='text/css' rel='stylesheet' href='" + opt.loadCSS + "'>");
        }
      }

      // copy 'root' tag classes
      var tag = opt.copyTagClasses;
      if (tag) {
        tag = tag === true ? 'bh' : tag;
        if (tag.indexOf('b') !== -1) {
          $body.addClass($('body')[0].className);
        }
        if (tag.indexOf('h') !== -1) {
          $doc.find('html').addClass($('html')[0].className);
        }
      }

      // print header
      appendContent($body, opt.header);

      if (opt.canvas) {
        // add canvas data-ids for easy access after cloning.
        var canvasId = 0;
        // .addBack('canvas') adds the top-level element if it is a canvas.
        $element.find('canvas').addBack('canvas').each(function () {
          $(this).attr('data-printthis', canvasId++);
        });
      }

      appendBody($body, $element, opt);

      if (opt.canvas) {
        // Re-draw new canvases by referencing the originals
        $body.find('canvas').each(function () {
          var cid = $(this).data('printthis'),
              $src = $('[data-printthis="' + cid + '"]');

          this.getContext('2d').drawImage($src[0], 0, 0);

          // Remove the markup from the original
          $src.removeData('printthis');
        });
      }

      // remove inline styles
      if (opt.removeInline) {
        // $.removeAttr available jQuery 1.7+
        if ($.isFunction($.removeAttr)) {
          $doc.find("body *").removeAttr("style");
        } else {
          $doc.find("body *").attr("style", "");
        }
      }

      // print "footer"
      appendContent($body, opt.footer);

      setTimeout(function () {
        if ($iframe.hasClass("MSIE")) {
          // check if the iframe was created with the ugly hack
          // and perform another ugly hack out of neccessity
          window.frames["printIframe"].focus();
          $head.append("<script>  window.print(); </s" + "cript>");
        } else {
          // proper method
          if (document.queryCommandSupported("print")) {
            $iframe[0].contentWindow.document.execCommand("print", false, null);
          } else {
            $iframe[0].contentWindow.focus();
            $iframe[0].contentWindow.print();
          }
        }

        // remove iframe after print
        if (!opt.debug) {
          setTimeout(function () {
            $iframe.remove();
          }, 1000);
        }
      }, opt.printDelay);
    }, 333);
  };

  // defaults
  $.fn.printThis.defaults = {
    debug: false, // show the iframe for debugging
    importCSS: true, // import parent page css
    importStyle: false, // import style tags
    printContainer: false, // print outer container/$.selector
    loadCSS: "", // load an additional css file - load multiple stylesheets with an array []
    pageTitle: "", // add title to print page
    removeInline: false, // remove all inline styles
    printDelay: 150, // variable print delay
    header: null, // prefix to html
    footer: null, // postfix to html
    formValues: true, // preserve input/form values
    canvas: false, // copy canvas content (experimental)
    base: false, // preserve the BASE tag, or accept a string for the URL
    doctypeString: '<!DOCTYPE html>', // html doctype
    removeScripts: false, // remove script tags before appending
    copyTagClasses: false // copy classes from the html & body tag
  };
})(jQuery);
},{}],"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '44643' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","printThis.js"], null)
//# sourceMappingURL=/printThis.3cc512f6.map