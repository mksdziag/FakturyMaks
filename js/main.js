// DOM input elements
// document data inputs
const docTypeInp = document.querySelector('.data__doc-type');
const docNumInp = document.querySelector('.data__doc-number');
const docPlaceInp = document.querySelector('.data__doc-place');
const docDateInp = document.querySelector('.data__doc-date');
const docSellDateInp = document.querySelector('.data__doc-sell-date');
// seller data inputs
const sellerNameInp = document.querySelector('.data__seller-name');
const sellerStreetInp = document.querySelector('.data__seller-street');
const sellerCityInp = document.querySelector('.data__seller-city');
const sellerPostCodeInp = document.querySelector('.data__seller-post-code');
const sellerNipInp = document.querySelector('.data__seller-nip');
// buyer data inputs
const buyerNameInp = document.querySelector('.data__buyer-name');
const buyerStreetInp = document.querySelector('.data__buyer-street');
const buyerCityInp = document.querySelector('.data__buyer-city');
const buyerPostCodeInp = document.querySelector('.data__buyer-post-code');
const buyerNipInp = document.querySelector('.data__buyer-nip');
// payment terms inputs
const payMethodInp = document.querySelector('.payment__method');
const payTermInp = document.querySelector('.payment__term');
const payAccountInp = document.querySelector('.payment__account');
// invoice position inputs
const itemNameInp = document.querySelector('.item__name');
const itemUnitInp = document.querySelector('.item__unit');
const itemQuantInp = document.querySelector('.item__quantity');
const itemPriceInp = document.querySelector('.item__price');
const itemNetValInp = document.querySelector('.item__net-value');
const itemTaxRateInp = document.querySelector('.item__tax-rate');
const itemTaxValInp = document.querySelector('.item__tax-value');
const itemTotValInp = document.querySelector('.item__total-value');
const addBtn = document.querySelector('.btn--add-item');

const draftItemTable = document.querySelector('.draft-items');
const itemDelBtn = document.querySelectorAll('.btn--item-del');

// DOM output/invoice elements
const invoice = document.querySelector('.invoice');
// invoice heading
const invType = invoice.querySelector('.invoice__type');
const invNum = invoice.querySelector('.invoice__number');
const invPlace = invoice.querySelector('.invoice__place');
const invSellDate = invoice.querySelector('.invoice__sell-date');
const invDate = invoice.querySelector('.invoice__place-date');

// invoice seller details
const invSellerName = invoice.querySelector('.invoice__seller-name');
const invSellerStr = invoice.querySelector('.invoice__seller-street');
const invSellerCity = invoice.querySelector('.invoice__seller-city');
const invSellerPostCode = invoice.querySelector('.seller__post-code');
const invSellerNip = invoice.querySelector('.invoice__seller-nip');

// invoice buyer details
const invBuyerName = invoice.querySelector('.invoice__buyer-name');
const invBuyerStr = invoice.querySelector('.invoice__buyer-street');
const invBuyerCity = invoice.querySelector('.invoice__buyer-city');
const invBuyerPostCode = invoice.querySelector('.buyer__post-code');
const invBuyerNip = invoice.querySelector('.invoice__buyer-nip');


// invoice final details DOM
const invFinalToPay = invoice.querySelector('.invoice__final-to-pay');
const invFinalPayMethod = invoice.querySelector('.invoice__final-payment-method');
const invFinalPayTerm = invoice.querySelector('.invoice__final-payment-term');
const invFinalAccount = invoice.querySelector('.invoice__final-payment__account');

// button generate invoice
const genBtn = document.querySelector('.btn--gen-inv');


// generate invoice event listener

genBtn.addEventListener('click', generateInvoice);
addBtn.addEventListener('click', addItem);





// create empty array for all invoice items
const invoiceiIems = [];

