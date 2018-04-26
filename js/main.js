const uiController = (function() {
  // defining DOM elements
  const DOMElements = {
    // Invoice details input elements
    dataInpufField: document.querySelector('.data-form'),
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
    // buyer data inputs
    buyerNameInp: document.querySelector('.data__buyer-name'),
    buyerStreetInp: document.querySelector('.data__buyer-street'),
    buyerCityInp: document.querySelector('.data__buyer-city'),
    buyerPostCodeInp: document.querySelector('.data__buyer-post-code'),
    buyerNipInp: document.querySelector('.data__buyer-nip'),
    // payment terms inputs
    payMethodInp: document.querySelector('.payment__method'),
    payTermInp: document.querySelector('.payment__term'),
    payAccountInp: document.querySelector('.payment__account'),
    // draft positions inputs
    itemNameInp: document.querySelector('.draft-item__name'),
    itemUnitInp: document.querySelector('.draft-item__unit'),
    itemQuantInp: document.querySelector('.draft-item__quantity'),
    itemPriceInp: document.querySelector('.draft-item__price'),
    itemNetValInp: document.querySelector('.draft-item__net-value'),
    itemTaxRateInp: document.querySelector('.draft-item__tax-rate'),
    itemTaxValInp: document.querySelector('.draft-item__tax-value'),
    itemTotValInp: document.querySelector('.draft-item__total-value'),
    // draft add button
    addBtn: document.querySelector('.btn--add-item'),
    // draft itens table
    draftItemConstructor: document.querySelector('.draft-item__constructor'),
    draftItemTable: document.querySelector('.draft-added-items'),
    drawtSumTable: document.querySelector('.draft__summary'),
    itemDelBtn: document.querySelectorAll('.btn--item-del'),
    // button generate invoice
    genBtn: document.querySelector('.btn--gen-inv'),
    // --------------------------------------------------------------------
    //output invoice elements ---------------------------------------------
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
    invFinalAccount: document.querySelector('.invoice__final-payment__account'),

  };

  // calculating draft item taxes in draft item constructor form
  const calculateDraftItemNotFilledInputs = function() {
    // if there is fullfilled draft item quantity and net price can calculate:
    if (DOMElements.itemQuantInp.value !== '' && DOMElements.itemPriceInp.value !== '') {
      // net value ptoduct price * quantity
      DOMElements.itemNetValInp.value = (DOMElements.itemPriceInp.valueAsNumber * DOMElements.itemQuantInp.valueAsNumber).toFixed(2);
      // tax value
      DOMElements.itemTaxValInp.value = (DOMElements.itemQuantInp.valueAsNumber * DOMElements.itemPriceInp.valueAsNumber * parseFloat(DOMElements.itemTaxRateInp.value / 100)).toFixed(2);
      // item total final price
      DOMElements.itemTotValInp.value = (DOMElements.itemPriceInp.valueAsNumber * DOMElements.itemQuantInp.valueAsNumber + DOMElements.itemQuantInp.valueAsNumber * DOMElements.itemPriceInp.valueAsNumber * parseFloat(DOMElements.itemTaxRateInp.value / 100)).toFixed(2);
    } else {
      return;
    }
  };

  // clearing draft item input fields
  const clearDraftItemFieds = function() {
    DOMElements.itemNameInp.value = '';
    DOMElements.itemQuantInp.value = '';
    DOMElements.itemPriceInp.value = '';
    DOMElements.itemNetValInp.value = '';
    DOMElements.itemTaxValInp.value = '';
    DOMElements.itemTotValInp.value = '';
    // target focus to item name field
    DOMElements.itemNameInp.focus();
  };

  // add item to drafr table
  const addItemToDraftItemsList = function() {
    const item = storageController.draftItemsData.items[storageController.draftItemsData.items.length - 1]
    // create newtable row
    const newRow = document.createElement('tr');
    newRow.classList.add('draft__position');
    newRow.id = `draft-item-${item.id}`
    newRow.dataset.identifier = `${item.id}`;
    newRow.innerHTML = `
      <td class="draft__item-delete"><button class="btn btn--item-del">usuń</button></td>
      <td class="draft__item-name">${item.name}</td>
      <td class="draft__item-unit">${item.unit}</td>
      <td class="draft__item-quantity">${item.quantity.toFixed(2)}</td>
      <td class="draft__item-price">${item.netPrice.toFixed(2)}</td>
      <td class="draft__item-net-value">${item.netValue.toFixed(2)}</td>
      <td class="draft__item-tax-rate">${item.taxRate}%</td>
      <td class="draft__item-tax-value">${item.taxValue.toFixed(2)}</td>
      <td class="draft__item-total-value">${item.total.toFixed(2)}</td>`;
    DOMElements.draftItemTable.appendChild(newRow);
  };

  // function for cleat innner HTML in given element
  const clearInnerHtml = function(elem) {
    elem.innerHTML = '';
  };

  // building draft items table from start
  const rebuildDraftItemsTable = function() {
    clearInnerHtml(DOMElements.draftItemTable);
    // for each drafted item perform same action
    storageController.draftItemsData.items.forEach(item => {
      const itemNewId = (storageController.draftItemsData.items.indexOf(item));
      // create newtable row
      const newRow = document.createElement('tr');
      newRow.classList.add('draft__position');
      newRow.id = `draft-item-${itemNewId}`
      newRow.dataset.identifier = `${itemNewId}`;
      newRow.innerHTML = `
      <td class="draft__item-delete"><button class="btn btn--item-del">usuń</button></td>
      <td class="draft__item-name">${item.name}</td>
      <td class="draft__item-unit">${item.unit}</td>
      <td class="draft__item-quantity">${item.quantity.toFixed(2)}</td>
      <td class="draft__item-price">${item.netPrice.toFixed(2)}</td>
      <td class="draft__item-net-value">${item.netValue.toFixed(2)}</td>
      <td class="draft__item-tax-rate">${item.taxRate}%</td>
      <td class="draft__item-tax-value">${item.taxValue.toFixed(2)}</td>
      <td class="draft__item-total-value">${item.total.toFixed(2)}</td>`;
      DOMElements.draftItemTable.appendChild(newRow);

    });
  };

  // building draft sum values in draft table
  const buildDraftSumValues = function() {
    // remove all content from summary draft table
    clearInnerHtml(DOMElements.drawtSumTable)

    const draftSumRow = document.createElement('tr');
    draftSumRow.classList.add('draft__summary-row');
    draftSumRow.innerHTML = `<th colspan="5" class="draft__summary-legend">Razem:</th>
                          <th class="draft__summary-net-value">${storageController.draftItemsData.summaries.totalNetVal.toFixed(2)}</th>
                          <th class=""></th>
                          <th class="draft__summary-vat-value">${storageController.draftItemsData.summaries.totalTaxVal.toFixed(2)}</th>
                          <th class="draft__summary-total">${storageController.draftItemsData.summaries.total.toFixed(2)}</th>`
    DOMElements.drawtSumTable.appendChild(draftSumRow);
  };


  const generateDraftSumRow = function(areTaxRateItems, checkingTaxRate) {
    const checkedTaxRate = storageController.draftItemsData.summaries.taxRates[`tax${checkingTaxRate}`];
    if (areTaxRateItems) {
      const taxRatefinalrow = document.createElement('tr');
      taxRatefinalrow.classList.add('draft__summary-row');
      taxRatefinalrow.innerHTML = `
                            <td colspan="5" class="draft__summary-legend">W tym:</td>
                            <td class="draft__summary-net-value">${checkedTaxRate.netValue.toFixed(2)}</td>
                            <td class="">${checkingTaxRate}%</td>
                            <td class="draft__summary-vat-value">${checkedTaxRate.taxValue.toFixed(2)}</td>
                            <td class="draft__summary-total">${checkedTaxRate.taxTotal.toFixed(2)}</td>`
      DOMElements.drawtSumTable.appendChild(taxRatefinalrow);
    } else {
      return;
    }
  };


  const generateInvoice = function() {
    const invoiceObj = storageController.invoicesData.invoice.details;
    // inserting details of the invoice
    DOMElements.invType.textContent = `${invoiceObj.document.type}`;
    DOMElements.invNum.textContent = `nr ${invoiceObj.document.number}`;
    DOMElements.invPlace.textContent = `Miejsce wystawienia: ${invoiceObj.document.place}`;
    DOMElements.invDate.textContent = `Data wystawienia: ${invoiceObj.document.date}`;
    DOMElements.invSellDate.textContent = `Data sprzedaży: ${invoiceObj.document.sellDate}`;
    DOMElements.invSellerName.textContent = `${invoiceObj.seller.name}`;
    DOMElements.invSellerStr.textContent = `${invoiceObj.seller.street}`;
    DOMElements.invSellerCity.textContent = `${invoiceObj.seller.city}`;
    DOMElements.invSellerPostCode.textContent = `${invoiceObj.seller.postCode}`;
    DOMElements.invSellerNip.textContent = `NIP: ${invoiceObj.seller.nip}`;
    DOMElements.invBuyerName.textContent = `${invoiceObj.buyer.name}`;
    DOMElements.invBuyerStr.textContent = `${invoiceObj.buyer.street}`;
    DOMElements.invBuyerCity.textContent = `${invoiceObj.buyer.city}`;
    DOMElements.invBuyerPostCode.textContent = `${invoiceObj.buyer.postCode}`;
    DOMElements.invBuyerNip.textContent = `NIP: ${invoiceObj.buyer.nip}`;
    DOMElements.invFinalToPay.textContent = `Do zapłaty: ${invoiceObj.payment.toPay} PLN`;
    DOMElements.invFinalPayMethod.textContent = `Sposób płatności: ${invoiceObj.payment.method}`;
    DOMElements.invFinalPayTerm.textContent = `Termin płatności: ${invoiceObj.payment.term}`;
    DOMElements.invFinalAccount.textContent = `Konto: ${invoiceObj.payment.account}`;

  };

  const generateInvoicePositions = function(positionsArray) {
    clearInnerHtml(DOMElements.invoicePositionsTable);
    clearInnerHtml(DOMElements.invoicePositionsTableSum);


    positionsArray.forEach(item => {
      const newRow = document.createElement('tr');
      newRow.classList.add('invoice__position');
      newRow.id = `invoice-item${item.id}`
      newRow.dataset.identifier = `${item.id}`;
      newRow.innerHTML = `
          <td class="invoice__item-lp">${positionsArray.indexOf(item)+1}</td>
          <td class="invoice__item-name">${item.name}</td>
          <td class="invoice__item-unit">${item.unit}</td>
          <td class="invoice__item-quantity">${item.quantity.toFixed(2)}</td>
          <td class="invoice__item-price">${item.netPrice.toFixed(2)}</td>
          <td class="invoice__item-net-value">${item.netValue.toFixed(2)}</td>
          <td class="invoice__item-tax-rate">${item.taxRate.toFixed(2)}</td>
          <td class="invoice__item-tax-value">${item.taxValue.toFixed(2)}</td>
          <td class="invoice__item-total-value">${item.total.toFixed(2)}</td>`;
      DOMElements.invoicePositionsTable.appendChild(newRow);
    });


    // invoice items summaries from draft items summaries section
    const sumaNet = storageController.draftItemsData.summaries.totalNetVal;
    const sumaVat = storageController.draftItemsData.summaries.totalTaxVal;
    const sumaTotal = storageController.draftItemsData.summaries.total;


    const invoiceSumRow = document.createElement('tr');
    invoiceSumRow.classList.add('invoice__summary-row');
    invoiceSumRow.innerHTML = `<th colspan="5" class="invoice__summary-legend">Razem:</th>
                            <th class="invoice__summary-net-value">${sumaNet.toFixed(2)}</th>
                            <th class=""></th>
                            <th class="invoice__summary-vat-value">${sumaVat.toFixed(2)}</th>
                            <th class="invoice__summary-total">${sumaTotal.toFixed(2)}</th>`
    DOMElements.invoicePositionsTable.appendChild(invoiceSumRow);


    // generate boolean values for check it there are some products with specific tax rates
    const areThere23 = positionsArray.some((item) => item.taxRate === 23);
    const areThere8 = positionsArray.some((item) => item.taxRate === 8);
    const areThere5 = positionsArray.some((item) => item.taxRate === 5);
    const areThere3 = positionsArray.some((item) => item.taxRate === 3);
    const areThere00 = positionsArray.some((item) => item.taxRate === 0);

    //  generate summaries by vat rate
    generateInvoiceSumRow(areThere23, 23);
    generateInvoiceSumRow(areThere8, 8);
    generateInvoiceSumRow(areThere5, 5);
    generateInvoiceSumRow(areThere3, 3);
    generateInvoiceSumRow(areThere00, 0);
  };

  // generate invoice positions sum row for each existing in draft items tavle tax rate determined by first argument the boolean value
  const generateInvoiceSumRow = function(areTaxRateItems, checkingTaxRate) {
    const checkedTaxRate = storageController.draftItemsData.summaries.taxRates[`tax${checkingTaxRate}`];
    if (areTaxRateItems) {
      const vatRatefinalrow = document.createElement('tr');
      vatRatefinalrow.classList.add('invoice__summary-row');
      vatRatefinalrow.innerHTML = `
                              <td colspan="5" class="invoice__summary-legend">W tym:</td>
                              <td class="invoice__summary-net-value">${checkedTaxRate.netValue.toFixed(2)}</td>
                              <td class="">${checkingTaxRate}%</td>
                              <td class="invoice__summary-vat-value">${checkedTaxRate.taxValue.toFixed(2)}</td>
                              <td class="invoice__summary-total">${checkedTaxRate.taxTotal.toFixed(2)}</td>`
      DOMElements.invoicePositionsTable.appendChild(vatRatefinalrow);
    }
  };


  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Revealed methods 
  ----------------------------------------------------*/
  return {
    DOMElements,
    calculateDraftItemNotFilledInputs,
    clearDraftItemFieds,
    rebuildDraftItemsTable,
    addItemToDraftItemsList,
    generateDraftSumRow,
    buildDraftSumValues,
    generateInvoice,
    generateInvoicePositions
  }

}())




