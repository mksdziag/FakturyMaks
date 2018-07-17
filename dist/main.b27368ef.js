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
})({"node_modules/uuid/lib/rng-browser.js":[function(require,module,exports) {
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

},{"./v1":"node_modules/uuid/v1.js","./v4":"node_modules/uuid/v4.js"}],"js/main.js":[function(require,module,exports) {
"use strict";

var _uuid = require("uuid");

var uiController = function () {
  // defining DOM elements
  var DOMElements = {
    // -------------------------------------------------------
    // Invoice details input elements
    // -------------------------------------------------------
    dataInpuForm: document.querySelector(".data-form"),
    // document data inputs
    docTypeInp: document.querySelector(".data__doc-type"),
    docNumInp: document.querySelector(".data__doc-number"),
    docPlaceInp: document.querySelector(".data__doc-place"),
    docDateInp: document.querySelector(".data__doc-date"),
    docSellDateInp: document.querySelector(".data__doc-sell-date"),
    // seller data inputs
    sellerNameInp: document.querySelector(".data__seller-name"),
    sellerStreetInp: document.querySelector(".data__seller-street"),
    sellerCityInp: document.querySelector(".data__seller-city"),
    sellerPostCodeInp: document.querySelector(".data__seller-post-code"),
    sellerNipInp: document.querySelector(".data__seller-nip"),
    // buyer data inputs
    buyerNameInp: document.querySelector(".data__buyer-name"),
    buyerStreetInp: document.querySelector(".data__buyer-street"),
    buyerCityInp: document.querySelector(".data__buyer-city"),
    buyerPostCodeInp: document.querySelector(".data__buyer-post-code"),
    buyerNipInp: document.querySelector(".data__buyer-nip"),
    // payment terms inputs
    payMethodInp: document.querySelector(".payment__method"),
    payTermInp: document.querySelector(".payment__term"),
    payAccountInp: document.querySelector(".payment__account"),
    // draft positions inputs
    itemNameInp: document.querySelector(".draft-item__name"),
    itemUnitInp: document.querySelector(".draft-item__unit"),
    itemQuantInp: document.querySelector(".draft-item__quantity"),
    itemPriceInp: document.querySelector(".draft-item__price"),
    itemNetValInp: document.querySelector(".draft-item__net-value"),
    itemTaxRateInp: document.querySelector(".draft-item__tax-rate"),
    itemTaxValInp: document.querySelector(".draft-item__tax-value"),
    itemTotValInp: document.querySelector(".draft-item__total-value"),
    // draft add button
    addBtn: document.querySelector(".btn--add-item"),
    // draft itens table
    draftItemConstructor: document.querySelector(".draft-item__constructor"),
    draftItemTable: document.querySelector(".draft-added-items"),
    drawtSumTable: document.querySelector(".draft__summary"),
    itemDelBtn: document.querySelectorAll(".btn--item-del"),
    // button generate invoice
    genBtn: document.querySelector(".btn--gen-inv"),
    printBtn: document.querySelector(".btn--print-inv"),

    // -------------------------------------------------------
    //output invoice elements
    // -------------------------------------------------------
    invoice: document.querySelector(".invoice"),
    // invoice heading
    invType: document.querySelector(".invoice__type"),
    invNum: document.querySelector(".invoice__number"),
    invPlace: document.querySelector(".invoice__place"),
    invSellDate: document.querySelector(".invoice__sell-date"),
    invDate: document.querySelector(".invoice__place-date"),
    // invoice seller details
    invSellerName: document.querySelector(".invoice__seller-name"),
    invSellerStr: document.querySelector(".invoice__seller-street"),
    invSellerCity: document.querySelector(".invoice__seller-city"),
    invSellerPostCode: document.querySelector(".seller__post-code"),
    invSellerNip: document.querySelector(".invoice__seller-nip"),
    // invoice buyer details
    invBuyerName: document.querySelector(".invoice__buyer-name"),
    invBuyerStr: document.querySelector(".invoice__buyer-street"),
    invBuyerCity: document.querySelector(".invoice__buyer-city"),
    invBuyerPostCode: document.querySelector(".buyer__post-code"),
    invBuyerNip: document.querySelector(".invoice__buyer-nip"),
    // Invoice positions items table
    invoicePositionsTable: document.querySelector(".invoice__positions-place"),
    invoicePositionsTableSum: document.querySelector(".invoice__positions-summary"),
    // invoice final details
    invFinalToPay: document.querySelector(".invoice__final-to-pay"),
    invFinalPayMethod: document.querySelector(".invoice__final-payment-method"),
    invFinalPayTerm: document.querySelector(".invoice__final-payment-term"),
    invFinalAccount: document.querySelector(".invoice__final-payment__account")
  };

  // calculating draft item taxes in draft item constructor form
  var calculateDraftItemNotFilledInputs = function calculateDraftItemNotFilledInputs() {
    // if there is fullfilled draft item quantity and net price can calculate:
    if (DOMElements.itemQuantInp.value !== "" && DOMElements.itemPriceInp.value !== "") {
      // net value ptoduct price * quantity
      DOMElements.itemNetValInp.value = (DOMElements.itemPriceInp.valueAsNumber * DOMElements.itemQuantInp.valueAsNumber).toFixed(2);
      // tax value
      DOMElements.itemTaxValInp.value = (DOMElements.itemQuantInp.valueAsNumber * DOMElements.itemPriceInp.valueAsNumber * parseFloat(DOMElements.itemTaxRateInp.value / 100)).toFixed(2);
      // item total price
      DOMElements.itemTotValInp.value = DOMElements.itemNetValInp.valueAsNumber + DOMElements.itemTaxValInp.valueAsNumber;
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
    var newRow = document.createElement("tr");
    newRow.classList.add("draft__position");
    newRow.id = "draft-item-" + item.id;
    newRow.dataset.identifier = "" + item.id;
    newRow.innerHTML = "\n      <td class=\"draft__item-delete\"><button class=\"btn btn--item-del\">usu\u0144</button></td>\n      <td class=\"draft__item-name\">" + item.name + "</td>\n      <td class=\"draft__item-unit\">" + item.unit + "</td>\n      <td class=\"draft__item-quantity\">" + item.quantity.toFixed(2) + "</td>\n      <td class=\"draft__item-price\">" + item.netPrice.toFixed(2) + "</td>\n      <td class=\"draft__item-net-value\">" + item.netValue.toFixed(2) + "</td>\n      <td class=\"draft__item-tax-rate\">" + item.taxRate + "%</td>\n      <td class=\"draft__item-tax-value\">" + item.taxValue.toFixed(2) + "</td>\n      <td class=\"draft__item-total-value\">" + item.total.toFixed(2) + "</td>";
    DOMElements.draftItemTable.appendChild(newRow);
  };

  // helper function for cleat innner HTML in given element
  var clearInnerHtml = function clearInnerHtml(elem) {
    elem.innerHTML = "";
  };

  // building draft items table from start
  var rebuildDraftItemsTable = function rebuildDraftItemsTable() {
    clearInnerHtml(DOMElements.draftItemTable);
    // for each drafted item perform same action
    storageController.draftItemsData.items.forEach(function (item) {
      // create newtable row
      var newRow = document.createElement("tr");
      newRow.classList.add("draft__position");
      newRow.id = "draft-item-" + item.id;
      newRow.dataset.identifier = "" + item.id;
      newRow.innerHTML = "\n      <td class=\"draft__item-delete\"><button class=\"btn btn--item-del\">usu\u0144</button></td>\n      <td class=\"draft__item-name\">" + item.name + "</td>\n      <td class=\"draft__item-unit\">" + item.unit + "</td>\n      <td class=\"draft__item-quantity\">" + item.quantity.toFixed(2) + "</td>\n      <td class=\"draft__item-price\">" + item.netPrice.toFixed(2) + "</td>\n      <td class=\"draft__item-net-value\">" + item.netValue.toFixed(2) + "</td>\n      <td class=\"draft__item-tax-rate\">" + item.taxRate + "%</td>\n      <td class=\"draft__item-tax-value\">" + item.taxValue.toFixed(2) + "</td>\n      <td class=\"draft__item-total-value\">" + item.total.toFixed(2) + "</td>";
      DOMElements.draftItemTable.appendChild(newRow);
    });
  };

  // building draft sum values in draft table
  var buildDraftSumValues = function buildDraftSumValues() {
    // remove all content from summary draft table
    clearInnerHtml(DOMElements.drawtSumTable);

    var draftSumRow = document.createElement("tr");
    draftSumRow.classList.add("draft__summary-row");
    draftSumRow.innerHTML = "\n    <th colspan=\"5\" class=\"draft__summary-legend\">Razem:</th>\n    <th class=\"draft__summary-net-value\">" + storageController.draftItemsData.summaries.totalNetVal.toFixed(2) + "</th>\n    <th class=\"\"></th>\n    <th class=\"draft__summary-vat-value\">" + storageController.draftItemsData.summaries.totalTaxVal.toFixed(2) + "</th>\n    <th class=\"draft__summary-total\">" + storageController.draftItemsData.summaries.total.toFixed(2) + "</th>";
    DOMElements.drawtSumTable.appendChild(draftSumRow);
  };

  var generateDraftSumRow = function generateDraftSumRow(areTaxRateItems, checkingTaxRate) {
    var checkedTaxRate = storageController.draftItemsData.summaries.taxRates["tax" + checkingTaxRate];
    if (areTaxRateItems) {
      var taxRatefinalRow = document.createElement("tr");
      taxRatefinalRow.classList.add("draft__summary-row");
      taxRatefinalRow.innerHTML = "\n      <td colspan=\"5\" class=\"draft__summary-legend\">W tym:</td>\n      <td class=\"draft__summary-net-value\">" + checkedTaxRate.netValue.toFixed(2) + "</td>\n      <td class=\"\">" + checkingTaxRate + "%</td>\n      <td class=\"draft__summary-vat-value\">" + checkedTaxRate.taxValue.toFixed(2) + "</td>\n      <td class=\"draft__summary-total\">" + checkedTaxRate.taxTotal.toFixed(2) + "</td>";
      DOMElements.drawtSumTable.appendChild(taxRatefinalRow);
    }
  };

  var generateInvoice = function generateInvoice() {
    var invoiceObj = storageController.invoicesData.invoice.details;
    // inserting details of the invoice
    DOMElements.invType.textContent = "" + invoiceObj.document.type;
    DOMElements.invNum.textContent = "nr " + invoiceObj.document.number;
    DOMElements.invPlace.textContent = "Miejsce wystawienia: " + invoiceObj.document.place;
    DOMElements.invDate.textContent = "Data wystawienia: " + invoiceObj.document.date;
    DOMElements.invSellDate.textContent = "Data sprzeda\u017Cy: " + invoiceObj.document.sellDate;
    DOMElements.invSellerName.textContent = "" + invoiceObj.seller.name;
    DOMElements.invSellerStr.textContent = "" + invoiceObj.seller.street;
    DOMElements.invSellerCity.textContent = "" + invoiceObj.seller.city;
    DOMElements.invSellerPostCode.textContent = "" + invoiceObj.seller.postCode;
    DOMElements.invSellerNip.textContent = "NIP: " + invoiceObj.seller.nip;
    DOMElements.invBuyerName.textContent = "" + invoiceObj.buyer.name;
    DOMElements.invBuyerStr.textContent = "" + invoiceObj.buyer.street;
    DOMElements.invBuyerCity.textContent = "" + invoiceObj.buyer.city;
    DOMElements.invBuyerPostCode.textContent = "" + invoiceObj.buyer.postCode;
    DOMElements.invBuyerNip.textContent = "NIP: " + invoiceObj.buyer.nip;
    DOMElements.invFinalToPay.textContent = "Do zap\u0142aty: " + invoiceObj.payment.toPay.toFixed(2) + " PLN";
    DOMElements.invFinalPayMethod.textContent = "Spos\xF3b p\u0142atno\u015Bci: " + invoiceObj.payment.method;
    DOMElements.invFinalPayTerm.textContent = "Termin p\u0142atno\u015Bci: " + invoiceObj.payment.term;
    // print account number if choosen method is different than cash
    if (invoiceObj.payment.method !== "gotówka") {
      DOMElements.invFinalAccount.textContent = "Konto: " + invoiceObj.payment.account;
    } else {
      DOMElements.invFinalAccount.textContent = "";
    }
  };

  var generateInvoicePositions = function generateInvoicePositions(positionsArray) {
    clearInnerHtml(DOMElements.invoicePositionsTable);
    clearInnerHtml(DOMElements.invoicePositionsTableSum);

    positionsArray.forEach(function (item) {
      var newRow = document.createElement("tr");
      newRow.classList.add("invoice__position");
      newRow.id = "invoice-item" + item.id;
      newRow.dataset.identifier = "" + item.id;
      newRow.innerHTML = "\n          <td class=\"invoice__item-lp\">" + (positionsArray.indexOf(item) + 1) + "</td>\n          <td class=\"invoice__item-name\">" + item.name + "</td>\n          <td class=\"invoice__item-unit\">" + item.unit + "</td>\n          <td class=\"invoice__item-quantity\">" + item.quantity.toFixed(2) + "</td>\n          <td class=\"invoice__item-price\">" + item.netPrice.toFixed(2) + "</td>\n          <td class=\"invoice__item-net-value\">" + item.netValue.toFixed(2) + "</td>\n          <td class=\"invoice__item-tax-rate\">" + item.taxRate.toFixed(2) + "</td>\n          <td class=\"invoice__item-tax-value\">" + item.taxValue.toFixed(2) + "</td>\n          <td class=\"invoice__item-total-value\">" + item.total.toFixed(2) + "</td>";
      DOMElements.invoicePositionsTable.appendChild(newRow);
    });

    // invoice items summaries from draft items summaries section
    var totalNetVal = storageController.draftItemsData.summaries.totalNetVal;
    var totalTaxVal = storageController.draftItemsData.summaries.totalTaxVal;
    var total = storageController.draftItemsData.summaries.total;

    var invoiceSumRow = document.createElement("tr");
    invoiceSumRow.classList.add("invoice__summary-row");
    invoiceSumRow.innerHTML = "\n    <th colspan=\"5\" class=\"invoice__summary-legend\">Razem:</th>\n    <th class=\"invoice__summary-net-value\">" + totalNetVal.toFixed(2) + "</th>\n    <th class=\"\"></th>\n    <th class=\"invoice__summary-vat-value\">" + totalTaxVal.toFixed(2) + "</th>\n    <th class=\"invoice__summary-total\">" + total.toFixed(2) + "</th>";
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
    var checkedTaxRate = storageController.draftItemsData.summaries.taxRates["tax" + checkingTaxRate];
    if (isTaxRate) {
      var vatRatefinalrow = document.createElement("tr");
      vatRatefinalrow.classList.add("invoice__summary-row");
      vatRatefinalrow.innerHTML = "\n        <td colspan=\"5\" class=\"invoice__summary-legend\">W tym:</td>\n        <td class=\"invoice__summary-net-value\">" + checkedTaxRate.netValue.toFixed(2) + "</td>\n        <td class=\"\">" + checkingTaxRate + "%</td>\n        <td class=\"invoice__summary-vat-value\">" + checkedTaxRate.taxValue.toFixed(2) + "</td>\n        <td class=\"invoice__summary-total\">" + checkedTaxRate.taxTotal.toFixed(2) + "</td>";
      DOMElements.invoicePositionsTable.appendChild(vatRatefinalrow);
    }
  };

  // showing modal complete
  var showCompleteInfo = function showCompleteInfo() {
    document.querySelector(".not-completed-form-modal").classList.add("visible");
    setTimeout(hidemodal, 2500);

    function hidemodal() {
      document.querySelector(".not-completed-form-modal").classList.remove("visible");
    }
  };

  var activatePrintInvoice = function activatePrintInvoice() {
    DOMElements.printBtn.removeAttribute("disabled");
  };

  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Revealed methods 
  ----------------------------------------------------*/
  return {
    DOMElements: DOMElements,
    calculateDraftItemNotFilledInputs: calculateDraftItemNotFilledInputs,
    clearDraftItemFieds: clearDraftItemFieds,
    rebuildDraftItemsTable: rebuildDraftItemsTable,
    addItemToDraftItemsList: addItemToDraftItemsList,
    generateDraftSumRow: generateDraftSumRow,
    buildDraftSumValues: buildDraftSumValues,
    generateInvoice: generateInvoice,
    generateInvoicePositions: generateInvoicePositions,
    showCompleteInfo: showCompleteInfo,
    activatePrintInvoice: activatePrintInvoice
  };
}();

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

  var invoicesData = {
    invoice: {}
  };

  var DOM = uiController.DOMElements;

  var createInvoiceObj = function createInvoiceObj() {
    var invoice = {
      details: {
        document: {
          type: DOM.docTypeInp.value,
          number: DOM.docNumInp.value,
          place: DOM.docPlaceInp.value,
          date: DOM.docDateInp.value,
          sellDate: DOM.docSellDateInp.value
        },
        seller: {
          name: DOM.sellerNameInp.value,
          street: DOM.sellerStreetInp.value,
          city: DOM.sellerCityInp.value,
          postCode: DOM.sellerPostCodeInp.value,
          nip: DOM.sellerNipInp.value
        },
        buyer: {
          name: DOM.buyerNameInp.value,
          street: DOM.buyerStreetInp.value,
          city: DOM.buyerCityInp.value,
          postCode: DOM.buyerPostCodeInp.value,
          nip: DOM.buyerNipInp.value
        },
        payment: {
          toPay: draftItemsData.summaries.total,
          method: DOM.payMethodInp.value,
          term: DOM.payTermInp.value,
          account: DOM.payAccountInp.value
        }
      },
      positions: draftItemsData.items
    };
    invoicesData.invoice = invoice;
  };

  var deleteDraftItem = function deleteDraftItem(delID) {
    console.log(delID);
    draftItemsData.items = draftItemsData.items.filter(function (item) {
      return item.id != delID;
    });
    console.log(draftItemsData);
  };

  var createNewItem = function createNewItem(id) {
    var newItem = {
      // asigning values to newitem
      id: id,
      name: DOM.itemNameInp.value,
      unit: DOM.itemUnitInp.value,
      quantity: DOM.itemQuantInp.valueAsNumber,
      netPrice: DOM.itemPriceInp.valueAsNumber,
      netValue: DOM.itemNetValInp.valueAsNumber,
      taxRate: parseFloat(DOM.itemTaxRateInp.value),
      taxValue: DOM.itemTaxValInp.valueAsNumber,
      total: DOM.itemTotValInp.valueAsNumber
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

      draftItemsData.summaries.taxRates["tax" + checkingTaxRate].taxValue = taxRateTax;
      draftItemsData.summaries.taxRates["tax" + checkingTaxRate].taxTotal = taxRateTotal;
      draftItemsData.summaries.taxRates["tax" + checkingTaxRate].netValue = taxRateNetValue;
    } else {
      return;
    }
  };

  // creating vat rates summaries in storage controller and building summaries rows in draft items table
  var createDraftVatRatesValues = function createDraftVatRatesValues() {
    // boolean values for check if there are some products with specific tax rates
    var areThere00 = draftItemsData.items.some(function (item) {
      return item.taxRate === 0;
    });
    var areThere3 = draftItemsData.items.some(function (item) {
      return item.taxRate === 3;
    });
    var areThere5 = draftItemsData.items.some(function (item) {
      return item.taxRate === 5;
    });
    var areThere8 = draftItemsData.items.some(function (item) {
      return item.taxRate === 8;
    });
    var areThere23 = draftItemsData.items.some(function (item) {
      return item.taxRate === 23;
    });

    // calculate summary valuest for each vat rate
    claculateDraftTaxRatesValues(areThere23, 23);
    claculateDraftTaxRatesValues(areThere8, 8);
    claculateDraftTaxRatesValues(areThere5, 5);
    claculateDraftTaxRatesValues(areThere3, 3);
    claculateDraftTaxRatesValues(areThere00, 0);

    // create summary row for each existing vat rate
    uiController.generateDraftSumRow(areThere23, 23);
    uiController.generateDraftSumRow(areThere8, 8);
    uiController.generateDraftSumRow(areThere5, 5);
    uiController.generateDraftSumRow(areThere3, 3);
    uiController.generateDraftSumRow(areThere00, 0);
  };

  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Revealed methods 
  ----------------------------------------------------*/
  return {
    invoicesData: invoicesData,
    draftItemsData: draftItemsData,
    createNewItem: createNewItem,
    deleteDraftItem: deleteDraftItem,
    createDraftVatRatesValues: createDraftVatRatesValues,
    createInvoiceObj: createInvoiceObj,
    calculateDraftItemsTotals: calculateDraftItemsTotals
  };
}();

var appController = function (StorageCtrl, UiCtrl) {
  var DOM = UiCtrl.DOMElements;

  var loadEventListeners = function loadEventListeners() {
    // generate invoice event listener
    DOM.genBtn.addEventListener("click", generateInvoice);
    // event listeners for draft section
    DOM.addBtn.addEventListener("click", addItem);
    DOM.itemQuantInp.addEventListener("change", calculateDraftItem);
    DOM.itemPriceInp.addEventListener("change", calculateDraftItem);
    DOM.itemNetValInp.addEventListener("change", calculateDraftItem);
    DOM.itemTaxRateInp.addEventListener("change", calculateDraftItem);
    DOM.draftItemTable.addEventListener("click", deleteDraftItem);

    // event listeners for verification for inputs section
    DOM.dataInpuForm.addEventListener("keyup", verifyInputField);
    DOM.dataInpuForm.addEventListener("change", verifyInputField);
    DOM.draftItemConstructor.addEventListener("keyup", verifyDraftItemInput);

    DOM.payMethodInp.addEventListener("change", willBeAccount);
  };

  // initialization function
  var init = function init() {
    loadEventListeners();
  };
  var willBeAccount = function willBeAccount(e) {
    if (e.target.value === "gotówka") {
      DOM.payAccountInp.parentElement.style.display = "none";
      DOM.payAccountInp.setAttribute("disabled", true);
      DOM.payAccountInp.value = "";
    } else {
      DOM.payAccountInp.parentElement.style.display = "flex";
      DOM.payAccountInp.removeAttribute("disabled");
    }
  };

  var verifyInputField = function verifyInputField(e) {
    if (e.target === DOM.sellerPostCodeInp || e.target === DOM.buyerPostCodeInp) {
      validationFunctions.validatePostCode(e);
    } else if (e.target === DOM.sellerNipInp || e.target === DOM.buyerNipInp) {
      validationFunctions.validateNip(e);
    } else if (e.target === DOM.payAccountInp) {
      if (DOM.payMethodInp.value === "gotówka" || DOM.payMethodInp.value === "pobranie") {
        return;
      } else {
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
    var inputs = Array.from(document.querySelector(".data-form").getElementsByClassName("input"));

    // opisać że moijamy payment account gdy wybrana forma płatności to gotówka
    if (DOM.payMethodInp.value === "gotówka") {
      inputs = inputs.filter(function (item) {
        return item.classList.contains("payment__account") === false;
      });
    }
    if (inputs.some(function (input) {
      return input.value === "" || input.value === " ";
    })) {
      inputs.filter(function (input) {
        return input.value === "" || input.value === " ";
      }).forEach(function (input) {
        return input.classList.add("invalid");
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
        e.target.classList.add("invalid");
      } else {
        e.target.classList.remove("invalid");
      }
    },
    validateNip: function validateNip(e) {
      var reg = /^\d{3}[- ]?\d{3}[- ]?\d\d[- ]?\d\d\s?$/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add("invalid");
      } else {
        e.target.classList.remove("invalid");
      }
    },
    validateAccount: function validateAccount(e) {
      var reg = /^([A-Za-z]{2})?[ ]?\d{2}([ ]?\d{4}){6}\s?$/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add("invalid");
      } else {
        e.target.classList.remove("invalid");
      }
    },
    validateFillInFormInput: function validateFillInFormInput(e) {
      reg = /[A-Za-z\d]+/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add("invalid");
      } else {
        e.target.classList.remove("invalid");
      }
    },
    validateDraftItemInputs: function validateDraftItemInputs(e) {
      if (DOM.itemNameInp.value !== "" && DOM.itemNameInp.value !== " " && DOM.itemQuantInp.value !== "" && DOM.itemPriceInp.value !== "") {
        DOM.addBtn.disabled = false;
      } else {
        DOM.addBtn.disabled = true;
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
    DOM.addBtn.disabled = true;
  };

  var calculateDraftItem = function calculateDraftItem() {
    // calculate not filled draft input values and placing its values in input
    UiCtrl.calculateDraftItemNotFilledInputs();
  };

  var deleteDraftItem = function deleteDraftItem(e) {
    if (e.target.classList.contains("btn--item-del")) {
      // determine id of target item
      var delID = e.target.parentElement.parentElement.dataset.identifier;
      // delete item from storage array by given id
      StorageCtrl.deleteDraftItem(delID);
      // recalculate invoice totals
      storageController.calculateDraftItemsTotals();
      // rebuild draft items table
      UiCtrl.rebuildDraftItemsTable();
      // check existing on draft items vat rates
      StorageCtrl.createDraftVatRatesValues();
      // rebuild vat summareis table by vat rate for draft items
      UiCtrl.buildDraftSumValues();
    } else {
      return;
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
      UiCtrl.generateInvoicePositions(StorageCtrl.invoicesData.invoice.positions);
      // Activate print invoice button
      UiCtrl.activatePrintInvoice();
    } else {
      uiController.showCompleteInfo();
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

// print js script for printing
$(".btn--print-inv").on("click", function () {
  $(".invoice").printThis();
});
},{"uuid":"node_modules/uuid/index.js"}],"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '32941' + '/');
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
},{}]},{},["../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.b27368ef.map