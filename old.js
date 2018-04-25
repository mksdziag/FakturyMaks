// // DOM input elements
// // document data inputs
// const docTypeInp = document.querySelector('.data__doc-type');
// const docNumInp = document.querySelector('.data__doc-number');
// const docPlaceInp = document.querySelector('.data__doc-place');
// const docDateInp = document.querySelector('.data__doc-date');
// const docSellDateInp = document.querySelector('.data__doc-sell-date');
// // seller data inputs
// const sellerNameInp = document.querySelector('.data__seller-name');
// const sellerStreetInp = document.querySelector('.data__seller-street');
// const sellerCityInp = document.querySelector('.data__seller-city');
// const sellerPostCodeInp = document.querySelector('.data__seller-post-code');
// const sellerNipInp = document.querySelector('.data__seller-nip');
// // buyer data inputs
// const buyerNameInp = document.querySelector('.data__buyer-name');
// const buyerStreetInp = document.querySelector('.data__buyer-street');
// const buyerCityInp = document.querySelector('.data__buyer-city');
// const buyerPostCodeInp = document.querySelector('.data__buyer-post-code');
// const buyerNipInp = document.querySelector('.data__buyer-nip');
// // payment terms inputs
// const payMethodInp = document.querySelector('.payment__method');
// const payTermInp = document.querySelector('.payment__term');
// const payAccountInp = document.querySelector('.payment__account');
// // invoice position inputs
// const itemNameInp = document.querySelector('.draft-item__name');
// const itemUnitInp = document.querySelector('.draft-item__unit');
// const itemQuantInp = document.querySelector('.draft-item__quantity');
// const itemPriceInp = document.querySelector('.draft-item__price');
// const itemNetValInp = document.querySelector('.draft-item__net-value');
// const itemTaxRateInp = document.querySelector('.draft-item__tax-rate');
// const itemTaxValInp = document.querySelector('.draft-item__tax-value');
// const itemTotValInp = document.querySelector('.draft-item__total-value');
// const addBtn = document.querySelector('.btn--add-item');

// const draftItemTable = document.querySelector('.draft-added-items');
// const drawtSumTable = document.querySelector('.draft__summary')
// const itemDelBtn = document.querySelectorAll('.btn--item-del');

// // DOM output/invoice elements
// const invoice = document.querySelector('.invoice');
// // invoice heading
// const invType = invoice.querySelector('.invoice__type');
// const invNum = invoice.querySelector('.invoice__number');
// const invPlace = invoice.querySelector('.invoice__place');
// const invSellDate = invoice.querySelector('.invoice__sell-date');
// const invDate = invoice.querySelector('.invoice__place-date');

// // invoice seller details
// const invSellerName = invoice.querySelector('.invoice__seller-name');
// const invSellerStr = invoice.querySelector('.invoice__seller-street');
// const invSellerCity = invoice.querySelector('.invoice__seller-city');
// const invSellerPostCode = invoice.querySelector('.seller__post-code');
// const invSellerNip = invoice.querySelector('.invoice__seller-nip');

// // invoice buyer details
// const invBuyerName = invoice.querySelector('.invoice__buyer-name');
// const invBuyerStr = invoice.querySelector('.invoice__buyer-street');
// const invBuyerCity = invoice.querySelector('.invoice__buyer-city');
// const invBuyerPostCode = invoice.querySelector('.buyer__post-code');
// const invBuyerNip = invoice.querySelector('.invoice__buyer-nip');

// // Invoice positions items table DOM
// const invoicePositionsTable = invoice.querySelector('.invoice__positions-place');
// const invoicePositionsTableSum = invoice.querySelector('.invoice__positions-summary');

// // invoice final details DOM
// const invFinalToPay = invoice.querySelector('.invoice__final-to-pay');
// const invFinalPayMethod = invoice.querySelector('.invoice__final-payment-method');
// const invFinalPayTerm = invoice.querySelector('.invoice__final-payment-term');
// const invFinalAccount = invoice.querySelector('.invoice__final-payment__account');

// // button generate invoice
// const genBtn = document.querySelector('.btn--gen-inv');


// generate invoice event listener
// genBtn.addEventListener('click', generateInvoice);
// addBtn.addEventListener('click', addItem);

// itemQuantInp.addEventListener('change', calculateItemTaxes);
// itemPriceInp.addEventListener('change', calculateItemTaxes);
// itemNetValInp.addEventListener('change', calculateItemTaxes);
// itemTaxRateInp.addEventListener('change', calculateItemTaxes);

