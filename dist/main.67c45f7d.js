parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"ogM3":[function(require,module,exports) {
var e="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(e){var o=new Uint8Array(16);module.exports=function(){return e(o),o}}else{var r=new Array(16);module.exports=function(){for(var e,o=0;o<16;o++)0==(3&o)&&(e=4294967296*Math.random()),r[o]=e>>>((3&o)<<3)&255;return r}}
},{}],"O4sp":[function(require,module,exports) {
for(var r=[],o=0;o<256;++o)r[o]=(o+256).toString(16).substr(1);function t(o,t){var n=t||0,u=r;return[u[o[n++]],u[o[n++]],u[o[n++]],u[o[n++]],"-",u[o[n++]],u[o[n++]],"-",u[o[n++]],u[o[n++]],"-",u[o[n++]],u[o[n++]],"-",u[o[n++]],u[o[n++]],u[o[n++]],u[o[n++]],u[o[n++]],u[o[n++]]].join("")}module.exports=t;
},{}],"acME":[function(require,module,exports) {
var e,r,o=require("./lib/rng"),s=require("./lib/bytesToUuid"),i=0,n=0;function c(c,l,u){var v=l&&u||0,a=l||[],d=(c=c||{}).node||e,t=void 0!==c.clockseq?c.clockseq:r;if(null==d||null==t){var m=o();null==d&&(d=e=[1|m[0],m[1],m[2],m[3],m[4],m[5]]),null==t&&(t=r=16383&(m[6]<<8|m[7]))}var q=void 0!==c.msecs?c.msecs:(new Date).getTime(),f=void 0!==c.nsecs?c.nsecs:n+1,b=q-i+(f-n)/1e4;if(b<0&&void 0===c.clockseq&&(t=t+1&16383),(b<0||q>i)&&void 0===c.nsecs&&(f=0),f>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");i=q,n=f,r=t;var k=(1e4*(268435455&(q+=122192928e5))+f)%4294967296;a[v++]=k>>>24&255,a[v++]=k>>>16&255,a[v++]=k>>>8&255,a[v++]=255&k;var w=q/4294967296*1e4&268435455;a[v++]=w>>>8&255,a[v++]=255&w,a[v++]=w>>>24&15|16,a[v++]=w>>>16&255,a[v++]=t>>>8|128,a[v++]=255&t;for(var g=0;g<6;++g)a[v+g]=d[g];return l||s(a)}module.exports=c;
},{"./lib/rng":"ogM3","./lib/bytesToUuid":"O4sp"}],"37UO":[function(require,module,exports) {
var r=require("./lib/rng"),n=require("./lib/bytesToUuid");function e(e,i,u){var a=i&&u||0;"string"==typeof e&&(i="binary"===e?new Array(16):null,e=null);var l=(e=e||{}).random||(e.rng||r)();if(l[6]=15&l[6]|64,l[8]=63&l[8]|128,i)for(var o=0;o<16;++o)i[a+o]=l[o];return i||n(l)}module.exports=e;
},{"./lib/rng":"ogM3","./lib/bytesToUuid":"O4sp"}],"gV9a":[function(require,module,exports) {
var e=require("./v1"),r=require("./v4"),v=r;v.v1=e,v.v4=r,module.exports=v;
},{"./v1":"acME","./v4":"37UO"}],"clu1":[function(require,module,exports) {

},{}],"d6sW":[function(require,module,exports) {
"use strict";var e=require("uuid");require("../sass/main.scss");var t=function(){var e={dataInpuForm:document.querySelector(".data-form"),docTypeInp:document.querySelector(".data__doc-type"),docNumInp:document.querySelector(".data__doc-number"),docPlaceInp:document.querySelector(".data__doc-place"),docDateInp:document.querySelector(".data__doc-date"),docSellDateInp:document.querySelector(".data__doc-sell-date"),sellerNameInp:document.querySelector(".data__seller-name"),sellerStreetInp:document.querySelector(".data__seller-street"),sellerCityInp:document.querySelector(".data__seller-city"),sellerPostCodeInp:document.querySelector(".data__seller-post-code"),sellerNipInp:document.querySelector(".data__seller-nip"),sellerSaveBtn:document.querySelector(".btn--seller-save"),sellerLoadBtn:document.querySelector(".btn--seller-load"),buyerNameInp:document.querySelector(".data__buyer-name"),buyerStreetInp:document.querySelector(".data__buyer-street"),buyerCityInp:document.querySelector(".data__buyer-city"),buyerPostCodeInp:document.querySelector(".data__buyer-post-code"),buyerNipInp:document.querySelector(".data__buyer-nip"),buyerSaveBtn:document.querySelector(".btn--buyer-save"),buyerLoadTrigger:document.querySelector(".btn--buyer-load"),payMethodInp:document.querySelector(".payment__method"),payTermInp:document.querySelector(".payment__term"),payAccountInp:document.querySelector(".payment__account"),accountSaveBtn:document.querySelector(".btn--account-save"),accountLoadBtn:document.querySelector(".btn--account-load"),itemNameInp:document.querySelector(".draft-item__name"),itemUnitInp:document.querySelector(".draft-item__unit"),itemQuantInp:document.querySelector(".draft-item__quantity"),itemPriceInp:document.querySelector(".draft-item__price"),itemNetValInp:document.querySelector(".draft-item__net-value"),itemTaxRateInp:document.querySelector(".draft-item__tax-rate"),itemTaxValInp:document.querySelector(".draft-item__tax-value"),itemTotValInp:document.querySelector(".draft-item__total-value"),itemSaveBtn:document.querySelector(".btn--item-save"),itemLoadTrigger:document.querySelector(".btn--item-load"),storageListModalClose:document.querySelector(".btn--close-storage-list"),addBtn:document.querySelector(".btn--add-item"),draftItemConstructor:document.querySelector(".draft-item__constructor"),draftItemTable:document.querySelector(".draft-added-items"),drawtSumTable:document.querySelector(".draft__summary"),itemDelBtn:document.querySelectorAll(".btn--item-del"),storageList:document.querySelector(".storage-list"),storageListModal:document.querySelector(".storage-list__modal"),storageListBackdrop:document.querySelector(".storage-list__backdrop"),genBtn:document.querySelector(".btn--gen-inv"),printBtn:document.querySelector(".btn--print-inv"),invoice:document.querySelector(".invoice"),invType:document.querySelector(".invoice__type"),invNum:document.querySelector(".invoice__number"),invPlace:document.querySelector(".invoice__place"),invSellDate:document.querySelector(".invoice__sell-date"),invDate:document.querySelector(".invoice__place-date"),invSellerName:document.querySelector(".invoice__seller-name"),invSellerStr:document.querySelector(".invoice__seller-street"),invSellerCity:document.querySelector(".invoice__seller-city"),invSellerPostCode:document.querySelector(".seller__post-code"),invSellerNip:document.querySelector(".invoice__seller-nip"),invBuyerName:document.querySelector(".invoice__buyer-name"),invBuyerStr:document.querySelector(".invoice__buyer-street"),invBuyerCity:document.querySelector(".invoice__buyer-city"),invBuyerPostCode:document.querySelector(".buyer__post-code"),invBuyerNip:document.querySelector(".invoice__buyer-nip"),invoicePositionsTable:document.querySelector(".invoice__positions-place"),invoicePositionsTableSum:document.querySelector(".invoice__positions-summary"),invFinalToPay:document.querySelector(".invoice__final-to-pay"),invFinalPayMethod:document.querySelector(".invoice__final-payment-method"),invFinalPayTerm:document.querySelector(".invoice__final-payment-term"),invFinalAccount:document.querySelector(".invoice__final-payment__account")},t=function(e){e.innerHTML=""},n=function(t,n){var i=a.draftItemsData.summaries.taxRates["tax"+n];if(t){var r=document.createElement("tr");r.classList.add("invoice__summary-row"),r.innerHTML='\n        <td colspan="6" class="invoice__summary-legend">W tym:</td>\n        <td class="invoice__summary-net-value">'+i.netValue.toFixed(2)+'</td>\n        <td class="">'+n+'%</td>\n        <td class="invoice__summary-vat-value">'+i.taxValue.toFixed(2)+'</td>\n        <td class="invoice__summary-total">'+i.taxTotal.toFixed(2)+"</td>",e.invoicePositionsTable.appendChild(r)}},i=function(){e.storageListModal.classList.remove("modal-active"),setTimeout(function(){e.storageListModal.style.display="none"},250),r(),e.storageList.innerHTML=""},r=function(){e.storageListBackdrop.classList.remove("backdrop-active"),setTimeout(function(){e.storageListBackdrop.style="display: none"},250)},o=function(){e.storageListBackdrop.style="display: block",setTimeout(function(){e.storageListBackdrop.classList.add("backdrop-active")},10)},l=function(t){var a=document.createElement("h3");a.classList.add("storage-list__no-data-info"),a.textContent=t,e.storageList.appendChild(a)};return{DOMElements:e,displayDraftItemNotFilledInputs:function(){""!==e.itemQuantInp.value&&""!==e.itemPriceInp.value&&(e.itemNetValInp.value=(e.itemPriceInp.valueAsNumber*e.itemQuantInp.valueAsNumber).toFixed(2),e.itemTaxValInp.value=(e.itemQuantInp.valueAsNumber*e.itemPriceInp.valueAsNumber*parseFloat(e.itemTaxRateInp.value/100)).toFixed(2),e.itemTotValInp.value=(e.itemNetValInp.valueAsNumber+e.itemTaxValInp.valueAsNumber).toFixed(2),e.itemTotalPriceInp.value=(e.itemPriceInp.valueAsNumber+e.itemPriceInp.valueAsNumber*parseFloat(e.itemTaxRateInp.value/100)).toFixed(2))},clearDraftItemFieds:function(){e.draftItemConstructor.reset(),e.itemNameInp.focus()},rebuildDraftItemsTable:function(){t(e.draftItemTable),a.draftItemsData.items.forEach(function(t){var a=document.createElement("tr");a.classList.add("draft__position"),a.id="draft-item-"+t.id,a.dataset.identifier=""+t.id,a.innerHTML='\n      <td class="draft__item-delete"><button class="btn btn--item-del">usuń</button></td>\n      <td class="draft__item-name">'+t.name+'</td>\n      <td class="draft__item-unit">'+t.unit+'</td>\n      <td class="draft__item-quantity">'+t.quantity.toFixed(2)+'</td>\n      <td class="draft__item-price">'+t.netPrice.toFixed(2)+'</td>\n      <td class="draft__item-net-value">'+t.netValue.toFixed(2)+'</td>\n      <td class="draft__item-tax-rate">'+t.taxRate+'%</td>\n      <td class="draft__item-tax-value">'+t.taxValue.toFixed(2)+'</td>\n      <td class="draft__item-total-value">'+t.total.toFixed(2)+"</td>",e.draftItemTable.appendChild(a)})},addItemToDraftItemsList:function(t){var n=a.draftItemsData.items.find(function(e){return e.id===t}),i=document.createElement("tr");i.classList.add("draft__position"),i.id="draft-item-"+n.id,i.dataset.identifier=""+n.id,i.innerHTML='\n      <td class="draft__item-delete"><button class="btn btn--item-del">usuń</button></td>\n      <td class="draft__item-name">'+n.name+'</td>\n      <td class="draft__item-unit">'+n.unit+'</td>\n      <td class="draft__item-quantity">'+n.quantity.toFixed(2)+'</td>\n      <td class="draft__item-price">'+n.netPrice.toFixed(2)+'</td>\n      <td class="draft__item-net-value">'+n.netValue.toFixed(2)+'</td>\n      <td class="draft__item-tax-rate">'+n.taxRate+'%</td>\n      <td class="draft__item-tax-value">'+n.taxValue.toFixed(2)+'</td>\n      <td class="draft__item-total-value">'+n.total.toFixed(2)+"</td>",e.draftItemTable.appendChild(i)},generateDraftSumRow:function(t,n){var i=a.draftItemsData.summaries.taxRates["tax"+n];if(t){var r=document.createElement("tr");r.classList.add("draft__summary-row"),r.innerHTML='\n      <td colspan="5" class="draft__summary-legend">W tym:</td>\n      <td class="draft__summary-net-value">'+i.netValue.toFixed(2)+'</td>\n      <td class="">'+n+'%</td>\n      <td class="draft__summary-vat-value">'+i.taxValue.toFixed(2)+'</td>\n      <td class="draft__summary-total">'+i.taxTotal.toFixed(2)+"</td>",e.drawtSumTable.appendChild(r)}},buildDraftSumValues:function(){t(e.drawtSumTable);var n=document.createElement("tr");n.classList.add("draft__summary-row"),n.innerHTML='\n    <th colspan="5" class="draft__summary-legend">Razem:</th>\n    <th class="draft__summary-net-value">'+a.draftItemsData.summaries.totalNetVal.toFixed(2)+'</th>\n    <th class=""></th>\n    <th class="draft__summary-vat-value">'+a.draftItemsData.summaries.totalTaxVal.toFixed(2)+'</th>\n    <th class="draft__summary-total">'+a.draftItemsData.summaries.total.toFixed(2)+"</th>",e.drawtSumTable.appendChild(n)},generateInvoice:function(){var t=a.invoices.invoice.details;e.invType.textContent=""+t.document.type,e.invNum.textContent="nr "+t.document.number,e.invPlace.textContent="Miejsce wystawienia: "+t.document.place,e.invDate.textContent="Data wystawienia: "+t.document.date,e.invSellDate.textContent="Data sprzedaży: "+t.document.sellDate,e.invSellerName.textContent=""+t.seller.name,e.invSellerStr.textContent=""+t.seller.street,e.invSellerCity.textContent=""+t.seller.city,e.invSellerPostCode.textContent=""+t.seller.postCode,e.invSellerNip.textContent="NIP: "+t.seller.nip,e.invBuyerName.textContent=""+t.buyer.name,e.invBuyerStr.textContent=""+t.buyer.street,e.invBuyerCity.textContent=""+t.buyer.city,e.invBuyerPostCode.textContent=""+t.buyer.postCode,e.invBuyerNip.textContent="NIP: "+t.buyer.nip,e.invFinalToPay.textContent="Do zapłaty: "+t.payment.toPay.toFixed(2)+" PLN",e.invFinalPayMethod.textContent="Sposób płatności: "+t.payment.method,e.invFinalPayTerm.textContent="Termin płatności: "+t.payment.term,"gotówka"!==t.payment.method?e.invFinalAccount.textContent="Konto: "+t.payment.account:e.invFinalAccount.textContent=""},generateInvoicePositions:function(i){t(e.invoicePositionsTable),t(e.invoicePositionsTableSum),i.forEach(function(t){var a=document.createElement("tr");a.classList.add("invoice__position"),a.id="invoice-item"+t.id,a.dataset.identifier=""+t.id,a.innerHTML='\n          <td class="invoice__item-lp">'+(i.indexOf(t)+1)+'</td>\n          <td class="invoice__item-name">'+t.name+'</td>\n          <td class="invoice__item-unit">'+t.unit+'</td>\n          <td class="invoice__item-currency">PLN</td>\n          <td class="invoice__item-quantity">'+t.quantity.toFixed(2)+'</td>\n          <td class="invoice__item-price">'+t.netPrice.toFixed(2)+'</td>\n          <td class="invoice__item-net-value">'+t.netValue.toFixed(2)+'</td>\n          <td class="invoice__item-tax-rate">'+t.taxRate+'%</td>\n          <td class="invoice__item-tax-value">'+t.taxValue.toFixed(2)+'</td>\n          <td class="invoice__item-total-value">'+t.total.toFixed(2)+"</td>",e.invoicePositionsTable.appendChild(a)});var r=a.draftItemsData.summaries.totalNetVal,o=a.draftItemsData.summaries.totalTaxVal,l=a.draftItemsData.summaries.total,s=document.createElement("tr");s.classList.add("invoice__summary-row"),s.innerHTML='\n    <th colspan="6" class="invoice__summary-legend">Razem:</th>\n    <th class="invoice__summary-net-value">'+r.toFixed(2)+'</th>\n    <th class=""></th>\n    <th class="invoice__summary-vat-value">'+o.toFixed(2)+'</th>\n    <th class="invoice__summary-total">'+l.toFixed(2)+"</th>",e.invoicePositionsTable.appendChild(s);var c=i.some(function(e){return 23===e.taxRate}),d=i.some(function(e){return 8===e.taxRate}),u=i.some(function(e){return 5===e.taxRate}),m=i.some(function(e){return 3===e.taxRate}),p=i.some(function(e){return 0===e.taxRate});n(c,23),n(d,8),n(u,5),n(m,3),n(p,0)},showCompleteInfo:function(){var e=document.querySelector(".not-completed-form-modal");e.style.display="block",setTimeout(function(){return e.classList.add("completion-modal-active")},10),setTimeout(function(){e.classList.remove("completion-modal-active"),setTimeout(function(){return e.style.display="none"},250)},3e3)},activatePrintInvoice:function(){e.printBtn.removeAttribute("disabled")},closeStorageModal:i,openStorageModal:function(){o(),e.storageListModal.style.display="block",setTimeout(function(){e.storageListModal.classList.add("modal-active")},10)},hideBackdropModal:r,displayBackdropModal:o,fillInputForm:function(t){if(t.target.classList.contains("btn--load-item")){console.log(t.target.dataset.itemName);var a=JSON.parse(localStorage.getItem("items"))[t.target.dataset.itemName];e.itemNameInp.value=a.name,e.itemUnitInp.value=a.unit,e.itemPriceInp.value=a.netPrice,e.itemTaxRateInp.value=a.taxRate,i(),e.itemQuantInp.focus()}if(t.target.classList.contains("btn--load-seller")){var n=JSON.parse(localStorage.getItem("sellers"))[t.target.dataset.sellerName];e.sellerNameInp.value=n.name,e.sellerStreetInp.value=n.street,e.sellerCityInp.value=n.city,e.sellerPostCodeInp.value=n.postCode,e.sellerNipInp.value=n.nip,i()}if(t.target.classList.contains("btn--load-buyer")){var r=JSON.parse(localStorage.getItem("buyers"))[t.target.dataset.buyerName];e.buyerNameInp.value=r.name,e.buyerStreetInp.value=r.street,e.buyerCityInp.value=r.city,e.buyerPostCodeInp.value=r.postCode,e.buyerNipInp.value=r.nip,i()}if(t.target.classList.contains("btn--load-account")){var o=JSON.parse(localStorage.getItem("accounts"))[t.target.dataset.accountNumber];e.payAccountInp.value=o.number,i()}},buildStorageItemsList:function(){if(localStorage.getItem("items")){var t=JSON.parse(localStorage.getItem("items"));Object.entries(t).forEach(function(t){var a=document.createElement("li");a.classList.add("storage-list__item");var n=document.createElement("button");n.classList.add("btn"),n.classList.add("btn--choose"),n.classList.add("btn--load-item"),n.dataset.itemName=t[1].name,n.textContent="Wybierz";var i=document.createElement("button");i.classList.add("btn"),i.classList.add("btn--choose"),i.classList.add("btn--delete-item"),i.dataset.itemName=t[1].name,i.textContent="Usuń";var r=document.createElement("span");r.classList.add("storage-list__item-name"),r.textContent=t[1].name;var o=document.createElement("span");o.classList.add("storage-list__item-price"),o.textContent=t[1].netPrice+"PLN/"+t[1].unit;var l=document.createElement("span");l.classList.add("storage-list__item-tax"),l.textContent=t[1].taxRate+"%";var s=document.createElement("span");s.classList.add("storage-list__item-date"),s.textContent="(zapisano: "+t[1].date+")",a.appendChild(n),a.appendChild(i),a.appendChild(r),a.appendChild(o),a.appendChild(l),a.appendChild(s),e.storageList.appendChild(a)})}else l("Nie ma żadnych produktów zapisanych w twojej przeglądarce.")},buildStorageSellerAccountsList:function(t){if(localStorage.getItem("accounts")){var a=JSON.parse(localStorage.getItem("accounts"));Object.entries(a).forEach(function(t){var a=document.createElement("li");a.classList.add("storage-list__item");var n=document.createElement("button");n.classList.add("btn"),n.classList.add("btn--choose"),n.classList.add("btn--load-account"),n.dataset.accountNumber=t[1].number,n.textContent="Wybierz";var i=document.createElement("button");i.classList.add("btn"),i.classList.add("btn--choose"),i.classList.add("btn--delete-account"),i.dataset.accountNumber=t[1].number,i.textContent="Usuń";var r=document.createElement("span");r.classList.add("storage-list__account-number"),r.textContent="Numer Konta: "+t[1].number,a.appendChild(n),a.appendChild(i),a.appendChild(r),e.storageList.appendChild(a)})}else l("Nie ma żadnych numerów kont zapisanych w twojej przeglądarce.")},buildStorageBuyersList:function(){var t=JSON.parse(localStorage.getItem("buyers"));Object.keys(t).length>0?Object.entries(t).forEach(function(t){var a=document.createElement("li");a.classList.add("storage-list__item");var n=document.createElement("button");n.classList.add("btn"),n.classList.add("btn--choose"),n.classList.add("btn--load-buyer"),n.dataset.buyerName=t[1].name,n.textContent="Wybierz";var i=document.createElement("button");i.classList.add("btn"),i.classList.add("btn--choose"),i.classList.add("btn--delete-buyer"),i.dataset.buyerName=t[1].name,i.textContent="Usuń";var r=document.createElement("span");r.classList.add("storage-list__buyer-name"),r.textContent=t[1].name;var o=document.createElement("span");o.classList.add("storage-list__buyer-street"),o.textContent=t[1].street;var l=document.createElement("span");l.classList.add("storage-list__buyer-city"),l.textContent=t[1].city;var s=document.createElement("span");s.classList.add("storage-list__buyer-nip"),s.textContent=t[1].nip,a.appendChild(n),a.appendChild(i),a.appendChild(r),a.appendChild(o),a.appendChild(l),a.appendChild(s),e.storageList.appendChild(a)}):l("Nie ma żadnych kontrahentów zapisanych w twojej przeglądarce.")},buildStorageSellersList:function(){var t=JSON.parse(localStorage.getItem("sellers"));Object.keys(t).length>0?Object.entries(t).forEach(function(t){var a=document.createElement("li");a.classList.add("storage-list__item");var n=document.createElement("button");n.classList.add("btn"),n.classList.add("btn--choose"),n.classList.add("btn--load-seller"),n.dataset.sellerName=t[1].name,n.textContent="Wybierz";var i=document.createElement("button");i.classList.add("btn"),i.classList.add("btn--choose"),i.classList.add("btn--delete-seller"),i.dataset.sellerName=t[1].name,i.textContent="Usuń";var r=document.createElement("span");r.classList.add("storage-list__seller-name"),r.textContent=t[1].name;var o=document.createElement("span");o.classList.add("storage-list__seller-street"),o.textContent=t[1].street;var l=document.createElement("span");l.classList.add("storage-list__seller-city"),l.textContent=t[1].city;var s=document.createElement("span");s.classList.add("storage-list__seller-nip"),s.textContent=t[1].nip,a.appendChild(n),a.appendChild(i),a.appendChild(r),a.appendChild(o),a.appendChild(l),a.appendChild(s),e.storageList.appendChild(a)}):l("Nie ma żadnych sprzedawców zapisanych w twojej przeglądarce.")},noLocalStorageDataInfo:l,hideListItem:function(e){e.addEventListener("transitionend",function(t){console.log(t.propertyName),"opacity"===t.propertyName&&(e.style.display="none")}),e.classList.add("fade-up")}}}(),a=function(){var e={items:[],summaries:{total:0,totalNetVal:0,totalTaxVal:0,taxRates:{tax23:{netValue:0,taxValue:0,taxTotal:0},tax8:{netValue:0,taxValue:0,taxTotal:0},tax5:{netValue:0,taxValue:0,taxTotal:0},tax3:{netValue:0,taxValue:0,taxTotal:0},tax0:{netValue:0,taxValue:0,taxTotal:0}}}},a={invoice:{}},n=t.DOMElements,i=function(t,a){if(t){var n=e.items.filter(function(e){return e.taxRate===a}),i=n.reduce(function(e,t){return e+t.netValue},0),r=n.reduce(function(e,t){return e+t.taxValue},0),o=n.reduce(function(e,t){return e+t.total},0);e.summaries.taxRates["tax"+a].taxValue=r,e.summaries.taxRates["tax"+a].taxTotal=o,e.summaries.taxRates["tax"+a].netValue=i}};return{invoices:a,draftItemsData:e,createNewItem:function(t){var a={id:t,name:n.itemNameInp.value,unit:n.itemUnitInp.value,quantity:n.itemQuantInp.valueAsNumber,netPrice:n.itemPriceInp.valueAsNumber,taxRate:parseFloat(n.itemTaxRateInp.value),get netValue(){return this.netPrice*this.quantity},get taxValue(){return this.netPrice*this.quantity*(this.taxRate/100)},get total(){return this.netPrice*this.quantity+this.netPrice*this.quantity*(this.taxRate/100)}};e.items.push(a)},deleteDraftItem:function(t){e.items=e.items.filter(function(e){return e.id!=t})},createDraftVatRatesValues:function(){var a=e.items.some(function(e){return 0===e.taxRate}),n=e.items.some(function(e){return 3===e.taxRate}),r=e.items.some(function(e){return 5===e.taxRate}),o=e.items.some(function(e){return 8===e.taxRate}),l=e.items.some(function(e){return 23===e.taxRate});i(a,0),i(n,3),i(r,5),i(o,8),i(l,23),t.generateDraftSumRow(a,0),t.generateDraftSumRow(n,3),t.generateDraftSumRow(r,5),t.generateDraftSumRow(o,8),t.generateDraftSumRow(l,23)},createInvoiceObj:function(){var t={details:{document:{type:n.docTypeInp.value,number:n.docNumInp.value,place:n.docPlaceInp.value,date:n.docDateInp.value,sellDate:n.docSellDateInp.value},seller:{name:n.sellerNameInp.value,street:n.sellerStreetInp.value,city:n.sellerCityInp.value,postCode:n.sellerPostCodeInp.value,nip:n.sellerNipInp.value},buyer:{name:n.buyerNameInp.value,street:n.buyerStreetInp.value,city:n.buyerCityInp.value,postCode:n.buyerPostCodeInp.value,nip:n.buyerNipInp.value},payment:{toPay:e.summaries.total,method:n.payMethodInp.value,term:n.payTermInp.value,account:n.payAccountInp.value}},positions:e.items};a.invoice=t},calculateDraftItemsTotals:function(){var t=e.items.reduce(function(e,t){return e+t.total},0),a=e.items.reduce(function(e,t){return e+t.netValue},0),n=e.items.reduce(function(e,t){return e+t.taxValue},0);e.summaries.total=t,e.summaries.totalNetVal=a,e.summaries.totalTaxVal=n},saveSellerToLocal:function(e){var t={};localStorage.getItem("sellers")&&(t=JSON.parse(localStorage.getItem("sellers"))),t[e.name]=e,localStorage.setItem("sellers",JSON.stringify(t))},saveBuyerToLocal:function(e){var t={};localStorage.getItem("buyers")&&(t=JSON.parse(localStorage.getItem("buyers"))),t[e.name]=e,localStorage.setItem("buyers",JSON.stringify(t))},saveItemToLocal:function(e){var t={};localStorage.getItem("items")&&(t=JSON.parse(localStorage.getItem("items"))),t[e.name]=e,localStorage.setItem("items",JSON.stringify(t))},saveAccountToLocal:function(e){var t={};localStorage.getItem("accounts")&&(t=JSON.parse(localStorage.getItem("accounts"))),t[e.number]=e,localStorage.setItem("accounts",JSON.stringify(t))},deleteSeller:function(e){var t=JSON.parse(localStorage.getItem("sellers"));delete t[e],localStorage.setItem("sellers",JSON.stringify(t))},deleteBuyer:function(e){var t=JSON.parse(localStorage.getItem("buyers"));delete t[e],localStorage.setItem("buyers",JSON.stringify(t))},deleteAccount:function(e){var t=JSON.parse(localStorage.getItem("accounts"));delete t[e],localStorage.setItem("accounts",JSON.stringify(t))},deleteItem:function(e){var t=JSON.parse(localStorage.getItem("items"));console.log(t[e]),delete t[e],console.log(t),localStorage.setItem("items",JSON.stringify(t))}}}(),n=function(n,i){var r=i.DOMElements,o=function(e){"gotówka"===e.target.value||"czek"===e.target.value?(r.payAccountInp.parentElement.style.display="none",r.payAccountInp.setAttribute("disabled",!0),r.payAccountInp.value=""):(r.payAccountInp.parentElement.style.display="flex",r.payAccountInp.removeAttribute("disabled"))},l=function(e){e.target===r.sellerPostCodeInp||e.target===r.buyerPostCodeInp?c.validatePostCode(e):e.target===r.sellerNipInp||e.target===r.buyerNipInp?c.validateNip(e):e.target===r.payAccountInp?"gotówka"===r.payMethodInp.value&&"pobranie"===r.payMethodInp.value||c.validateAccount(e):c.validateFillInFormInput(e)},s=function(e){c.validateDraftItemInputs(e)},c={validatePostCode:function(e){/^\d\d-\d\d\d$/.test(e.target.value)?e.target.classList.remove("invalid"):e.target.classList.add("invalid")},validateNip:function(e){/^\d{3}[- ]?\d{3}[- ]?\d\d[- ]?\d\d\s?$/.test(e.target.value)?e.target.classList.remove("invalid"):e.target.classList.add("invalid")},validateAccount:function(e){/^([A-Za-z]{2})?[ ]?\d{2}([ ]?\d{4}){6}\s?$/.test(e.target.value)?e.target.classList.remove("invalid"):e.target.classList.add("invalid")},validateFillInFormInput:function(e){/[A-Za-z\d]+/.test(e.target.value)?e.target.classList.remove("invalid"):e.target.classList.add("invalid")},validateDraftItemInputs:function(e){""!==r.itemNameInp.value&&""!==r.itemNameInp.value&&""!==r.itemQuantInp.value&&""!==r.itemPriceInp.value?r.addBtn.disabled=!1:r.addBtn.disabled=!0}},d=function(){var t=(0,e.v4)();a.createNewItem(t),a.calculateDraftItemsTotals(),i.clearDraftItemFieds(),i.addItemToDraftItemsList(t),n.createDraftVatRatesValues(),i.buildDraftSumValues(),a.createDraftVatRatesValues(),r.addBtn.disabled=!0},u=function(){i.displayDraftItemNotFilledInputs()},m=function(e){if(e.target.classList.contains("btn--item-del")){var t=e.target.parentElement.parentElement.dataset.identifier;n.deleteDraftItem(t),n.calculateDraftItemsTotals(),i.rebuildDraftItemsTable(),n.createDraftVatRatesValues(),i.buildDraftSumValues()}},p=function(){var e;(e=Array.from(r.dataInpuForm.getElementsByClassName("input")),"gotówka"===r.payMethodInp.value&&(e=e.filter(function(e){return!1===e.classList.contains("payment__account")})),!e.some(function(e){return""===e.value||" "===e.value})||(e.filter(function(e){return""===e.value||" "===e.value}).forEach(function(e){return e.classList.add("invalid")}),!1))?(n.createInvoiceObj(),i.generateInvoice(),i.generateInvoicePositions(n.invoices.invoice.positions),i.activatePrintInvoice()):t.showCompleteInfo()},v=function(e){e.preventDefault();var t={name:r.sellerNameInp.value,street:r.sellerStreetInp.value,city:r.sellerCityInp.value,postCode:r.sellerPostCodeInp.value,nip:r.sellerNipInp.value};n.saveSellerToLocal(t)},y=function(e){e.preventDefault(),i.openStorageModal(),i.buildStorageSellersList()},f=function(e){e.preventDefault();var t={name:r.buyerNameInp.value,street:r.buyerStreetInp.value,city:r.buyerCityInp.value,postCode:r.buyerPostCodeInp.value,nip:r.buyerNipInp.value};n.saveBuyerToLocal(t)},_=function(e){e.preventDefault(),i.openStorageModal(),i.buildStorageBuyersList()},I=function(e){e.preventDefault();var t={number:r.payAccountInp.value};n.saveAccountToLocal(t)},b=function(e){e.preventDefault(),i.openStorageModal(),i.buildStorageSellerAccountsList()},g=function(e){e.preventDefault();var t=new Date,a=t.getUTCFullYear()+"/"+(t.getUTCMonth()+1)+"/"+t.getUTCDate(),i={name:r.itemNameInp.value,unit:r.itemUnitInp.value,netPrice:r.itemPriceInp.valueAsNumber,taxRate:parseFloat(r.itemTaxRateInp.value),date:a};n.saveItemToLocal(i)},S=function(e){e.preventDefault(),i.openStorageModal(),i.buildStorageItemsList()},L=function(e){e.preventDefault();var t=e.target.classList;t.contains("btn--delete-seller")&&(n.deleteSeller(e.target.dataset.sellerName),i.hideListItem(e.target.parentElement)),t.contains("btn--delete-buyer")&&(n.deleteBuyer(e.target.dataset.buyerName),i.hideListItem(e.target.parentElement)),t.contains("btn--delete-account")&&(n.deleteAccount(e.target.dataset.accountNumber),i.hideListItem(e.target.parentElement)),t.contains("btn--delete-item")&&(console.log(e.target.dataset.itemName),n.deleteItem(e.target.dataset.itemName),i.hideListItem(e.target.parentElement))};return{init:function(){r.genBtn.addEventListener("click",p),r.addBtn.addEventListener("click",d),r.itemQuantInp.addEventListener("change",u),r.itemPriceInp.addEventListener("change",u),r.itemNetValInp.addEventListener("change",u),r.itemTaxRateInp.addEventListener("change",u),r.draftItemTable.addEventListener("click",m),r.dataInpuForm.addEventListener("keyup",l),r.dataInpuForm.addEventListener("change",l),r.draftItemConstructor.addEventListener("keyup",s),r.payMethodInp.addEventListener("change",o),r.sellerSaveBtn.addEventListener("click",v),r.sellerLoadBtn.addEventListener("click",y),r.buyerSaveBtn.addEventListener("click",f),r.buyerLoadTrigger.addEventListener("click",_),r.accountSaveBtn.addEventListener("click",I),r.accountLoadBtn.addEventListener("click",b),r.itemSaveBtn.addEventListener("click",g),r.itemLoadTrigger.addEventListener("click",S),r.storageListModalClose.addEventListener("click",i.closeStorageModal),r.storageList.addEventListener("click",i.fillInputForm),r.storageList.addEventListener("click",L)}}}(a,t);n.init(),$(".btn--print-inv").on("click",function(){$(".invoice").printThis()});
},{"uuid":"gV9a","../sass/main.scss":"clu1"}]},{},["d6sW"], null)
//# sourceMappingURL=/main.67c45f7d.map