/*/////////////////////////////////////////
Input section Functions                              
----------------------------------------*/
// adding new items to array with item objects
function addItem() {
  // creating new invoice item
  const newitem = {
    id: invoiceiIems.length,
    name: itemNameInp.value,
    unit: itemUnitInp.value,
    quantity: itemQuantInp.valueAsNumber,
    netPrice: itemPriceInp.valueAsNumber,
    netValue: itemPriceInp.valueAsNumber * itemQuantInp.valueAsNumber,
    taxRate: parseFloat(itemTaxRateInp.value),
    taxValue: parseFloat((itemPriceInp.valueAsNumber * itemQuantInp.valueAsNumber * parseFloat(itemTaxRateInp.value)).toFixed(2)),
    total: parseFloat((itemPriceInp.valueAsNumber * itemQuantInp.valueAsNumber + itemPriceInp.valueAsNumber * itemQuantInp.valueAsNumber * parseFloat(itemTaxRateInp.value)).toFixed(2)),
  }
  // pushing newly created item to items array
  invoiceiIems.push(newitem);
  // clearing item input fieldset
  clearItemFieldset();
  // generating items list
  updateItemsList()
}


// array prototype new functions

Array.prototype.totalTaxVal = function () {
  return this.reduce(function (acc, obj) {
    return acc + obj.taxValue;
  }, 0);
}
Array.prototype.totalnetVal = function () {
  return this.reduce(function (acc, obj) {
    return acc + obj.netValue;
  }, 0);
}
Array.prototype.totalVal = function () {
  return this.reduce(function (acc, obj) {
    return acc + obj.total;
  }, 0);
}

function checkVatRates(arr) {




  const areThere23 = arr.some(function (item) {
    return item.taxRate === 0.23;
  });
  const areThere3 = arr.some((item) => item.taxRate === 0.03);
  const areThere5 = arr.some(function (item) {
    return item.taxRate === 0.05;
  });
  const areThere8 = arr.some(function (item) {
    return item.taxRate === 0.08;
  });

  if (areThere23) {
    const vat23ItemsArr = arr.filter(item => item.taxRate === 0.23);

    const vat23net = vat23ItemsArr.reduce(function (acc, obj) {
      return acc + obj.netValue;
    }, 0);
    const vat23tax = vat23ItemsArr.reduce(function (acc, obj) {
      return acc + obj.taxValue;
    }, 0);
    const vat23total = vat23ItemsArr.reduce(function (acc, obj) {
      return acc + obj.total;
    }, 0);

    const vat23finalrow = document.createElement('tr');
    vat23finalrow.classList.add('draft__summary-row');
    vat23finalrow.innerHTML = `
                            <td colspan="5" class="draft__summary-legend">W tym:</td>
                            <td class="draft__summary-net-value">${vat23net}</td>
                            <td class="">23%</td>
                            <td class="draft__summary-vat-value">${vat23tax}</td>
                            <td class="draft__summary-total">${vat23total}</td>`
    document.querySelector('.draft__summary').appendChild(vat23finalrow);

  }



  if (areThere3) {
    const vat03ItemsArr = arr.filter(item => item.taxRate === 0.03);

    const vat03net = vat03ItemsArr.reduce(function (acc, obj) {
      return acc + obj.netValue;
    }, 0);
    const vat03tax = vat03ItemsArr.reduce(function (acc, obj) {
      return acc + obj.taxValue;
    }, 0);
    const vat03total = vat03ItemsArr.reduce(function (acc, obj) {
      return acc + obj.total;
    }, 0);

    const vat03finalrow = document.createElement('tr');
    vat03finalrow.classList.add('draft__summary-row');
    vat03finalrow.innerHTML = `
                            <td colspan="5" class="draft__summary-legend">W tym:</td>
                            <td class="draft__summary-net-value">${vat03net}</td>
                            <td class="">3%</td>
                            <td class="draft__summary-vat-value">${vat03tax}</td>
                            <td class="draft__summary-total">${vat03total}</td>`
    document.querySelector('.draft__summary').appendChild(vat03finalrow);

  }
  if (areThere5) {
    const vat05ItemsArr = arr.filter(item => item.taxRate === 0.05);

    const vat05net = vat05ItemsArr.reduce(function (acc, obj) {
      return acc + obj.netValue;
    }, 0);
    const vat05tax = vat05ItemsArr.reduce(function (acc, obj) {
      return acc + obj.taxValue;
    }, 0);
    const vat05total = vat05ItemsArr.reduce(function (acc, obj) {
      return acc + obj.total;
    }, 0);

    const vat05finalrow = document.createElement('tr');
    vat05finalrow.classList.add('draft__summary-row');
    vat05finalrow.innerHTML = `
                            <td colspan="5" class="draft__summary-legend">W tym:</td>
                            <td class="draft__summary-net-value">${vat05net}</td>
                            <td class="">5%</td>
                            <td class="draft__summary-vat-value">${vat05tax}</td>
                            <td class="draft__summary-total">${vat05total}</td>`
    document.querySelector('.draft__summary').appendChild(vat05finalrow);
  }
  if (areThere8) {
    const vat08temsArr = arr.filter(item => item.taxRate === 0.08);
    const vat08net = vat08ItemsArr.reduce(function (acc, obj) {
      return acc + obj.netValue;
    }, 0);
    const vat08tax = vat08ItemsArr.reduce(function (acc, obj) {
      return acc + obj.taxValue;
    }, 0);
    const vat08total = vat08ItemsArr.reduce(function (acc, obj) {
      return acc + obj.total;
    }, 0);

    const vat08finalrow = document.createElement('tr');
    vat08finalrow.classList.add('draft__summary-row');
    vat08finalrow.innerHTML = `
                            <td colspan="5" class="draft__summary-legend">W tym:</td>
                            <td class="draft__summary-net-value">${vat08net}</td>
                            <td class="">8%</td>
                            <td class="draft__summary-vat-value">${vat08tax}</td>
                            <td class="draft__summary-total">${vat08total}</td>`
    document.querySelector('.draft__summary').appendChild(vat08finalrow);
  }

}