// function calculateItemTaxes() {
//   if (itemQuantInp.value !== '' && itemPriceInp.value !== '') {
//     itemNetValInp.value = itemPriceInp.valueAsNumber * itemQuantInp.valueAsNumber;
//     itemTaxValInp.value = (itemQuantInp.valueAsNumber * itemPriceInp.valueAsNumber * parseFloat(itemTaxRateInp.value / 100)).toFixed(2);
//     itemTotValInp.value = (itemPriceInp.valueAsNumber * itemQuantInp.valueAsNumber + itemQuantInp.valueAsNumber * itemPriceInp.valueAsNumber * parseFloat(itemTaxRateInp.value / 100)).toFixed(2);
//   }
// }





// const inputs = Array.from(document.querySelector('.data-form').getElementsByClassName('input'));
// inputs.forEach((input) => input.addEventListener('blur', validateInputs));


// function validateInputs(e) {
//   if (e.target === sellerPostCodeInp || e.target === sellerPostCodeInp) {
//     validatePostCode(e)
//   } else if (e.target === sellerNipInp || e.target === buyerNipInp) {
//     validateNip(e);
//   } else if (e.target === payAccountInp) {
//     validateAccount(e);
//   } else {
//     if (e.target.value === '' || e.target.value === ' ') {
//       e.target.classList.add('invalid');
//     } else {
//       e.target.classList.remove('invalid');
//     }
//   }

// }



// function validateCont(e) {
//   if (e.target.value === '' || e.target.value === ' ') {
//     e.target.classList.add('invalid');
//   } else {
//     e.target.classList.remove('invalid');
//   }
// }

// function validatePostCode(e) {
//   reg = /^\d\d-\d\d\d$/;
//   if (e.target.classList.contains('data__seller-post-code')) {
//     if (!reg.test(sellerPostCodeInp.value)) {
//       e.target.classList.add('invalid')
//     } else {
//       e.target.classList.remove('invalid')
//     }
//   } else if (e.target.classList.contains('data__buyer-post-code')) {
//     if (!reg.test(sellerPostCodeInp.value)) {
//       e.target.classList.add('invalid')
//     } else {
//       e.target.classList.remove('invalid')
//     }
//   }
// }

// function validateNip(e) {
//   reg = /^\d{3}[- ]?\d{3}[- ]?\d\d[- ]?\d\d\s?$/;
//   if (e.target.classList.contains('data__seller-nip')) {
//     if (!reg.test(sellerNipInp.value)) {
//       e.target.classList.add('invalid')
//     } else {
//       e.target.classList.remove('invalid')
//     }
//   } else if (e.target.classList.contains('data__buyer-nip')) {
//     if (!reg.test(buyerNipInp.value)) {
//       e.target.classList.add('invalid')
//     } else {
//       e.target.classList.remove('invalid')
//     }
//   }
// }



// function validateAccount(e) {
//   reg = /^([A-Za-z]{2})?[ ]?\d{2}([ ]?\d{4}){6}\s?$/;
//   if (!reg.test(payAccountInp.value)) {
//     e.target.classList.add('invalid')
//   } else {
//     e.target.classList.remove('invalid')
//   }
// }


// // input items validation
// itemNameInp.addEventListener('keyup', disableAddBtn);
// itemQuantInp.addEventListener('keyup', disableAddBtn);
// itemPriceInp.addEventListener('keyup', disableAddBtn);

// function disableAddBtn() {
//   if (itemNameInp.value !== '' &&
//     itemQuantInp.value !== '' &&
//     itemPriceInp.value !== '') {
//     addBtn.disabled = false;
//   } else {
//     addBtn.disabled = true;
//   }
// }


// // create empty array for all invoice items
// const invoiceItems = [];
// let invoiceTotal;


// class Item {
//   constructor() {
//     {}
//   }
//   sayID() {
//     console.log(`My id is ${this.id}`);
//   }
// }


/*------------------------------------------------------------------------------------
Input section Functions                              
-----------------------------------------------------------------------------------*/

// adding new items to array with item objects
// function addItem() {
//   // creating new draft item
//   const newItem = new Item;
//   // assigning input values to item
//   assignValuesToItem(newItem);
//   // pushing newly created item to items array
//   invoiceItems.push(newItem);
//   // clearing item input fieldset
//   clearItemFieldset();
//   // generating items list
//   updateItemsList()
//   // print summary vat totals in draft prewiev
//   updateDraftSumValues()

