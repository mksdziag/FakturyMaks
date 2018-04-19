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
const itemNameInp = document.querySelector('.draft-item__name');
const itemUnitInp = document.querySelector('.draft-item__unit');
const itemQuantInp = document.querySelector('.draft-item__quantity');
const itemPriceInp = document.querySelector('.draft-item__price');
const itemNetValInp = document.querySelector('.draft-item__net-value');
const itemTaxRateInp = document.querySelector('.draft-item__tax-rate');
const itemTaxValInp = document.querySelector('.draft-item__tax-value');
const itemTotValInp = document.querySelector('.draft-item__total-value');
const addBtn = document.querySelector('.btn--add-item');

const draftItemTable = document.querySelector('.draft-added-items');
const drawtSumTable = document.querySelector('.draft__summary')
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

// Invoice positions items table DOM
const invoicePositionsTable = invoice.querySelector('.invoice__positions-place');
const invoicePositionsTableSum = invoice.querySelector('.invoice__positions-summary');

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
const invoiceItems = [];
let invoiceTotal;

/*------------------------------------------------------------------------------------
Input section Functions                              
-----------------------------------------------------------------------------------*/

// adding new items to array with item objects
function addItem() {
  // creating new invoice item
  const newitem = {
    id: invoiceItems.length,
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
  invoiceItems.push(newitem);
  // clearing item input fieldset
  clearItemFieldset();
  // generating items list
  updateItemsList()
  // print summary vat totals in draft prewiev
  updateDraftSumValues()

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
  invoiceItems.splice((invoiceItems.findIndex(item => item.id == deletingId)), 1);
  // generating items working list again
  updateItemsList()
  // update draft sum values table
  updateDraftSumValues()
}



// clear fields after generate new item
function clearItemFieldset() {
  itemNameInp.value = '';
  itemQuantInp.value = '';
  itemPriceInp.value = '';
}



function updateItemsList() {
  draftItemTable.innerHTML = '';
  invoiceItems.forEach(item => {

    const newRow = document.createElement('tr');
    newRow.classList.add('draft__position');
    newRow.id = `draft-item${item.id}`
    newRow.dataset.identifier = `${item.id}`;
    newRow.innerHTML = `
      <td class="draft__item-delete"><button class="btn btn--item-del">usuń</button></td>
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

}



function updateDraftSumValues() {
  // remove all content from summary draft table
  drawtSumTable.innerHTML = '';

  // draft items summaries
  const sumaNet = invoiceItems.reduce(function (acc, item) {
    return acc + item.netValue;
  }, 0).toFixed(2);
  const sumaVat = invoiceItems.reduce(function (acc, item) {
    return acc + item.taxValue;
  }, 0).toFixed(2);
  const sumaTotal = invoiceItems.reduce(function (acc, item) {
    return acc + item.total;
  }, 0).toFixed(2);

  const draftSumRow = document.createElement('tr');
  draftSumRow.classList.add('draft__summary-row');
  draftSumRow.innerHTML = `<th colspan="5" class="draft__summary-legend">Razem:</th>
                          <th class="draft__summary-net-value">${sumaNet}</th>
                          <th class=""></th>
                          <th class="draft__summary-vat-value">${sumaVat}</th>
                          <th class="draft__summary-total">${sumaTotal}</th>`
  drawtSumTable.appendChild(draftSumRow);
  // total invoice value;
  invoiceTotal = sumaTotal;
  // print summary svat stakes in draft prewiev
  checkVatRates(invoiceItems)
}


// function for draft items summary - checking summary items values and calculating specific tax rate partial values
function checkVatRates(arr) {
  // boolean valuest for check it there are some products with specific tax rates
  const areThere00 = arr.some((item) => item.taxRate === 0.00);
  const areThere3 = arr.some((item) => item.taxRate === 0.03);
  const areThere5 = arr.some((item) => item.taxRate === 0.05);
  const areThere8 = arr.some((item) => item.taxRate === 0.08);
  const areThere23 = arr.some((item) => item.taxRate === 0.23);



  // creating new table rows igf there are specific vat rate items
  if (areThere00) {
    const vat00ItemsArr = arr.filter(item => item.taxRate === 0.00);
    const vat00net = vat00ItemsArr.reduce((acc, obj) => {
      return acc + obj.netValue;
    }, 0);
    const vat00tax = vat00ItemsArr.reduce((acc, obj) => {
      return acc + obj.taxValue;
    }, 0);
    const vat00total = vat00ItemsArr.reduce((acc, obj) => {
      return acc + obj.total;
    }, 0);

    const vat00finalrow = document.createElement('tr');
    vat00finalrow.classList.add('draft__summary-row');
    vat00finalrow.innerHTML = `
                            <td colspan="5" class="draft__summary-legend">W tym:</td>
                            <td class="draft__summary-net-value">${vat00net}</td>
                            <td class="">8%</td>
                            <td class="draft__summary-vat-value">${vat00tax}</td>
                            <td class="draft__summary-total">${vat00total}</td>`
    drawtSumTable.appendChild(vat00finalrow);
  };

  if (areThere3) {
    const vat03ItemsArr = arr.filter(item => item.taxRate === 0.03);

    const vat03net = vat03ItemsArr.reduce((acc, obj) => {
      return acc + obj.netValue;
    }, 0);
    const vat03tax = vat03ItemsArr.reduce((acc, obj) => {
      return acc + obj.taxValue;
    }, 0);
    const vat03total = vat03ItemsArr.reduce((acc, obj) => {
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
    drawtSumTable.appendChild(vat03finalrow);

  };

  if (areThere5) {
    const vat05ItemsArr = arr.filter(item => item.taxRate === 0.05);

    const vat05net = vat05ItemsArr.reduce((acc, obj) => {
      return acc + obj.netValue;
    }, 0);
    const vat05tax = vat05ItemsArr.reduce((acc, obj) => {
      return acc + obj.taxValue;
    }, 0);
    const vat05total = vat05ItemsArr.reduce((acc, obj) => {
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
    drawtSumTable.appendChild(vat05finalrow);
  };


  if (areThere8) {
    const vat08ItemsArr = arr.filter(item => item.taxRate === 0.08);
    const vat08net = vat08ItemsArr.reduce((acc, obj) => {
      return acc + obj.netValue;
    }, 0);
    const vat08tax = vat08ItemsArr.reduce((acc, obj) => {
      return acc + obj.taxValue;
    }, 0);
    const vat08total = vat08ItemsArr.reduce((acc, obj) => {
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
    drawtSumTable.appendChild(vat08finalrow);
  };

  if (areThere23) {
    const vat23ItemsArr = arr.filter(item => item.taxRate === 0.23);
    const vat23net = vat23ItemsArr.reduce((acc, obj) => {
      return acc + obj.netValue;
    }, 0);
    const vat23tax = vat23ItemsArr.reduce((acc, obj) => {
      return acc + obj.taxValue;
    }, 0);
    const vat23total = vat23ItemsArr.reduce((acc, obj) => {
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
    drawtSumTable.appendChild(vat23finalrow);

  };

}


/*-------------------------------------------------------------------------------
Generate invoice functions
--------------------------------------------------------------------------------*/

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
    invoiceToPay: invoiceTotal,
    invoicePayMethod: payMethodInp.value,
    invoicePayTerm: payTermInp.value,
    invoiceAccount: payAccountInp.value,
  }

  // inserting details of the invoice
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
  invFinalToPay.textContent = `Do zapłaty: ${invoiceTotal} PLN`;
  invFinalPayMethod.textContent = `Sposób płatności: ${invoiceObj.invoicePayMethod}`;
  invFinalPayTerm.textContent = `Termin płatności: ${invoiceObj.invoicePayTerm}`;
  invFinalAccount.textContent = `Konto: ${invoiceObj.invoiceAccount}`;

  // generating invoice positions
  generateInvoicePositions(invoiceItems)

}

function generateInvoicePositions(arr) {
  // generate invoice positions 
  invoicePositionsTable.innerHTML = '';
  invoicePositionsTableSum.innerHTML = '';
  arr.forEach(item => {

    const newRow = document.createElement('tr');
    newRow.classList.add('invoice__position');
    newRow.id = `invoice-item${item.id}`
    newRow.dataset.identifier = `${item.id}`;
    newRow.innerHTML = `
        <td class="invoice__item-lp">${item.id+1}</td>
        <td class="invoice__item-name">${item.name}</td>
        <td class="invoice__item-unit">${item.unit}</td>
        <td class="invoice__item-quantity">${item.quantity}</td>
        <td class="invoice__item-price">${item.netPrice}</td>
        <td class="invoice__item-net-value">${item.netValue}</td>
        <td class="invoice__item-tax-rate">${item.taxRate}</td>
        <td class="invoice__item-tax-value">${item.taxValue}</td>
        <td class="invoice__item-total-value">${item.total}</td>`;
    invoicePositionsTable.appendChild(newRow);


  });
  // generate summary table footer

  // remove all content from summary draft table


  // draft items summaries
  const sumaNet = invoiceItems.reduce(function (acc, item) {
    return acc + item.netValue;
  }, 0).toFixed(2);
  const sumaVat = invoiceItems.reduce(function (acc, item) {
    return acc + item.taxValue;
  }, 0).toFixed(2);
  const sumaTotal = invoiceItems.reduce(function (acc, item) {
    return acc + item.total;
  }, 0).toFixed(2);

  const invoiceSumRow = document.createElement('tr');
  invoiceSumRow.classList.add('invoice__summary-row');
  invoiceSumRow.innerHTML = `<th colspan="5" class="invoice__summary-legend">Razem:</th>
                          <th class="invoice__summary-net-value">${sumaNet}</th>
                          <th class=""></th>
                          <th class="invoice__summary-vat-value">${sumaVat}</th>
                          <th class="invoice__summary-total">${sumaTotal}</th>`
  invoicePositionsTable.appendChild(invoiceSumRow);


  //  generate dummaries by vat rate



  // boolean valuest for check it there are some products with specific tax rates
  const areThere00 = arr.some((item) => item.taxRate === 0.00);
  const areThere3 = arr.some((item) => item.taxRate === 0.03);
  const areThere5 = arr.some((item) => item.taxRate === 0.05);
  const areThere8 = arr.some((item) => item.taxRate === 0.08);
  const areThere23 = arr.some((item) => item.taxRate === 0.23);



  // creating new table rows igf there are specific vat rate items
  if (areThere00) {
    const vat00ItemsArr = arr.filter(item => item.taxRate === 0.00);
    const vat00net = vat00ItemsArr.reduce((acc, obj) => {
      return acc + obj.netValue;
    }, 0);
    const vat00tax = vat00ItemsArr.reduce((acc, obj) => {
      return acc + obj.taxValue;
    }, 0);
    const vat00total = vat00ItemsArr.reduce((acc, obj) => {
      return acc + obj.total;
    }, 0);

    const vat00finalrow = document.createElement('tr');
    vat00finalrow.classList.add('invoice__summary-row');
    vat00finalrow.innerHTML = `
                              <td colspan="5" class="invoice__summary-legend">W tym:</td>
                              <td class="invoice__summary-net-value">${vat00net}</td>
                              <td class="">8%</td>
                              <td class="invoice__summary-vat-value">${vat00tax}</td>
                              <td class="invoice__summary-total">${vat00total}</td>`
    invoicePositionsTableSum.appendChild(vat00finalrow);
  };

  if (areThere3) {
    const vat03ItemsArr = arr.filter(item => item.taxRate === 0.03);

    const vat03net = vat03ItemsArr.reduce((acc, obj) => {
      return acc + obj.netValue;
    }, 0);
    const vat03tax = vat03ItemsArr.reduce((acc, obj) => {
      return acc + obj.taxValue;
    }, 0);
    const vat03total = vat03ItemsArr.reduce((acc, obj) => {
      return acc + obj.total;
    }, 0);

    const vat03finalrow = document.createElement('tr');
    vat03finalrow.classList.add('invoice__summary-row');
    vat03finalrow.innerHTML = `
                              <td colspan="5" class="invoice__summary-legend">W tym:</td>
                              <td class="invoice__summary-net-value">${vat03net}</td>
                              <td class="">3%</td>
                              <td class="invoice__summary-vat-value">${vat03tax}</td>
                              <td class="invoice__summary-total">${vat03total}</td>`
    invoicePositionsTableSum.appendChild(vat03finalrow);

  };

  if (areThere5) {
    const vat05ItemsArr = arr.filter(item => item.taxRate === 0.05);

    const vat05net = vat05ItemsArr.reduce((acc, obj) => {
      return acc + obj.netValue;
    }, 0);
    const vat05tax = vat05ItemsArr.reduce((acc, obj) => {
      return acc + obj.taxValue;
    }, 0);
    const vat05total = vat05ItemsArr.reduce((acc, obj) => {
      return acc + obj.total;
    }, 0);

    const vat05finalrow = document.createElement('tr');
    vat05finalrow.classList.add('invoice__summary-row');
    vat05finalrow.innerHTML = `
                              <td colspan="5" class="invoice__summary-legend">W tym:</td>
                              <td class="invoice__summary-net-value">${vat05net}</td>
                              <td class="">5%</td>
                              <td class="invoice__summary-vat-value">${vat05tax}</td>
                              <td class="invoice__summary-total">${vat05total}</td>`
    invoicePositionsTableSum.appendChild(vat05finalrow);
  };


  if (areThere8) {
    const vat08ItemsArr = arr.filter(item => item.taxRate === 0.08);
    const vat08net = vat08ItemsArr.reduce((acc, obj) => {
      return acc + obj.netValue;
    }, 0);
    const vat08tax = vat08ItemsArr.reduce((acc, obj) => {
      return acc + obj.taxValue;
    }, 0);
    const vat08total = vat08ItemsArr.reduce((acc, obj) => {
      return acc + obj.total;
    }, 0);

    const vat08finalrow = document.createElement('tr');
    vat08finalrow.classList.add('invoice__summary-row');
    vat08finalrow.innerHTML = `
                              <td colspan="5" class="invoice__summary-legend">W tym:</td>
                              <td class="invoice__summary-net-value">${vat08net}</td>
                              <td class="">8%</td>
                              <td class="invoice__summary-vat-value">${vat08tax}</td>
                              <td class="invoice__summary-total">${vat08total}</td>`;
    invoicePositionsTableSum.appendChild(vat08finalrow);
  };

  if (areThere23) {
    const vat23ItemsArr = arr.filter(item => item.taxRate === 0.23);
    const vat23net = vat23ItemsArr.reduce((acc, obj) => {
      return acc + obj.netValue;
    }, 0);
    const vat23tax = vat23ItemsArr.reduce((acc, obj) => {
      return acc + obj.taxValue;
    }, 0);
    const vat23total = vat23ItemsArr.reduce((acc, obj) => {
      return acc + obj.total;
    }, 0);

    const vat23finalrow = document.createElement('tr');
    vat23finalrow.classList.add('invoice__summary-row');
    vat23finalrow.innerHTML = `
                              <td colspan="5" class="invoice__summary-legend">W tym:</td>
                              <td class="invoice__summary-net-value">${vat23net}</td>
                              <td class="">23%</td>
                              <td class="invoice__summary-vat-value">${vat23tax}</td>
                              <td class="invoice__summary-total">${vat23total}</td>`;
    invoicePositionsTableSum.appendChild(vat23finalrow);

  };

}