// adding event listeners to  items list delete buttons
function addingListenersForDelBtns() {
  // selecting all delete buttons
  const itemDelBtn = document.querySelectorAll('.btn--item-del');
  // attaching for each delete button click event listener with deleteItem function
  itemDelBtn.forEach(button => button.addEventListener('click', deleteItem));
}

// delete item from item list function
function deleteItem(e) {
  // determine clicked row identifier which equals item object id from array
  const deletingId = parseFloat(e.target.parentElement.parentElement.dataset.identifier);
  // splice clicked item from invoiceItems array
  invoiceiIems.splice((invoiceiIems.findIndex(item => item.id == deletingId)), 1);
  // generating items working list again
  updateItemsList()
}

// clear fields after generate new item
function clearItemFieldset() {
  itemNameInp.value = '';
  itemQuantInp.value = '';
  itemPriceInp.value = '';
}


function updateItemsList() {
  draftItemTable.innerHTML = '';
  invoiceiIems.forEach(item => {

    const newRow = document.createElement('tr');
    newRow.classList.add('draft__position');
    newRow.id = `draft-item${item.id}`
    newRow.dataset.identifier = `${item.id}`;
    newRow.innerHTML = `
      <td class="draft__item-lp"><button class="btn btn--item-del">usuń</button></td>
      <td class="draft__item-name">${item.name}</td>
      <td class="draft__item-unit">${item.unit}</td>
      <td class="draft__item-quantity">${item.quantity}</td>
      <td class="draft__item-price">${item.netPrice}</td>
      <td class="draft__item-net-value">${item.netValue}</td>
      <td class="draft__item-tax-rate">${item.taxRate}</td>
      <td class="draft__item-tax-value">${item.taxValue}</td>
      <td class="draft__item-total-value">${item.total}</td>`;
    draftItemTable.appendChild(newRow);


  });
  addingListenersForDelBtns()

  const draftSunNetVal = document.querySelector('.draft__summary-net-value');
  const draftSunVatVal = document.querySelector('.draft__summary-vat-value');
  const draftSunTotVal = document.querySelector('.draft__summary-total');

  // draft items summary
  const sumaNet = invoiceiIems.reduce(function (acc, item) {
    return acc + item.netValue;
  }, 0);
  const sumaVat = invoiceiIems.reduce(function (acc, item) {
    return acc + item.taxValue;
  }, 0);
  const sumaTotal = invoiceiIems.reduce(function (acc, item) {
    return acc + item.total;
  }, 0);

  draftSunNetVal.textContent = sumaNet.toFixed(2);
  draftSunVatVal.textContent = sumaVat.toFixed(2);
  draftSunTotVal.textContent = sumaTotal.toFixed(2);
}