// addBtn.disabled = true;
// // }



// // adding event listeners to  items list delete buttons
// function addingListenersForDelBtns() {
//   // selecting all delete buttons
//   const itemDelBtn = document.querySelectorAll('.btn--item-del');
//   // attaching for each delete button click event listener with deleteItem function
//   itemDelBtn.forEach(button => button.addEventListener('click', deleteItem));
// }


// // delete item from item list function
// function deleteItem(e) {
//   // determine clicked row identifier which equals item object id from array
//   const deletingId = parseFloat(e.target.parentElement.parentElement.dataset.identifier);
//   // splice clicked item from invoiceItems array
//   invoiceItems.splice((invoiceItems.findIndex(item => item.id == deletingId)), 1);
//   // generating items working list again
//   updateItemsList()
//   // update draft sum values table
//   updateDraftSumValues()
// }


// // clear fields after generate new item
// function clearItemFieldset() {
//   itemNameInp.value = '';
//   itemQuantInp.value = '';
//   itemPriceInp.value = '';
//   itemNetValInp.value = '';
//   itemTaxValInp.value = '';
//   itemTotValInp.value = '';
//   // target focus to item name field
//   itemNameInp.focus();
// }



// function updateItemsList() {
//   clearInnerHtml(draftItemTable);
//   // for each drafted item perform same action
//   invoiceItems.forEach(item => {
//     // create newtable row
//     const newRow = document.createElement('tr');
//     newRow.classList.add('draft__position');
//     newRow.id = `draft-item${item.id}`
//     newRow.dataset.identifier = `${item.id}`;
//     newRow.innerHTML = `
//       <td class="draft__item-delete"><button class="btn btn--item-del">usuń</button></td>
//       <td class="draft__item-name">${item.name}</td>
//       <td class="draft__item-unit">${item.unit}</td>
//       <td class="draft__item-quantity">${item.quantity}</td>
//       <td class="draft__item-price">${item.netPrice}</td>
//       <td class="draft__item-net-value">${item.netValue}</td>
//       <td class="draft__item-tax-rate">${item.taxRate}</td>
//       <td class="draft__item-tax-value">${item.taxValue}</td>
//       <td class="draft__item-total-value">${item.total}</td>`;
//     draftItemTable.appendChild(newRow);

//   });
//   // add event listeners to delete buttons 
//   addingListenersForDelBtns()
// }


// // function clearInnerHtml(elem) {
// //   elem.innerHTML = '';
// // }


// function updateDraftSumValues() {
//   // remove all content from summary draft table
//   clearInnerHtml(drawtSumTable)
//   //calculatinh draft items table summaries
//   const sumaNet = invoiceItems.reduce((acc, item) => {
//     return acc + item.netValue;
//   }, 0);
//   const sumaVat = invoiceItems.reduce((acc, item) => {
//     return acc + item.taxValue;
//   }, 0);
//   const sumaTotal = invoiceItems.reduce((acc, item) => {
//     return acc + item.total;
//   }, 0);

//   const draftSumRow = document.createElement('tr');
//   draftSumRow.classList.add('draft__summary-row');
//   draftSumRow.innerHTML = `<th colspan="5" class="draft__summary-legend">Razem:</th>
//                           <th class="draft__summary-net-value">${sumaNet}</th>
//                           <th class=""></th>
//                           <th class="draft__summary-vat-value">${sumaVat}</th>
//                           <th class="draft__summary-total">${sumaTotal}</th>`
//   drawtSumTable.appendChild(draftSumRow);
//   // total invoice value;
//   invoiceTotal = sumaTotal;
//   // print summary svat stakes in draft prewiev
//   checkVatRates(invoiceItems);
// }


// function generateSumRow(boolie, checkingTaxRate) {
//   if (boolie) {
//     const vatRateItemsArr = invoiceItems.filter(item => item.taxRate === checkingTaxRate);
//     const vatRateNetValue = vatRateItemsArr.reduce((acc, obj) => {
//       return acc + obj.netValue;
//     }, 0);
//     const vatRateTax = vatRateItemsArr.reduce((acc, obj) => {
//       return acc + obj.taxValue;
//     }, 0);
//     const vatRateTotal = vatRateItemsArr.reduce((acc, obj) => {
//       return acc + obj.total;
//     }, 0);