const storageController = (function() {
  const draftItemsData = {
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


  const invoicesData = {
    invoice: {}
  };


  const DOM = uiController.DOMElements;


  const createInvoiceObj = function() {
    const invoice = {
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
          nip: DOM.sellerNipInp.value,
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
          account: DOM.payAccountInp.value,
        }

      },
      positions: draftItemsData.items

    }
    invoicesData.invoice = invoice;

  };

  const deleteDraftItem = function(delID) {
    draftItemsData.items = draftItemsData.items.filter((item) => {
      return draftItemsData.items.indexOf(item) != delID;
    });
    console.table(draftItemsData.items);
  };

  const generateNewItemId = function() {
    let newId = 0;
    if (draftItemsData.items.length === 0) {
      return newId;
    } else if (draftItemsData.items.length > 0) {
      const idsArray = draftItemsData.items.map(item => item.id).sort().reverse();
      return newId = idsArray[0] + 1;
    }
  }


  const createNewItem = function() {
    const newItem = {
      // asigning values to newitem
      id: generateNewItemId(),
      name: DOM.itemNameInp.value,
      unit: DOM.itemUnitInp.value,
      quantity: DOM.itemQuantInp.valueAsNumber,
      netPrice: DOM.itemPriceInp.valueAsNumber,
      netValue: DOM.itemNetValInp.valueAsNumber,
      taxRate: parseFloat(DOM.itemTaxRateInp.value),
      taxValue: DOM.itemTaxValInp.valueAsNumber,
      total: DOM.itemTotValInp.valueAsNumber
    }

    draftItemsData.items.push(newItem);
  };


  const calculateDraftItemsTotals = function() {
    const draftItemsTotal = draftItemsData.items.reduce((acc, item) => {
      return acc + item.total;
    }, 0);
    const draftItemsTotalNetValue = draftItemsData.items.reduce((acc, item) => {
      return acc + item.netValue;
    }, 0);
    const draftItemsTotalTaxValue = draftItemsData.items.reduce((acc, item) => {
      return acc + item.taxValue;
    }, 0);

    draftItemsData.summaries.total = draftItemsTotal;
    draftItemsData.summaries.totalNetVal = draftItemsTotalNetValue;
    draftItemsData.summaries.totalTaxVal = draftItemsTotalTaxValue;
    console.log(draftItemsData.summaries)
  }


  const claculateDraftTaxRatesValues = function(areTaxRateItems, checkingTaxRate) {
    if (areTaxRateItems) {
      const taxRateItemsArr = draftItemsData.items.filter(item => item.taxRate === checkingTaxRate);
      const taxRateNetValue = taxRateItemsArr.reduce((acc, item) => {
        return acc + item.netValue;
      }, 0);
      const taxRateTax = taxRateItemsArr.reduce((acc, item) => {
        return acc + item.taxValue;
      }, 0);
      const taxRateTotal = taxRateItemsArr.reduce((acc, item) => {
        return acc + item.total;
      }, 0);

      draftItemsData.summaries.taxRates[`tax${checkingTaxRate}`].taxValue = taxRateTax;
      draftItemsData.summaries.taxRates[`tax${checkingTaxRate}`].taxTotal = taxRateTotal;
      draftItemsData.summaries.taxRates[`tax${checkingTaxRate}`].netValue = taxRateNetValue;
    } else {
      return;
    }
  }

  // creating vat rates summaries in storage controller and building summaries rows in draft items table
  const createDraftVatRatesValues = function() {
    // boolean values for check if there are some products with specific tax rates
    const areThere00 = draftItemsData.items.some((item) => item.taxRate === 0);
    const areThere3 = draftItemsData.items.some((item) => item.taxRate === 3);
    const areThere5 = draftItemsData.items.some((item) => item.taxRate === 5);
    const areThere8 = draftItemsData.items.some((item) => item.taxRate === 8);
    const areThere23 = draftItemsData.items.some((item) => item.taxRate === 23);

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

  }


  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Revealed methods 
  ----------------------------------------------------*/
  return {
    invoicesData,
    draftItemsData,
    createNewItem,
    deleteDraftItem,
    createDraftVatRatesValues,
    createInvoiceObj,
    calculateDraftItemsTotals
  }

}())


