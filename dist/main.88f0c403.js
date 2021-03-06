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
})({"src/js/printThis.js":[function(require,module,exports) {
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

    var strFrameName = 'printThis-' + new Date().getTime();

    if (window.location.hostname !== document.domain && navigator.userAgent.match(/msie/i)) {
      // Ugly IE hacks due to IE not inheriting document.domain from parent
      // checks if document.domain is set by comparing the host name against document.domain
      var iframeSrc = 'javascript:document.write("<head><script>document.domain=\\"' + document.domain + '\\";</s' + 'cript></head><body></body>")';
      var printI = document.createElement('iframe');
      printI.name = 'printIframe';
      printI.id = strFrameName;
      printI.className = 'MSIE';
      document.body.appendChild(printI);
      printI.src = iframeSrc;
    } else {
      // other browsers inherit document.domain, and IE works if document.domain is not explicitly set
      var $frame = $("<iframe id='" + strFrameName + "' name='printIframe' />");
      $frame.appendTo('body');
    }

    var $iframe = $('#' + strFrameName);

    // show frame if in debug mode
    if (!opt.debug) $iframe.css({
      position: 'absolute',
      width: '0px',
      height: '0px',
      left: '-600px',
      top: '-600px'
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
          $head = $doc.find('head'),
          $body = $doc.find('body'),
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
      if (opt.importCSS) $('link[rel=stylesheet]').each(function () {
        var href = $(this).attr('href');
        if (href) {
          var media = $(this).attr('media') || 'all';
          $head.append("<link type='text/css' rel='stylesheet' href='" + href + "' media='" + media + "'>");
        }
      });

      // import style tags
      if (opt.importStyle) $('style').each(function () {
        $head.append(this.outerHTML);
      });

      // add title of the page
      if (opt.pageTitle) $head.append('<title>' + opt.pageTitle + '</title>');

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
          $doc.find('body *').removeAttr('style');
        } else {
          $doc.find('body *').attr('style', '');
        }
      }

      // print "footer"
      appendContent($body, opt.footer);

      setTimeout(function () {
        if ($iframe.hasClass('MSIE')) {
          // check if the iframe was created with the ugly hack
          // and perform another ugly hack out of neccessity
          window.frames['printIframe'].focus();
          $head.append('<script>  window.print(); </s' + 'cript>');
        } else {
          // proper method
          if (document.queryCommandSupported('print')) {
            $iframe[0].contentWindow.document.execCommand('print', false, null);
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
    loadCSS: '', // load an additional css file - load multiple stylesheets with an array []
    pageTitle: '', // add title to print page
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
},{}],"node_modules/uuid/lib/rng-browser.js":[function(require,module,exports) {
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

},{}],"node_modules/uuid/lib/bytesToUuid.js":[function(require,module,exports) {
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;

},{}],"node_modules/uuid/v1.js":[function(require,module,exports) {
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/rng":"node_modules/uuid/lib/rng-browser.js","./lib/bytesToUuid":"node_modules/uuid/lib/bytesToUuid.js"}],"node_modules/uuid/v4.js":[function(require,module,exports) {
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/rng":"node_modules/uuid/lib/rng-browser.js","./lib/bytesToUuid":"node_modules/uuid/lib/bytesToUuid.js"}],"node_modules/uuid/index.js":[function(require,module,exports) {
var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

},{"./v1":"node_modules/uuid/v1.js","./v4":"node_modules/uuid/v4.js"}],"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/sass/main.scss":[function(require,module,exports) {

var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/js/main.js":[function(require,module,exports) {
'use strict';

require('./printThis');

var _uuid = require('uuid');

require('../sass/main.scss');

var uiController = function () {
  // defining DOM elements
  var DOMElements = {
    // -------------------------------------------------------
    // Invoice details input elements
    // -------------------------------------------------------
    dataInpuForm: document.querySelector('.data-form'),

    // document data inputs
    docTypeInp: document.querySelector('.data__doc-type'),
    docNumInp: document.querySelector('.data__doc-number'),
    docPlaceInp: document.querySelector('.data__doc-place'),
    docDateInp: document.querySelector('.data__doc-date'),
    docSellDateInp: document.querySelector('.data__doc-sell-date'),

    // seller data inputs
    sellerNameInp: document.querySelector('.data__seller-name'),
    sellerStreetInp: document.querySelector('.data__seller-street'),
    sellerCityInp: document.querySelector('.data__seller-city'),
    sellerPostCodeInp: document.querySelector('.data__seller-post-code'),
    sellerNipInp: document.querySelector('.data__seller-nip'),
    sellerSaveBtn: document.querySelector('.btn--seller-save'),
    sellerLoadBtn: document.querySelector('.btn--seller-load'),

    // buyer data inputs
    buyerNameInp: document.querySelector('.data__buyer-name'),
    buyerStreetInp: document.querySelector('.data__buyer-street'),
    buyerCityInp: document.querySelector('.data__buyer-city'),
    buyerPostCodeInp: document.querySelector('.data__buyer-post-code'),
    buyerNipInp: document.querySelector('.data__buyer-nip'),
    buyerSaveBtn: document.querySelector('.btn--buyer-save'),
    buyerLoadTrigger: document.querySelector('.btn--buyer-load'),

    // payment terms inputs
    payMethodInp: document.querySelector('.payment__method'),
    payTermInp: document.querySelector('.payment__term'),
    payAccountInp: document.querySelector('.payment__account'),
    accountSaveBtn: document.querySelector('.btn--account-save'),
    accountLoadBtn: document.querySelector('.btn--account-load'),

    // draft positions inputs
    itemNameInp: document.querySelector('.draft-item__name'),
    itemUnitInp: document.querySelector('.draft-item__unit'),
    itemQuantInp: document.querySelector('.draft-item__quantity'),
    itemPriceInp: document.querySelector('.draft-item__price'),
    itemNetValInp: document.querySelector('.draft-item__net-value'),
    itemTaxRateInp: document.querySelector('.draft-item__tax-rate'),
    itemTaxValInp: document.querySelector('.draft-item__tax-value'),
    itemTotValInp: document.querySelector('.draft-item__total-value'),
    itemSaveBtn: document.querySelector('.btn--item-save'),
    itemLoadTrigger: document.querySelector('.btn--item-load'),
    storageListModalClose: document.querySelector('.btn--close-storage-list'),

    // draft add button
    addBtn: document.querySelector('.btn--add-item'),

    // draft itens table
    draftItemConstructor: document.querySelector('.draft-item__constructor'),
    draftItemTable: document.querySelector('.draft-added-items'),
    drawtSumTable: document.querySelector('.draft__summary'),
    itemDelBtn: document.querySelectorAll('.btn--item-del'),

    // storage list modal
    storageList: document.querySelector('.storage-list'),
    storageListModal: document.querySelector('.storage-list__modal'),
    storageListBackdrop: document.querySelector('.storage-list__backdrop'),

    // button generate invoice
    genBtn: document.querySelector('.btn--gen-inv'),
    printBtn: document.querySelector('.btn--print-inv'),

    // -------------------------------------------------------
    //output invoice elements
    // -------------------------------------------------------
    invoice: document.querySelector('.invoice'),
    // invoice heading
    invType: document.querySelector('.invoice__type'),
    invNum: document.querySelector('.invoice__number'),
    invPlace: document.querySelector('.invoice__place'),
    invSellDate: document.querySelector('.invoice__sell-date'),
    invDate: document.querySelector('.invoice__place-date'),
    // invoice seller details
    invSellerName: document.querySelector('.invoice__seller-name'),
    invSellerStr: document.querySelector('.invoice__seller-street'),
    invSellerCity: document.querySelector('.invoice__seller-city'),
    invSellerPostCode: document.querySelector('.seller__post-code'),
    invSellerNip: document.querySelector('.invoice__seller-nip'),
    // invoice buyer details
    invBuyerName: document.querySelector('.invoice__buyer-name'),
    invBuyerStr: document.querySelector('.invoice__buyer-street'),
    invBuyerCity: document.querySelector('.invoice__buyer-city'),
    invBuyerPostCode: document.querySelector('.buyer__post-code'),
    invBuyerNip: document.querySelector('.invoice__buyer-nip'),
    // Invoice positions items table
    invoicePositionsTable: document.querySelector('.invoice__positions-place'),
    invoicePositionsTableSum: document.querySelector('.invoice__positions-summary'),
    // invoice final details
    invFinalToPay: document.querySelector('.invoice__final-to-pay'),
    invFinalPayMethod: document.querySelector('.invoice__final-payment-method'),
    invFinalPayTerm: document.querySelector('.invoice__final-payment-term'),
    invFinalAccount: document.querySelector('.invoice__final-payment__account')
  };

  // displaying draft item taxes in draft item constructor form
  var displayDraftItemNotFilledInputs = function displayDraftItemNotFilledInputs() {
    if (DOMElements.itemQuantInp.value !== '' && DOMElements.itemPriceInp.value !== '') {
      DOMElements.itemNetValInp.value = (DOMElements.itemPriceInp.valueAsNumber * DOMElements.itemQuantInp.valueAsNumber).toFixed(2);
      DOMElements.itemTaxValInp.value = (DOMElements.itemQuantInp.valueAsNumber * DOMElements.itemPriceInp.valueAsNumber * parseFloat(DOMElements.itemTaxRateInp.value / 100)).toFixed(2);
      DOMElements.itemTotValInp.value = (DOMElements.itemNetValInp.valueAsNumber + DOMElements.itemTaxValInp.valueAsNumber).toFixed(2);
      DOMElements.itemTotalPriceInp.value = (DOMElements.itemPriceInp.valueAsNumber + DOMElements.itemPriceInp.valueAsNumber * parseFloat(DOMElements.itemTaxRateInp.value / 100)).toFixed(2);
    }
  };

  // clearing draft item input fields
  var clearDraftItemFieds = function clearDraftItemFieds() {
    DOMElements.draftItemConstructor.reset();
    DOMElements.itemNameInp.focus();
  };

  // add item to draft table
  var addItemToDraftItemsList = function addItemToDraftItemsList(id) {
    var item = storageController.draftItemsData.items.find(function (item) {
      return item.id === id;
    });
    // create newtable row
    var newRow = document.createElement('tr');
    newRow.classList.add('draft__position');
    newRow.id = 'draft-item-' + item.id;
    newRow.dataset.identifier = '' + item.id;
    newRow.innerHTML = '\n      <td class="draft__item-delete"><button class="btn btn--item-del">usu\u0144</button></td>\n      <td class="draft__item-name">' + item.name + '</td>\n      <td class="draft__item-unit">' + item.unit + '</td>\n      <td class="draft__item-quantity">' + item.quantity.toFixed(2) + '</td>\n      <td class="draft__item-price">' + item.netPrice.toFixed(2) + '</td>\n      <td class="draft__item-net-value">' + item.netValue.toFixed(2) + '</td>\n      <td class="draft__item-tax-rate">' + item.taxRate + '%</td>\n      <td class="draft__item-tax-value">' + item.taxValue.toFixed(2) + '</td>\n      <td class="draft__item-total-value">' + item.total.toFixed(2) + '</td>';
    DOMElements.draftItemTable.appendChild(newRow);
  };

  // helper function for cleat innner HTML in given element
  var clearInnerHtml = function clearInnerHtml(elem) {
    elem.innerHTML = '';
  };

  // building draft items table from start
  var rebuildDraftItemsTable = function rebuildDraftItemsTable() {
    clearInnerHtml(DOMElements.draftItemTable);
    // for each drafted item perform same action
    storageController.draftItemsData.items.forEach(function (item) {
      // create newtable row
      var newRow = document.createElement('tr');
      newRow.classList.add('draft__position');
      newRow.id = 'draft-item-' + item.id;
      newRow.dataset.identifier = '' + item.id;
      newRow.innerHTML = '\n      <td class="draft__item-delete"><button class="btn btn--item-del">usu\u0144</button></td>\n      <td class="draft__item-name">' + item.name + '</td>\n      <td class="draft__item-unit">' + item.unit + '</td>\n      <td class="draft__item-quantity">' + item.quantity.toFixed(2) + '</td>\n      <td class="draft__item-price">' + item.netPrice.toFixed(2) + '</td>\n      <td class="draft__item-net-value">' + item.netValue.toFixed(2) + '</td>\n      <td class="draft__item-tax-rate">' + item.taxRate + '%</td>\n      <td class="draft__item-tax-value">' + item.taxValue.toFixed(2) + '</td>\n      <td class="draft__item-total-value">' + item.total.toFixed(2) + '</td>';
      DOMElements.draftItemTable.appendChild(newRow);
    });
  };

  // building draft sum values in draft table
  var buildDraftSumValues = function buildDraftSumValues() {
    // remove all content from summary draft table
    clearInnerHtml(DOMElements.drawtSumTable);

    var draftSumRow = document.createElement('tr');
    draftSumRow.classList.add('draft__summary-row');
    draftSumRow.innerHTML = '\n    <th colspan="5" class="draft__summary-legend">Razem:</th>\n    <th class="draft__summary-net-value">' + storageController.draftItemsData.summaries.totalNetVal.toFixed(2) + '</th>\n    <th class=""></th>\n    <th class="draft__summary-vat-value">' + storageController.draftItemsData.summaries.totalTaxVal.toFixed(2) + '</th>\n    <th class="draft__summary-total">' + storageController.draftItemsData.summaries.total.toFixed(2) + '</th>';
    DOMElements.drawtSumTable.appendChild(draftSumRow);
  };

  var generateDraftSumRow = function generateDraftSumRow(areTaxRateItems, checkingTaxRate) {
    var checkedTaxRate = storageController.draftItemsData.summaries.taxRates['tax' + checkingTaxRate];
    if (areTaxRateItems) {
      var taxRatefinalRow = document.createElement('tr');
      taxRatefinalRow.classList.add('draft__summary-row');
      taxRatefinalRow.innerHTML = '\n      <td colspan="5" class="draft__summary-legend">W tym:</td>\n      <td class="draft__summary-net-value">' + checkedTaxRate.netValue.toFixed(2) + '</td>\n      <td class="">' + checkingTaxRate + '%</td>\n      <td class="draft__summary-vat-value">' + checkedTaxRate.taxValue.toFixed(2) + '</td>\n      <td class="draft__summary-total">' + checkedTaxRate.taxTotal.toFixed(2) + '</td>';
      DOMElements.drawtSumTable.appendChild(taxRatefinalRow);
    }
  };

  var generateInvoice = function generateInvoice() {
    var invoiceObj = storageController.invoices.invoice.details;
    // inserting details of the invoice
    DOMElements.invType.textContent = '' + invoiceObj.document.type;
    DOMElements.invNum.textContent = 'nr ' + invoiceObj.document.number;
    DOMElements.invPlace.textContent = 'Miejsce wystawienia: ' + invoiceObj.document.place;
    DOMElements.invDate.textContent = 'Data wystawienia: ' + invoiceObj.document.date;
    DOMElements.invSellDate.textContent = 'Data sprzeda\u017Cy: ' + invoiceObj.document.sellDate;
    DOMElements.invSellerName.textContent = '' + invoiceObj.seller.name;
    DOMElements.invSellerStr.textContent = '' + invoiceObj.seller.street;
    DOMElements.invSellerCity.textContent = '' + invoiceObj.seller.city;
    DOMElements.invSellerPostCode.textContent = '' + invoiceObj.seller.postCode;
    DOMElements.invSellerNip.textContent = 'NIP: ' + invoiceObj.seller.nip;
    DOMElements.invBuyerName.textContent = '' + invoiceObj.buyer.name;
    DOMElements.invBuyerStr.textContent = '' + invoiceObj.buyer.street;
    DOMElements.invBuyerCity.textContent = '' + invoiceObj.buyer.city;
    DOMElements.invBuyerPostCode.textContent = '' + invoiceObj.buyer.postCode;
    DOMElements.invBuyerNip.textContent = 'NIP: ' + invoiceObj.buyer.nip;
    DOMElements.invFinalToPay.textContent = 'Do zap\u0142aty: ' + invoiceObj.payment.toPay.toFixed(2) + ' PLN';
    DOMElements.invFinalPayMethod.textContent = 'Spos\xF3b p\u0142atno\u015Bci: ' + invoiceObj.payment.method;
    DOMElements.invFinalPayTerm.textContent = 'Termin p\u0142atno\u015Bci: ' + invoiceObj.payment.term;
    // print account number if choosen method is different than cash
    if (invoiceObj.payment.method !== 'gotówka') {
      DOMElements.invFinalAccount.textContent = 'Konto: ' + invoiceObj.payment.account;
    } else {
      DOMElements.invFinalAccount.textContent = '';
    }
  };

  var generateInvoicePositions = function generateInvoicePositions(positionsArray) {
    clearInnerHtml(DOMElements.invoicePositionsTable);
    clearInnerHtml(DOMElements.invoicePositionsTableSum);

    positionsArray.forEach(function (item) {
      var newRow = document.createElement('tr');
      newRow.classList.add('invoice__position');
      newRow.id = 'invoice-item' + item.id;
      newRow.dataset.identifier = '' + item.id;
      newRow.innerHTML = '\n          <td class="invoice__item-lp">' + (positionsArray.indexOf(item) + 1) + '</td>\n          <td class="invoice__item-name">' + item.name + '</td>\n          <td class="invoice__item-unit">' + item.unit + '</td>\n          <td class="invoice__item-currency">PLN</td>\n          <td class="invoice__item-quantity">' + item.quantity.toFixed(2) + '</td>\n          <td class="invoice__item-price">' + item.netPrice.toFixed(2) + '</td>\n          <td class="invoice__item-net-value">' + item.netValue.toFixed(2) + '</td>\n          <td class="invoice__item-tax-rate">' + item.taxRate + '%</td>\n          <td class="invoice__item-tax-value">' + item.taxValue.toFixed(2) + '</td>\n          <td class="invoice__item-total-value">' + item.total.toFixed(2) + '</td>';
      DOMElements.invoicePositionsTable.appendChild(newRow);
    });

    // invoice items summaries from draft items summaries section
    var totalNetVal = storageController.draftItemsData.summaries.totalNetVal;
    var totalTaxVal = storageController.draftItemsData.summaries.totalTaxVal;
    var total = storageController.draftItemsData.summaries.total;

    var invoiceSumRow = document.createElement('tr');
    invoiceSumRow.classList.add('invoice__summary-row');
    invoiceSumRow.innerHTML = '\n    <th colspan="6" class="invoice__summary-legend">Razem:</th>\n    <th class="invoice__summary-net-value">' + totalNetVal.toFixed(2) + '</th>\n    <th class=""></th>\n    <th class="invoice__summary-vat-value">' + totalTaxVal.toFixed(2) + '</th>\n    <th class="invoice__summary-total">' + total.toFixed(2) + '</th>';
    DOMElements.invoicePositionsTable.appendChild(invoiceSumRow);

    // generate boolean values for check it there are some products with specific tax rates
    var isTax23 = positionsArray.some(function (item) {
      return item.taxRate === 23;
    });
    var isTax8 = positionsArray.some(function (item) {
      return item.taxRate === 8;
    });
    var isTax5 = positionsArray.some(function (item) {
      return item.taxRate === 5;
    });
    var isTax3 = positionsArray.some(function (item) {
      return item.taxRate === 3;
    });
    var isTax00 = positionsArray.some(function (item) {
      return item.taxRate === 0;
    });

    //  generate summaries by vat rate
    generateInvoiceSumRow(isTax23, 23);
    generateInvoiceSumRow(isTax8, 8);
    generateInvoiceSumRow(isTax5, 5);
    generateInvoiceSumRow(isTax3, 3);
    generateInvoiceSumRow(isTax00, 0);
  };

  // generate invoice positions sum row for each existing in draft items tavle tax rate determined by first argument the boolean value
  var generateInvoiceSumRow = function generateInvoiceSumRow(isTaxRate, checkingTaxRate) {
    var checkedTaxRate = storageController.draftItemsData.summaries.taxRates['tax' + checkingTaxRate];
    if (isTaxRate) {
      var vatRatefinalrow = document.createElement('tr');
      vatRatefinalrow.classList.add('invoice__summary-row');
      vatRatefinalrow.innerHTML = '\n        <td colspan="6" class="invoice__summary-legend">W tym:</td>\n        <td class="invoice__summary-net-value">' + checkedTaxRate.netValue.toFixed(2) + '</td>\n        <td class="">' + checkingTaxRate + '%</td>\n        <td class="invoice__summary-vat-value">' + checkedTaxRate.taxValue.toFixed(2) + '</td>\n        <td class="invoice__summary-total">' + checkedTaxRate.taxTotal.toFixed(2) + '</td>';
      DOMElements.invoicePositionsTable.appendChild(vatRatefinalrow);
    }
  };

  // showing modal complete
  var showCompleteInfo = function showCompleteInfo() {
    var competionModal = document.querySelector('.not-completed-form-modal');
    competionModal.style.display = 'block';
    setTimeout(function () {
      return competionModal.classList.add('completion-modal-active');
    }, 10);

    setTimeout(hideCompletionModal, 3000);

    function hideCompletionModal() {
      competionModal.classList.remove('completion-modal-active');
      setTimeout(function () {
        return competionModal.style.display = 'none';
      }, 250);
    }
  };

  var activatePrintInvoice = function activatePrintInvoice() {
    DOMElements.printBtn.removeAttribute('disabled');
  };

  var closeStorageModal = function closeStorageModal() {
    DOMElements.storageListModal.classList.remove('modal-active');
    setTimeout(function () {
      DOMElements.storageListModal.style.display = 'none';
    }, 250);
    hideBackdropModal();
    DOMElements.storageList.innerHTML = '';
  };

  var openStorageModal = function openStorageModal() {
    displayBackdropModal();
    DOMElements.storageListModal.style.display = 'block';
    setTimeout(function () {
      DOMElements.storageListModal.classList.add('modal-active');
    }, 10);
  };

  var hideBackdropModal = function hideBackdropModal() {
    DOMElements.storageListBackdrop.classList.remove('backdrop-active');
    setTimeout(function () {
      DOMElements.storageListBackdrop.style = 'display: none';
    }, 250);
  };

  var displayBackdropModal = function displayBackdropModal() {
    DOMElements.storageListBackdrop.style = 'display: block';
    setTimeout(function () {
      DOMElements.storageListBackdrop.classList.add('backdrop-active');
    }, 10);
  };

  var fillInputForm = function fillInputForm(e) {
    if (e.target.classList.contains('btn--load-item')) {
      var items = JSON.parse(localStorage.getItem('items'));
      var item = items[e.target.dataset.itemName];
      DOMElements.itemNameInp.value = item.name;
      DOMElements.itemUnitInp.value = item.unit;
      DOMElements.itemPriceInp.value = item.netPrice;
      DOMElements.itemTaxRateInp.value = item.taxRate;
      closeStorageModal();
      DOMElements.itemQuantInp.focus();
    }
    if (e.target.classList.contains('btn--load-seller')) {
      var sellers = JSON.parse(localStorage.getItem('sellers'));
      var seller = sellers[e.target.dataset.sellerName];
      DOMElements.sellerNameInp.value = seller.name;
      DOMElements.sellerStreetInp.value = seller.street;
      DOMElements.sellerCityInp.value = seller.city;
      DOMElements.sellerPostCodeInp.value = seller.postCode;
      DOMElements.sellerNipInp.value = seller.nip;
      closeStorageModal();
    }
    if (e.target.classList.contains('btn--load-buyer')) {
      var buyers = JSON.parse(localStorage.getItem('buyers'));
      var buyer = buyers[e.target.dataset.buyerName];
      DOMElements.buyerNameInp.value = buyer.name;
      DOMElements.buyerStreetInp.value = buyer.street;
      DOMElements.buyerCityInp.value = buyer.city;
      DOMElements.buyerPostCodeInp.value = buyer.postCode;
      DOMElements.buyerNipInp.value = buyer.nip;
      closeStorageModal();
    }
    if (e.target.classList.contains('btn--load-account')) {
      var accounts = JSON.parse(localStorage.getItem('accounts'));
      var account = accounts[e.target.dataset.accountNumber];
      DOMElements.payAccountInp.value = account.number;
      closeStorageModal();
    }
  };

  var buildStorageSellersList = function buildStorageSellersList() {
    var localStorageBuyers = localStorage.getItem('sellers') ? JSON.parse(localStorage.getItem('sellers')) : {};
    if (Object.keys(localStorageBuyers).length > 0) {
      var sellers = Object.entries(localStorageBuyers);
      sellers.forEach(function (seller) {
        var li = document.createElement('li');
        li.classList.add('storage-list__item');

        var loadButton = document.createElement('button');
        loadButton.classList.add('btn');
        loadButton.classList.add('btn--choose');
        loadButton.classList.add('btn--load-seller');
        loadButton.dataset.sellerName = seller[1].name;
        loadButton.textContent = 'Wybierz';

        var deleteButton = document.createElement('button');
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn--choose');
        deleteButton.classList.add('btn--delete-seller');
        deleteButton.dataset.sellerName = seller[1].name;
        deleteButton.textContent = 'Usuń';

        var nameSpan = document.createElement('span');
        nameSpan.classList.add('storage-list__seller-name');
        nameSpan.textContent = seller[1].name;

        var streetSpan = document.createElement('span');
        streetSpan.classList.add('storage-list__seller-street');
        streetSpan.textContent = seller[1].street;

        var citySpan = document.createElement('span');
        citySpan.classList.add('storage-list__seller-city');
        citySpan.textContent = seller[1].city;

        var nipSpan = document.createElement('span');
        nipSpan.classList.add('storage-list__seller-nip');
        nipSpan.textContent = seller[1].nip;

        li.appendChild(loadButton);
        li.appendChild(deleteButton);
        li.appendChild(nameSpan);
        li.appendChild(streetSpan);
        li.appendChild(citySpan);
        li.appendChild(nipSpan);

        DOMElements.storageList.appendChild(li);
      });
    } else {
      noLocalStorageDataInfo('Nie ma żadnych sprzedawców zapisanych w twojej przeglądarce.');
    }
  };

  var buildStorageBuyersList = function buildStorageBuyersList() {
    var localStorageBuyers = localStorage.getItem('buyers') ? JSON.parse(localStorage.getItem('buyers')) : {};
    if (Object.keys(localStorageBuyers).length > 0) {
      var buyers = Object.entries(localStorageBuyers);
      buyers.forEach(function (buyer) {
        var li = document.createElement('li');
        li.classList.add('storage-list__item');

        var loadButton = document.createElement('button');
        loadButton.classList.add('btn');
        loadButton.classList.add('btn--choose');
        loadButton.classList.add('btn--load-buyer');
        loadButton.dataset.buyerName = buyer[1].name;
        loadButton.textContent = 'Wybierz';

        var deleteButton = document.createElement('button');
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn--choose');
        deleteButton.classList.add('btn--delete-buyer');
        deleteButton.dataset.buyerName = buyer[1].name;
        deleteButton.textContent = 'Usuń';

        var nameSpan = document.createElement('span');
        nameSpan.classList.add('storage-list__buyer-name');
        nameSpan.textContent = buyer[1].name;

        var streetSpan = document.createElement('span');
        streetSpan.classList.add('storage-list__buyer-street');
        streetSpan.textContent = buyer[1].street;

        var citySpan = document.createElement('span');
        citySpan.classList.add('storage-list__buyer-city');
        citySpan.textContent = buyer[1].city;

        var nipSpan = document.createElement('span');
        nipSpan.classList.add('storage-list__buyer-nip');
        nipSpan.textContent = buyer[1].nip;

        li.appendChild(loadButton);
        li.appendChild(deleteButton);
        li.appendChild(nameSpan);
        li.appendChild(streetSpan);
        li.appendChild(citySpan);
        li.appendChild(nipSpan);

        DOMElements.storageList.appendChild(li);
      });
    } else {
      noLocalStorageDataInfo('Nie ma żadnych kontrahentów zapisanych w twojej przeglądarce.');
    }
  };

  var buildStorageSellerAccountsList = function buildStorageSellerAccountsList(accounts) {
    var localStorageAccounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : {};
    if (Object.keys(localStorageAccounts).length > 0) {
      var _accounts = Object.entries(localStorageAccounts);
      _accounts.forEach(function (account) {
        var li = document.createElement('li');
        li.classList.add('storage-list__item');

        var loadButton = document.createElement('button');
        loadButton.classList.add('btn');
        loadButton.classList.add('btn--choose');
        loadButton.classList.add('btn--load-account');
        loadButton.dataset.accountNumber = account[1].number;
        loadButton.textContent = 'Wybierz';

        var deleteButton = document.createElement('button');
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn--choose');
        deleteButton.classList.add('btn--delete-account');
        deleteButton.dataset.accountNumber = account[1].number;
        deleteButton.textContent = 'Usuń';

        var accountNumberSpan = document.createElement('span');
        accountNumberSpan.classList.add('storage-list__account-number');
        accountNumberSpan.textContent = 'Numer Konta: ' + account[1].number;

        li.appendChild(loadButton);
        li.appendChild(deleteButton);
        li.appendChild(accountNumberSpan);

        DOMElements.storageList.appendChild(li);
      });
    } else {
      noLocalStorageDataInfo('Nie ma żadnych numerów kont zapisanych w twojej przeglądarce.');
    }
  };

  var buildStorageItemsList = function buildStorageItemsList() {
    var localStorageItems = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : {};
    if (Object.keys(localStorageItems).length > 0) {
      var items = Object.entries(localStorageItems);
      items.forEach(function (item) {
        var li = document.createElement('li');
        li.classList.add('storage-list__item');

        var loadButton = document.createElement('button');
        loadButton.classList.add('btn');
        loadButton.classList.add('btn--choose');
        loadButton.classList.add('btn--load-item');
        loadButton.dataset.itemName = item[1].name;
        loadButton.textContent = 'Wybierz';

        var deleteButton = document.createElement('button');
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn--choose');
        deleteButton.classList.add('btn--delete-item');
        deleteButton.dataset.itemName = item[1].name;
        deleteButton.textContent = 'Usuń';

        var nameSpan = document.createElement('span');
        nameSpan.classList.add('storage-list__item-name');
        nameSpan.textContent = item[1].name;

        var priceSpan = document.createElement('span');
        priceSpan.classList.add('storage-list__item-price');
        priceSpan.textContent = item[1].netPrice + 'PLN/' + item[1].unit;

        var taxSpan = document.createElement('span');
        taxSpan.classList.add('storage-list__item-tax');
        taxSpan.textContent = item[1].taxRate + '%';

        var dateSpan = document.createElement('span');
        dateSpan.classList.add('storage-list__item-date');
        dateSpan.textContent = '(zapisano: ' + item[1].date + ')';

        li.appendChild(loadButton);
        li.appendChild(deleteButton);
        li.appendChild(nameSpan);
        li.appendChild(priceSpan);
        li.appendChild(taxSpan);
        li.appendChild(dateSpan);
        DOMElements.storageList.appendChild(li);
      });
    } else {
      noLocalStorageDataInfo('Nie ma żadnych produktów zapisanych w twojej przeglądarce.');
    }
  };

  var noLocalStorageDataInfo = function noLocalStorageDataInfo(message) {
    var noDataInfo = document.createElement('h3');
    noDataInfo.classList.add('storage-list__no-data-info');
    noDataInfo.textContent = message;

    DOMElements.storageList.appendChild(noDataInfo);
  };

  var hideListItem = function hideListItem(element) {
    element.addEventListener('transitionend', function (e) {
      console.log(e.propertyName);
      if (e.propertyName === 'opacity') {
        element.style.display = 'none';
      }
    });

    element.classList.add('fade-up');
  };
  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Revealed methods 
  ----------------------------------------------------*/
  return {
    DOMElements: DOMElements,
    displayDraftItemNotFilledInputs: displayDraftItemNotFilledInputs,
    clearDraftItemFieds: clearDraftItemFieds,
    rebuildDraftItemsTable: rebuildDraftItemsTable,
    addItemToDraftItemsList: addItemToDraftItemsList,
    generateDraftSumRow: generateDraftSumRow,
    buildDraftSumValues: buildDraftSumValues,
    generateInvoice: generateInvoice,
    generateInvoicePositions: generateInvoicePositions,
    showCompleteInfo: showCompleteInfo,
    activatePrintInvoice: activatePrintInvoice,
    closeStorageModal: closeStorageModal,
    openStorageModal: openStorageModal,
    hideBackdropModal: hideBackdropModal,
    displayBackdropModal: displayBackdropModal,
    fillInputForm: fillInputForm,
    buildStorageItemsList: buildStorageItemsList,
    buildStorageSellerAccountsList: buildStorageSellerAccountsList,
    buildStorageBuyersList: buildStorageBuyersList,
    buildStorageSellersList: buildStorageSellersList,
    noLocalStorageDataInfo: noLocalStorageDataInfo,
    hideListItem: hideListItem
  };
}();

/*-----------------------------------------------------
  Storage Controller 
  ----------------------------------------------------*/

var storageController = function () {
  var draftItemsData = {
    items: [],
    summaries: {
      total: 0,
      totalNetVal: 0,
      totalTaxVal: 0,
      taxRates: {
        tax23: {
          netValue: 0,
          taxValue: 0,
          taxTotal: 0
        },
        tax8: {
          netValue: 0,
          taxValue: 0,
          taxTotal: 0
        },
        tax5: {
          netValue: 0,
          taxValue: 0,
          taxTotal: 0
        },
        tax3: {
          netValue: 0,
          taxValue: 0,
          taxTotal: 0
        },
        tax0: {
          netValue: 0,
          taxValue: 0,
          taxTotal: 0
        }
      }
    }
  };

  var invoices = {
    invoice: {}
  };

  var DOMElements = uiController.DOMElements;

  var createInvoiceObj = function createInvoiceObj() {
    var invoice = {
      details: {
        document: {
          type: DOMElements.docTypeInp.value,
          number: DOMElements.docNumInp.value,
          place: DOMElements.docPlaceInp.value,
          date: DOMElements.docDateInp.value,
          sellDate: DOMElements.docSellDateInp.value
        },
        seller: {
          name: DOMElements.sellerNameInp.value,
          street: DOMElements.sellerStreetInp.value,
          city: DOMElements.sellerCityInp.value,
          postCode: DOMElements.sellerPostCodeInp.value,
          nip: DOMElements.sellerNipInp.value
        },
        buyer: {
          name: DOMElements.buyerNameInp.value,
          street: DOMElements.buyerStreetInp.value,
          city: DOMElements.buyerCityInp.value,
          postCode: DOMElements.buyerPostCodeInp.value,
          nip: DOMElements.buyerNipInp.value
        },
        payment: {
          toPay: draftItemsData.summaries.total,
          method: DOMElements.payMethodInp.value,
          term: DOMElements.payTermInp.value,
          account: DOMElements.payAccountInp.value
        }
      },
      positions: draftItemsData.items
    };
    invoices.invoice = invoice;
  };

  var deleteDraftItem = function deleteDraftItem(delID) {
    draftItemsData.items = draftItemsData.items.filter(function (item) {
      return item.id != delID;
    });
  };

  var createNewItem = function createNewItem(id) {
    var newItem = {
      // asigning values to newitem
      id: id,
      name: DOMElements.itemNameInp.value,
      unit: DOMElements.itemUnitInp.value,
      quantity: DOMElements.itemQuantInp.valueAsNumber,
      netPrice: DOMElements.itemPriceInp.valueAsNumber,
      taxRate: parseFloat(DOMElements.itemTaxRateInp.value),
      get netValue() {
        return this.netPrice * this.quantity;
      },
      get taxValue() {
        return this.netPrice * this.quantity * (this.taxRate / 100);
      },
      get total() {
        return this.netPrice * this.quantity + this.netPrice * this.quantity * (this.taxRate / 100);
      }
    };
    draftItemsData.items.push(newItem);
  };

  var calculateDraftItemsTotals = function calculateDraftItemsTotals() {
    var draftItemsTotal = draftItemsData.items.reduce(function (acc, item) {
      return acc + item.total;
    }, 0);
    var draftItemsTotalNetValue = draftItemsData.items.reduce(function (acc, item) {
      return acc + item.netValue;
    }, 0);
    var draftItemsTotalTaxValue = draftItemsData.items.reduce(function (acc, item) {
      return acc + item.taxValue;
    }, 0);

    draftItemsData.summaries.total = draftItemsTotal;
    draftItemsData.summaries.totalNetVal = draftItemsTotalNetValue;
    draftItemsData.summaries.totalTaxVal = draftItemsTotalTaxValue;
  };

  var claculateDraftTaxRatesValues = function claculateDraftTaxRatesValues(areTaxRateItems, checkingTaxRate) {
    if (areTaxRateItems) {
      var taxRateItemsArr = draftItemsData.items.filter(function (item) {
        return item.taxRate === checkingTaxRate;
      });
      var taxRateNetValue = taxRateItemsArr.reduce(function (acc, item) {
        return acc + item.netValue;
      }, 0);
      var taxRateTax = taxRateItemsArr.reduce(function (acc, item) {
        return acc + item.taxValue;
      }, 0);
      var taxRateTotal = taxRateItemsArr.reduce(function (acc, item) {
        return acc + item.total;
      }, 0);

      draftItemsData.summaries.taxRates['tax' + checkingTaxRate].taxValue = taxRateTax;
      draftItemsData.summaries.taxRates['tax' + checkingTaxRate].taxTotal = taxRateTotal;
      draftItemsData.summaries.taxRates['tax' + checkingTaxRate].netValue = taxRateNetValue;
    }
  };

  // creating vat rates summaries in storage controller and building summaries rows in draft items table
  var createDraftVatRatesValues = function createDraftVatRatesValues() {
    // boolean values for check if there are some products with specific tax rates
    var isTax00 = draftItemsData.items.some(function (item) {
      return item.taxRate === 0;
    });
    var isTax3 = draftItemsData.items.some(function (item) {
      return item.taxRate === 3;
    });
    var isTax5 = draftItemsData.items.some(function (item) {
      return item.taxRate === 5;
    });
    var isTax8 = draftItemsData.items.some(function (item) {
      return item.taxRate === 8;
    });
    var isTax23 = draftItemsData.items.some(function (item) {
      return item.taxRate === 23;
    });

    // calculate summary valuest for each vat rate
    claculateDraftTaxRatesValues(isTax00, 0);
    claculateDraftTaxRatesValues(isTax3, 3);
    claculateDraftTaxRatesValues(isTax5, 5);
    claculateDraftTaxRatesValues(isTax8, 8);
    claculateDraftTaxRatesValues(isTax23, 23);

    // create summary row for each existing vat rate
    uiController.generateDraftSumRow(isTax00, 0);
    uiController.generateDraftSumRow(isTax3, 3);
    uiController.generateDraftSumRow(isTax5, 5);
    uiController.generateDraftSumRow(isTax8, 8);
    uiController.generateDraftSumRow(isTax23, 23);
  };

  var saveSellerToLocal = function saveSellerToLocal(seller) {
    var sellers = {};
    if (localStorage.getItem('sellers')) {
      sellers = JSON.parse(localStorage.getItem('sellers'));
    }

    sellers[seller.name] = seller;

    localStorage.setItem('sellers', JSON.stringify(sellers));
  };

  var saveBuyerToLocal = function saveBuyerToLocal(buyer) {
    var buyers = {};
    if (localStorage.getItem('buyers')) {
      buyers = JSON.parse(localStorage.getItem('buyers'));
    }

    buyers[buyer.name] = buyer;

    localStorage.setItem('buyers', JSON.stringify(buyers));
  };

  var saveItemToLocal = function saveItemToLocal(item) {
    var items = {};
    if (localStorage.getItem('items')) {
      items = JSON.parse(localStorage.getItem('items'));
    }

    items[item.name] = item;

    localStorage.setItem('items', JSON.stringify(items));
  };
  var saveAccountToLocal = function saveAccountToLocal(account) {
    var accounts = {};
    if (localStorage.getItem('accounts')) {
      accounts = JSON.parse(localStorage.getItem('accounts'));
    }

    accounts[account.number] = account;

    localStorage.setItem('accounts', JSON.stringify(accounts));
  };

  var deleteSeller = function deleteSeller(sellerName) {
    var sellers = JSON.parse(localStorage.getItem('sellers'));
    delete sellers[sellerName];
    localStorage.setItem('sellers', JSON.stringify(sellers));
  };

  var deleteBuyer = function deleteBuyer(buyerName) {
    var buyers = JSON.parse(localStorage.getItem('buyers'));
    delete buyers[buyerName];
    localStorage.setItem('buyers', JSON.stringify(buyers));
  };

  var deleteAccount = function deleteAccount(account) {
    var accounts = JSON.parse(localStorage.getItem('accounts'));
    delete accounts[account];
    localStorage.setItem('accounts', JSON.stringify(accounts));
  };

  var deleteItem = function deleteItem(name) {
    var items = JSON.parse(localStorage.getItem('items'));
    delete items[name];
    localStorage.setItem('items', JSON.stringify(items));
  };

  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Revealed methods 
  ----------------------------------------------------*/
  return {
    invoices: invoices,
    draftItemsData: draftItemsData,
    createNewItem: createNewItem,
    deleteDraftItem: deleteDraftItem,
    createDraftVatRatesValues: createDraftVatRatesValues,
    createInvoiceObj: createInvoiceObj,
    calculateDraftItemsTotals: calculateDraftItemsTotals,
    saveSellerToLocal: saveSellerToLocal,
    saveBuyerToLocal: saveBuyerToLocal,
    saveItemToLocal: saveItemToLocal,
    saveAccountToLocal: saveAccountToLocal,
    deleteSeller: deleteSeller,
    deleteBuyer: deleteBuyer,
    deleteAccount: deleteAccount,
    deleteItem: deleteItem
  };
}();

/*-----------------------------------------------------
  App Controller
----------------------------------------------------*/

var appController = function (StorageCtrl, UiCtrl) {
  var DOMElements = UiCtrl.DOMElements;

  var loadEventListeners = function loadEventListeners() {
    // generate invoice event listener
    DOMElements.genBtn.addEventListener('click', generateInvoice);
    // event listeners for draft section
    DOMElements.addBtn.addEventListener('click', addItem);
    DOMElements.itemQuantInp.addEventListener('change', calculateDraftItem);
    DOMElements.itemPriceInp.addEventListener('change', calculateDraftItem);
    DOMElements.itemNetValInp.addEventListener('change', calculateDraftItem);
    DOMElements.itemTaxRateInp.addEventListener('change', calculateDraftItem);
    DOMElements.draftItemTable.addEventListener('click', deleteDraftItem);

    // event listeners for verification for inputs section
    DOMElements.dataInpuForm.addEventListener('keyup', verifyInputField);
    DOMElements.dataInpuForm.addEventListener('change', verifyInputField);
    DOMElements.draftItemConstructor.addEventListener('keyup', verifyDraftItemInput);

    DOMElements.payMethodInp.addEventListener('change', isBankAccountCheck);

    // local storage save and load listeners
    DOMElements.sellerSaveBtn.addEventListener('click', saveSeller);
    DOMElements.sellerLoadBtn.addEventListener('click', loadSeller);
    DOMElements.buyerSaveBtn.addEventListener('click', saveBuyer);
    DOMElements.buyerLoadTrigger.addEventListener('click', retrieveBuyers);
    DOMElements.accountSaveBtn.addEventListener('click', saveAccount);
    DOMElements.accountLoadBtn.addEventListener('click', retrieveAccounts);
    DOMElements.itemSaveBtn.addEventListener('click', saveItem);
    DOMElements.itemLoadTrigger.addEventListener('click', retrieveItems);
    DOMElements.storageListModalClose.addEventListener('click', UiCtrl.closeStorageModal);
    DOMElements.storageList.addEventListener('click', UiCtrl.fillInputForm);
    DOMElements.storageList.addEventListener('click', deleteLocalStorageEntry);
  };

  // initialization function
  var init = function init() {
    loadEventListeners();
  };

  var isBankAccountCheck = function isBankAccountCheck(e) {
    if (e.target.value === 'gotówka' || e.target.value === 'czek') {
      DOMElements.payAccountInp.parentElement.style.display = 'none';
      DOMElements.payAccountInp.setAttribute('disabled', true);
      DOMElements.payAccountInp.value = '';
    } else {
      DOMElements.payAccountInp.parentElement.style.display = 'flex';
      DOMElements.payAccountInp.removeAttribute('disabled');
    }
  };

  var verifyInputField = function verifyInputField(e) {
    if (e.target === DOMElements.sellerPostCodeInp || e.target === DOMElements.buyerPostCodeInp) {
      validationFunctions.validatePostCode(e);
    } else if (e.target === DOMElements.sellerNipInp || e.target === DOMElements.buyerNipInp) {
      validationFunctions.validateNip(e);
    } else if (e.target === DOMElements.payAccountInp) {
      if (DOMElements.payMethodInp.value !== 'gotówka' || DOMElements.payMethodInp.value !== 'pobranie') {
        validationFunctions.validateAccount(e);
      }
    } else {
      validationFunctions.validateFillInFormInput(e);
    }
  };

  var verifyDraftItemInput = function verifyDraftItemInput(e) {
    validationFunctions.validateDraftItemInputs(e);
  };

  var verifyCompletedForm = function verifyCompletedForm() {
    var inputs = Array.from(DOMElements.dataInpuForm.getElementsByClassName('input'));

    // If payment method is 'gotówka' cuts this field from inputs array to not validate ir
    if (DOMElements.payMethodInp.value === 'gotówka') {
      inputs = inputs.filter(function (item) {
        return item.classList.contains('payment__account') === false;
      });
    }
    if (inputs.some(function (input) {
      return input.value === '' || input.value === ' ';
    })) {
      inputs.filter(function (input) {
        return input.value === '' || input.value === ' ';
      }).forEach(function (input) {
        return input.classList.add('invalid');
      });
      return false;
    } else {
      return true;
    }
  };

  // validation functions object
  var validationFunctions = {
    validatePostCode: function validatePostCode(e) {
      var reg = /^\d\d-\d\d\d$/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add('invalid');
      } else {
        e.target.classList.remove('invalid');
      }
    },
    validateNip: function validateNip(e) {
      var reg = /^\d{3}[- ]?\d{3}[- ]?\d\d[- ]?\d\d\s?$/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add('invalid');
      } else {
        e.target.classList.remove('invalid');
      }
    },
    validateAccount: function validateAccount(e) {
      var reg = /^([A-Za-z]{2})?[ ]?\d{2}([ ]?\d{4}){6}\s?$/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add('invalid');
      } else {
        e.target.classList.remove('invalid');
      }
    },
    validateFillInFormInput: function validateFillInFormInput(e) {
      var reg = /[A-Za-z\d]+/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add('invalid');
      } else {
        e.target.classList.remove('invalid');
      }
    },
    validateDraftItemInputs: function validateDraftItemInputs(e) {
      if (DOMElements.itemNameInp.value !== '' && DOMElements.itemNameInp.value !== '' && DOMElements.itemQuantInp.value !== '' && DOMElements.itemPriceInp.value !== '') {
        DOMElements.addBtn.disabled = false;
      } else {
        DOMElements.addBtn.disabled = true;
      }
    }
  };

  var addItem = function addItem() {
    var newItemId = (0, _uuid.v4)();
    storageController.createNewItem(newItemId);
    storageController.calculateDraftItemsTotals();
    UiCtrl.clearDraftItemFieds();
    UiCtrl.addItemToDraftItemsList(newItemId);
    StorageCtrl.createDraftVatRatesValues();
    UiCtrl.buildDraftSumValues();
    storageController.createDraftVatRatesValues();
    DOMElements.addBtn.disabled = true;
  };

  var calculateDraftItem = function calculateDraftItem() {
    // calculate and display not filled draft input values and placing it's values as input value
    UiCtrl.displayDraftItemNotFilledInputs();
  };

  var deleteDraftItem = function deleteDraftItem(e) {
    if (e.target.classList.contains('btn--item-del')) {
      // determine id of target item
      var delID = e.target.parentElement.parentElement.dataset.identifier;
      // delete item from storage array by given id
      StorageCtrl.deleteDraftItem(delID);
      // recalculate invoice totals
      StorageCtrl.calculateDraftItemsTotals();
      // rebuild draft items table
      UiCtrl.rebuildDraftItemsTable();
      // check existing on draft items vat rates
      StorageCtrl.createDraftVatRatesValues();
      // rebuild vat summareis table by vat rate for draft items
      UiCtrl.buildDraftSumValues();
    }
  };

  // function for generate new invoice object
  var generateInvoice = function generateInvoice() {
    var verified = verifyCompletedForm();
    if (verified) {
      // create invoice object in storage
      StorageCtrl.createInvoiceObj();
      // generating invoice document
      UiCtrl.generateInvoice();
      // generate invoice positions from draft items
      UiCtrl.generateInvoicePositions(StorageCtrl.invoices.invoice.positions);
      // Activate print invoice button
      UiCtrl.activatePrintInvoice();
    } else {
      uiController.showCompleteInfo();
    }
  };

  var saveSeller = function saveSeller(e) {
    e.preventDefault();

    var seller = {
      name: DOMElements.sellerNameInp.value,
      street: DOMElements.sellerStreetInp.value,
      city: DOMElements.sellerCityInp.value,
      postCode: DOMElements.sellerPostCodeInp.value,
      nip: DOMElements.sellerNipInp.value
    };
    StorageCtrl.saveSellerToLocal(seller);
  };

  var loadSeller = function loadSeller(e) {
    e.preventDefault();

    UiCtrl.openStorageModal();
    UiCtrl.buildStorageSellersList();
  };

  var saveBuyer = function saveBuyer(e) {
    e.preventDefault();

    var buyer = {
      name: DOMElements.buyerNameInp.value,
      street: DOMElements.buyerStreetInp.value,
      city: DOMElements.buyerCityInp.value,
      postCode: DOMElements.buyerPostCodeInp.value,
      nip: DOMElements.buyerNipInp.value
    };
    StorageCtrl.saveBuyerToLocal(buyer);
  };

  var retrieveBuyers = function retrieveBuyers(e) {
    e.preventDefault();
    UiCtrl.openStorageModal();
    UiCtrl.buildStorageBuyersList();
  };

  var saveAccount = function saveAccount(e) {
    e.preventDefault();

    var account = {
      number: DOMElements.payAccountInp.value
    };
    StorageCtrl.saveAccountToLocal(account);
  };

  var retrieveAccounts = function retrieveAccounts(e) {
    e.preventDefault();

    UiCtrl.openStorageModal();
    UiCtrl.buildStorageSellerAccountsList();
  };

  var saveItem = function saveItem(e) {
    e.preventDefault();

    var now = new Date();
    var createdDate = now.getUTCFullYear() + '/' + (now.getUTCMonth() + 1) + '/' + now.getUTCDate();

    var item = {
      name: DOMElements.itemNameInp.value,
      unit: DOMElements.itemUnitInp.value,
      netPrice: DOMElements.itemPriceInp.valueAsNumber,
      taxRate: parseFloat(DOMElements.itemTaxRateInp.value),
      date: createdDate
    };
    StorageCtrl.saveItemToLocal(item);
  };

  var retrieveItems = function retrieveItems(e) {
    e.preventDefault();

    UiCtrl.openStorageModal();
    UiCtrl.buildStorageItemsList();
  };

  var deleteLocalStorageEntry = function deleteLocalStorageEntry(e) {
    e.preventDefault();
    var targetClasses = e.target.classList;
    if (targetClasses.contains('btn--delete-seller')) {
      StorageCtrl.deleteSeller(e.target.dataset.sellerName);
      UiCtrl.hideListItem(e.target.parentElement);
    }
    if (targetClasses.contains('btn--delete-buyer')) {
      StorageCtrl.deleteBuyer(e.target.dataset.buyerName);
      UiCtrl.hideListItem(e.target.parentElement);
    }
    if (targetClasses.contains('btn--delete-account')) {
      StorageCtrl.deleteAccount(e.target.dataset.accountNumber);
      UiCtrl.hideListItem(e.target.parentElement);
    }
    if (targetClasses.contains('btn--delete-item')) {
      StorageCtrl.deleteItem(e.target.dataset.itemName);
      UiCtrl.hideListItem(e.target.parentElement);
    }
  };

  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Revealed methods 
  ----------------------------------------------------*/
  return {
    init: init
  };
}(storageController, uiController);

appController.init();

// print js script for printing - dependiency - jquery
$('.btn--print-inv').on('click', function () {
  $('.invoice').printThis();
});
},{"./printThis":"src/js/printThis.js","uuid":"node_modules/uuid/index.js","../sass/main.scss":"src/sass/main.scss"}],"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '43845' + '/');
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
},{}]},{},["../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/js/main.js"], null)
//# sourceMappingURL=/main.88f0c403.map