//     const vatRatefinalrow = document.createElement('tr');
//     vatRatefinalrow.classList.add('draft__summary-row');
//     vatRatefinalrow.innerHTML = `
//                             <td colspan="5" class="draft__summary-legend">W tym:</td>
//                             <td class="draft__summary-net-value">${vatRateNetValue}</td>
//                             <td class="">${checkingTaxRate}%</td>
//                             <td class="draft__summary-vat-value">${vatRateTax}</td>
//                             <td class="draft__summary-total">${vatRateTotal}</td>`
//     drawtSumTable.appendChild(vatRatefinalrow);
//   }
// };

// // function for draft items summary - checking summary items values and calculating specific tax rate partial values
// function checkVatRates(arr) {
//   // boolean values for check if there are some products with specific tax rates
//   const areThere00 = arr.some((item) => item.taxRate === 0);
//   const areThere3 = arr.some((item) => item.taxRate === 3);
//   const areThere5 = arr.some((item) => item.taxRate === 5);
//   const areThere8 = arr.some((item) => item.taxRate === 8);
//   const areThere23 = arr.some((item) => item.taxRate === 23);

//   generateSumRow(areThere23, 23);
//   generateSumRow(areThere8, 8);
//   generateSumRow(areThere5, 5);
//   generateSumRow(areThere3, 3);
//   generateSumRow(areThere00, 0);

// }


/*-------------------------------------------------------------------------------
Generate invoice functions
--------------------------------------------------------------------------------*/

// function generateInvoiceSumRow(boolie, checkingTaxRate) {
//   if (boolie) {
//     const vatRateItemsArr = invoiceItems.filter(item => item.taxRate === checkingTaxRate);
//     const vatRateNetValue = vatRateItemsArr.reduce((acc, obj) => {
//       return acc + obj.netValue;
//     }, 0);
//     const vatRateTax = vatRateItemsArr.reduce((acc, obj) => {
//       return acc + obj.taxValue;
//     }, 0);
//     const vatRateTotal = vatRateItemsArr.reduce((acc, obj) => {
//       return acc + obj.total;
//     }, 0);

//     const vatRatefinalrow = document.createElement('tr');
//     vatRatefinalrow.classList.add('invoice__summary-row');
//     vatRatefinalrow.innerHTML = `
//                             <td colspan="5" class="invoice__summary-legend">W tym:</td>
//                             <td class="invoice__summary-net-value">${vatRateNetValue}</td>
//                             <td class="">${checkingTaxRate}%</td>
//                             <td class="invoice__summary-vat-value">${vatRateTax}</td>
//                             <td class="invoice__summary-total">${vatRateTotal}</td>`
//     invoicePositionsTable.appendChild(vatRatefinalrow);
//   }
// };


// function generateInvoice() {

//   const inputs = Array.from(document.querySelector('.data-form').getElementsByClassName('input'));
//   if (inputs.some((input) => input.value === '' || input.value === ' ')) {
//     inputs.filter(input => input.value === '' || input.value === ' ').forEach(input => input.classList.add('invalid'));
//     return;
//   }

// const invoiceObj = {
//   invoiceType: docTypeInp.value,
//   invoiceNumber: docNumInp.value,
//   invoicePlace: docPlaceInp.value,
//   InvoiceDate: docDateInp.value,
//   invoiceSellDate: docSellDateInp.value,
//   invoiceSellerName: sellerNameInp.value,
//   invoiceSellerStr: sellerStreetInp.value,
//   invoiceSellerCity: sellerCityInp.value,
//   invoiceSellerPostCode: sellerPostCodeInp.value,
//   invoicesSellerNip: sellerNipInp.value,
//   invoiceBuyerName: buyerNameInp.value,
//   invoiceBuyerStr: buyerStreetInp.value,
//   invoiceBuyerCity: buyerCityInp.value,
//   invoiceBuyerPostCode: buyerPostCodeInp.value,
//   invoiceBuyerNip: buyerNipInp.value,
//   invoiceToPay: invoiceTotal,
//   invoicePayMethod: payMethodInp.value,
//   invoicePayTerm: payTermInp.value,
//   invoiceAccount: payAccountInp.value,
// }