const appController = (function(StorageCtrl, UiCtrl) {
  const DOM = UiCtrl.DOMElements;

  const loadEventListeners = function() {
    // generate invoice event listener
    DOM.genBtn.addEventListener('click', generateInvoice);
    // event listeners for draft section
    DOM.addBtn.addEventListener('click', addItem);
    DOM.itemQuantInp.addEventListener('change', calculateDraftItem);
    DOM.itemPriceInp.addEventListener('change', calculateDraftItem);
    DOM.itemNetValInp.addEventListener('change', calculateDraftItem);
    DOM.itemTaxRateInp.addEventListener('change', calculateDraftItem);
    DOM.draftItemTable.addEventListener('click', deleteDraftItem);

    // event listeners for verification for inputs section
    DOM.dataInpufField.addEventListener('keyup', verifyInputField);
    DOM.dataInpufField.addEventListener('change', verifyInputField);
    DOM.draftItemConstructor.addEventListener('keyup', verifyDraftItemInput);

  }

  // initialization function
  const init = function() {
    loadEventListeners();
  };


  const verifyInputField = function(e) {
    if (e.target === DOM.sellerPostCodeInp ||
      e.target === DOM.buyerPostCodeInp) {
      validationFunctions.validatePostCode(e);
    } else if (e.target === DOM.sellerNipInp ||
      e.target === DOM.buyerNipInp) {
      validationFunctions.validateNip(e);
    } else if (e.target === DOM.payAccountInp) {
      validationFunctions.validateAccount(e);
    } else {
      validationFunctions.validateFillInFormInput(e);
    }
  };


  const verifyDraftItemInput = function(e) {
    validationFunctions.validateDraftItemInputs(e)
  };


  const verifyCompletedForm = function() {
    const inputs = Array.from(document.querySelector('.data-form').getElementsByClassName('input'));
    if (inputs.some((input) => input.value === '' || input.value === ' ')) {
      inputs.filter(input => input.value === '' || input.value === ' ').forEach(input => input.classList.add('invalid'));
      return false;
    } else {
      return true;
    }
  };

  // validation functions object
  const validationFunctions = {
    validatePostCode: function(e) {
      const reg = /^\d\d-\d\d\d$/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add('invalid')
      } else {
        e.target.classList.remove('invalid')
      }
    },
    validateNip: function(e) {
      const reg = /^\d{3}[- ]?\d{3}[- ]?\d\d[- ]?\d\d\s?$/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add('invalid')
      } else {
        e.target.classList.remove('invalid')
      }
    },
    validateAccount: function(e) {
      const reg = /^([A-Za-z]{2})?[ ]?\d{2}([ ]?\d{4}){6}\s?$/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add('invalid')
      } else {
        e.target.classList.remove('invalid')
      }
    },
    validateFillInFormInput: function(e) {
      reg = /[A-Za-z\d]+/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add('invalid');
      } else {
        e.target.classList.remove('invalid');
      }
    },
    validateDraftItemInputs: function(e) {
      if (DOM.itemNameInp.value !== '' &&
        DOM.itemNameInp.value !== ' ' &&
        DOM.itemQuantInp.value !== '' &&
        DOM.itemPriceInp.value !== '') {
        DOM.addBtn.disabled = false;
      } else {
        DOM.addBtn.disabled = true;
      }
    }
  };




  const addItem = function() {
    storageController.createNewItem();
    storageController.calculateDraftItemsTotals();
    UiCtrl.clearDraftItemFieds();
    UiCtrl.addItemToDraftItemsList();
    console.table(StorageCtrl.draftItemsData.items);
    StorageCtrl.createDraftVatRatesValues();
    UiCtrl.buildDraftSumValues();
    storageController.createDraftVatRatesValues();
    DOM.addBtn.disabled = true;
  };


  const calculateDraftItem = function() {
    // calculate not filled draft input values and placing its values in input
    UiCtrl.calculateDraftItemNotFilledInputs();
  };


  const deleteDraftItem = function(e) {
    if (e.target.classList.contains('btn--item-del')) {
      // determine id of target item 
      const delID = (e.target.parentElement.parentElement.dataset.identifier);
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
    };
  };

  // function for generate new invoice object
  const generateInvoice = function() {
    const verified = verifyCompletedForm();
    if (!verified) {
      // create invoice object in storage
      StorageCtrl.createInvoiceObj();
      // generating invoice document
      UiCtrl.generateInvoice();
      // generate invoice positions from draft items
      UiCtrl.generateInvoicePositions(StorageCtrl.invoicesData.invoice.positions);
    } else {
      return;
    }
  };


  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Revealed methods 
  ----------------------------------------------------*/
  return {
    init

  }

}(storageController, uiController))

appController.init();