/*/////////////////////////////////////////
Generate invoice functions
----------------------------------------*/

function generateInvoice() {
  const invoiceObj = {
    invoiceType: docTypeInp.value,
    invoiceNumber: docNumInp.value,
    invoicePlace: docPlaceInp.value,
    InvoiceDate: docDateInp.value,
    invoiceSellDate: docSellDateInp.value,
    invoiceSellerName: sellerNameInp.value,
    invoiceSellerStr: sellerStreetInp.value,
    invoiceSellerCity: sellerCityInp.value,
    invoiceSellerPostCode: sellerPostCodeInp.value,
    invoicesSellerNip: sellerNipInp.value,
    invoiceBuyerName: buyerNameInp.value,
    invoiceBuyerStr: buyerStreetInp.value,
    invoiceBuyerCity: buyerCityInp.value,
    invoiceBuyerPostCode: buyerPostCodeInp.value,
    invoiceBuyerNip: buyerNipInp.value,
    invoicePayMethod: payMethodInp.value,
    invoicePayTerm: payTermInp.value,
    invoiceAccount: payAccountInp.value,
  }

  // inserting values on invoice
  invType.textContent = `${invoiceObj.invoiceType}`;
  invNum.textContent = `nr ${invoiceObj.invoiceNumber}`;
  invPlace.textContent = `Miejsce wystawienia: ${invoiceObj.invoicePlace}`;
  invDate.textContent = `Data wystawienia: ${invoiceObj.InvoiceDate}`;
  invSellDate.textContent = `Data sprzedaży: ${invoiceObj.invoiceSellDate}`;
  invSellerName.textContent = `${invoiceObj.invoiceSellerName}`;
  invSellerStr.textContent = `${invoiceObj.invoiceSellerStr}`;
  invSellerCity.textContent = `${invoiceObj.invoiceSellerCity}`;
  invSellerPostCode.textContent = `${invoiceObj.invoiceSellerPostCode}`;
  invSellerNip.textContent = `NIP: ${invoiceObj.invoicesSellerNip}`;
  invBuyerName.textContent = `${invoiceObj.invoiceBuyerName}`;
  invBuyerStr.textContent = `${invoiceObj.invoiceBuyerStr}`;
  invBuyerCity.textContent = `${invoiceObj.invoiceBuyerCity}`;
  invBuyerPostCode.textContent = `${invoiceObj.invoiceBuyerPostCode}`;
  invBuyerNip.textContent = `NIP: ${invoiceObj.invoiceBuyerNip}`;
  // invFinalToPay.textContent = `${invoiceObj.}`
  invFinalPayMethod.textContent = `Sposób płatności:${invoiceObj.invoicePayMethod}`;
  invFinalPayTerm.textContent = `Termin płatności: ${invoiceObj.invoicePayTerm}`;
  invFinalAccount.textContent = `Konto: ${invoiceObj.invoiceAccount}`;

}