// // inserting details of the invoice
// invType.textContent = `${invoiceObj.invoiceType}`;
// invNum.textContent = `nr ${invoiceObj.invoiceNumber}`;
// invPlace.textContent = `Miejsce wystawienia: ${invoiceObj.invoicePlace}`;
// invDate.textContent = `Data wystawienia: ${invoiceObj.InvoiceDate}`;
// invSellDate.textContent = `Data sprzedaży: ${invoiceObj.invoiceSellDate}`;
// invSellerName.textContent = `${invoiceObj.invoiceSellerName}`;
// invSellerStr.textContent = `${invoiceObj.invoiceSellerStr}`;
// invSellerCity.textContent = `${invoiceObj.invoiceSellerCity}`;
// invSellerPostCode.textContent = `${invoiceObj.invoiceSellerPostCode}`;
// invSellerNip.textContent = `NIP: ${invoiceObj.invoicesSellerNip}`;
// invBuyerName.textContent = `${invoiceObj.invoiceBuyerName}`;
// invBuyerStr.textContent = `${invoiceObj.invoiceBuyerStr}`;
// invBuyerCity.textContent = `${invoiceObj.invoiceBuyerCity}`;
// invBuyerPostCode.textContent = `${invoiceObj.invoiceBuyerPostCode}`;
// invBuyerNip.textContent = `NIP: ${invoiceObj.invoiceBuyerNip}`;
// invFinalToPay.textContent = `Do zapłaty: ${invoiceTotal} PLN`;
// invFinalPayMethod.textContent = `Sposób płatności: ${invoiceObj.invoicePayMethod}`;
// invFinalPayTerm.textContent = `Termin płatności: ${invoiceObj.invoicePayTerm}`;
// invFinalAccount.textContent = `Konto: ${invoiceObj.invoiceAccount}`;

// generating invoice positions
// generateInvoicePositions(invoiceItems)

}

// function generateInvoicePositions(arr) {
//   // generate invoice positions 
//   clearInnerHtml(invoicePositionsTable);
//   clearInnerHtml(invoicePositionsTableSum);


//   arr.forEach(item => {
//     const newRow = document.createElement('tr');
//     newRow.classList.add('invoice__position');
//     newRow.id = `invoice-item${item.id}`
//     newRow.dataset.identifier = `${item.id}`;
//     newRow.innerHTML = `
//         <td class="invoice__item-lp">${item.id+1}</td>
//         <td class="invoice__item-name">${item.name}</td>
//         <td class="invoice__item-unit">${item.unit}</td>
//         <td class="invoice__item-quantity">${item.quantity}</td>
//         <td class="invoice__item-price">${item.netPrice}</td>
//         <td class="invoice__item-net-value">${item.netValue}</td>
//         <td class="invoice__item-tax-rate">${item.taxRate}</td>
//         <td class="invoice__item-tax-value">${item.taxValue}</td>
//         <td class="invoice__item-total-value">${item.total}</td>`;
//     invoicePositionsTable.appendChild(newRow);
//   });


//   // invoice items summaries
//   const sumaNet = invoiceItems.reduce(function(acc, item) {
//     return acc + item.netValue;
//   }, 0);
//   const sumaVat = invoiceItems.reduce(function(acc, item) {
//     return acc + item.taxValue;
//   }, 0);
//   const sumaTotal = invoiceItems.reduce(function(acc, item) {
//     return acc + item.total;
//   }, 0);

//   const invoiceSumRow = document.createElement('tr');
//   invoiceSumRow.classList.add('invoice__summary-row');
//   invoiceSumRow.innerHTML = `<th colspan="5" class="invoice__summary-legend">Razem:</th>
//                           <th class="invoice__summary-net-value">${sumaNet}</th>
//                           <th class=""></th>
//                           <th class="invoice__summary-vat-value">${sumaVat}</th>
//                           <th class="invoice__summary-total">${sumaTotal}</th>`
//   invoicePositionsTable.appendChild(invoiceSumRow);


//   // generate boolean values for check it there are some products with specific tax rates
//   const areThere23 = arr.some((item) => item.taxRate === 23);
//   const areThere8 = arr.some((item) => item.taxRate === 8);
//   const areThere5 = arr.some((item) => item.taxRate === 5);
//   const areThere3 = arr.some((item) => item.taxRate === 3);
//   const areThere00 = arr.some((item) => item.taxRate === 0);

//   //  generate summaries by vat rate
//   generateInvoiceSumRow(areThere23, 23);
//   generateInvoiceSumRow(areThere8, 8);
//   generateInvoiceSumRow(areThere5, 5);
//   generateInvoiceSumRow(areThere3, 3);
//   generateInvoiceSumRow(areThere00, 0);

// }