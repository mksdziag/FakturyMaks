// import { v4 } from "uuid";
// import "../sass/main.scss";

const uiController = (function() {
  // defining DOM elements
  const DOMElements = {
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
    sellerSaveBtn: document.querySelector(".btn--seller-save"),
    sellerLoadBtn: document.querySelector(".btn--seller-load"),

    // buyer data inputs
    buyerNameInp: document.querySelector(".data__buyer-name"),
    buyerStreetInp: document.querySelector(".data__buyer-street"),
    buyerCityInp: document.querySelector(".data__buyer-city"),
    buyerPostCodeInp: document.querySelector(".data__buyer-post-code"),
    buyerNipInp: document.querySelector(".data__buyer-nip"),
    buyerSaveBtn: document.querySelector(".btn--buyer-save"),
    buyerLoadTrigger: document.querySelector(".btn--buyer-load"),

    // payment terms inputs
    payMethodInp: document.querySelector(".payment__method"),
    payTermInp: document.querySelector(".payment__term"),
    payAccountInp: document.querySelector(".payment__account"),
    accountSaveBtn: document.querySelector(".btn--account-save"),
    accountLoadBtn: document.querySelector(".btn--account-load"),

    // draft positions inputs
    itemNameInp: document.querySelector(".draft-item__name"),
    itemUnitInp: document.querySelector(".draft-item__unit"),
    itemQuantInp: document.querySelector(".draft-item__quantity"),
    itemPriceInp: document.querySelector(".draft-item__price"),
    itemNetValInp: document.querySelector(".draft-item__net-value"),
    itemTaxRateInp: document.querySelector(".draft-item__tax-rate"),
    itemTaxValInp: document.querySelector(".draft-item__tax-value"),
    itemTotValInp: document.querySelector(".draft-item__total-value"),
    itemSaveBtn: document.querySelector(".btn--item-save"),
    itemLoadTrigger: document.querySelector(".btn--item-load"),
    itemsListModal: document.querySelector(".items-load__modal"),
    itemsListModalClose: document.querySelector(".btn--close-items-modal"),
    itemsLoadList: document.querySelector(".items-load__list"),

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
    invFinalAccount: document.querySelector(".invoice__final-payment__account"),
  };

  // displaying draft item taxes in draft item constructor form
  const displayDraftItemNotFilledInputs = function() {
    // if there is fullfilled draft item quantity and net price can calculate:
    if (DOMElements.itemQuantInp.value !== "" && DOMElements.itemPriceInp.value !== "") {
      // net value ptoduct price * quantity
      DOMElements.itemNetValInp.value = (
        DOMElements.itemPriceInp.valueAsNumber * DOMElements.itemQuantInp.valueAsNumber
      ).toFixed(2);
      // tax value
      DOMElements.itemTaxValInp.value = (
        DOMElements.itemQuantInp.valueAsNumber *
        DOMElements.itemPriceInp.valueAsNumber *
        parseFloat(DOMElements.itemTaxRateInp.value / 100)
      ).toFixed(2);
      // item total price
      DOMElements.itemTotValInp.value = (
        DOMElements.itemNetValInp.valueAsNumber + DOMElements.itemTaxValInp.valueAsNumber
      ).toFixed(2);
    }
  };

  // clearing draft item input fields
  const clearDraftItemFieds = function() {
    DOMElements.draftItemConstructor.reset();
    DOMElements.itemNameInp.focus();
  };

  // add item to draft table
  const addItemToDraftItemsList = function(id) {
    const item = storageController.draftItemsData.items.find(item => item.id === id);
    console.table(item);
    // create newtable row
    const newRow = document.createElement("tr");
    newRow.classList.add("draft__position");
    newRow.id = `draft-item-${item.id}`;
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

  // helper function for cleat innner HTML in given element
  const clearInnerHtml = function(elem) {
    elem.innerHTML = "";
  };

  // building draft items table from start
  const rebuildDraftItemsTable = function() {
    clearInnerHtml(DOMElements.draftItemTable);
    // for each drafted item perform same action
    storageController.draftItemsData.items.forEach(item => {
      // create newtable row
      const newRow = document.createElement("tr");
      newRow.classList.add("draft__position");
      newRow.id = `draft-item-${item.id}`;
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
    });
  };

  // building draft sum values in draft table
  const buildDraftSumValues = function() {
    // remove all content from summary draft table
    clearInnerHtml(DOMElements.drawtSumTable);

    const draftSumRow = document.createElement("tr");
    draftSumRow.classList.add("draft__summary-row");
    draftSumRow.innerHTML = `
    <th colspan="5" class="draft__summary-legend">Razem:</th>
    <th class="draft__summary-net-value">${storageController.draftItemsData.summaries.totalNetVal.toFixed(
      2
    )}</th>
    <th class=""></th>
    <th class="draft__summary-vat-value">${storageController.draftItemsData.summaries.totalTaxVal.toFixed(
      2
    )}</th>
    <th class="draft__summary-total">${storageController.draftItemsData.summaries.total.toFixed(
      2
    )}</th>`;
    DOMElements.drawtSumTable.appendChild(draftSumRow);
  };

  const generateDraftSumRow = function(areTaxRateItems, checkingTaxRate) {
    const checkedTaxRate =
      storageController.draftItemsData.summaries.taxRates[`tax${checkingTaxRate}`];
    if (areTaxRateItems) {
      const taxRatefinalRow = document.createElement("tr");
      taxRatefinalRow.classList.add("draft__summary-row");
      taxRatefinalRow.innerHTML = `
      <td colspan="5" class="draft__summary-legend">W tym:</td>
      <td class="draft__summary-net-value">${checkedTaxRate.netValue.toFixed(2)}</td>
      <td class="">${checkingTaxRate}%</td>
      <td class="draft__summary-vat-value">${checkedTaxRate.taxValue.toFixed(2)}</td>
      <td class="draft__summary-total">${checkedTaxRate.taxTotal.toFixed(2)}</td>`;
      DOMElements.drawtSumTable.appendChild(taxRatefinalRow);
    }
  };

  const generateInvoice = function() {
    const invoiceObj = storageController.invoices.invoice.details;
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
    DOMElements.invFinalToPay.textContent = `Do zapłaty: ${invoiceObj.payment.toPay.toFixed(
      2
    )} PLN`;
    DOMElements.invFinalPayMethod.textContent = `Sposób płatności: ${invoiceObj.payment.method}`;
    DOMElements.invFinalPayTerm.textContent = `Termin płatności: ${invoiceObj.payment.term}`;
    // print account number if choosen method is different than cash
    if (invoiceObj.payment.method !== "gotówka") {
      DOMElements.invFinalAccount.textContent = `Konto: ${invoiceObj.payment.account}`;
    } else {
      DOMElements.invFinalAccount.textContent = ``;
    }
  };

  const generateInvoicePositions = function(positionsArray) {
    clearInnerHtml(DOMElements.invoicePositionsTable);
    clearInnerHtml(DOMElements.invoicePositionsTableSum);

    positionsArray.forEach(item => {
      const newRow = document.createElement("tr");
      newRow.classList.add("invoice__position");
      newRow.id = `invoice-item${item.id}`;
      newRow.dataset.identifier = `${item.id}`;
      newRow.innerHTML = `
          <td class="invoice__item-lp">${positionsArray.indexOf(item) + 1}</td>
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
    const totalNetVal = storageController.draftItemsData.summaries.totalNetVal;
    const totalTaxVal = storageController.draftItemsData.summaries.totalTaxVal;
    const total = storageController.draftItemsData.summaries.total;

    const invoiceSumRow = document.createElement("tr");
    invoiceSumRow.classList.add("invoice__summary-row");
    invoiceSumRow.innerHTML = `
    <th colspan="5" class="invoice__summary-legend">Razem:</th>
    <th class="invoice__summary-net-value">${totalNetVal.toFixed(2)}</th>
    <th class=""></th>
    <th class="invoice__summary-vat-value">${totalTaxVal.toFixed(2)}</th>
    <th class="invoice__summary-total">${total.toFixed(2)}</th>`;
    DOMElements.invoicePositionsTable.appendChild(invoiceSumRow);

    // generate boolean values for check it there are some products with specific tax rates
    const isTax23 = positionsArray.some(item => item.taxRate === 23);
    const isTax8 = positionsArray.some(item => item.taxRate === 8);
    const isTax5 = positionsArray.some(item => item.taxRate === 5);
    const isTax3 = positionsArray.some(item => item.taxRate === 3);
    const isTax00 = positionsArray.some(item => item.taxRate === 0);

    //  generate summaries by vat rate
    generateInvoiceSumRow(isTax23, 23);
    generateInvoiceSumRow(isTax8, 8);
    generateInvoiceSumRow(isTax5, 5);
    generateInvoiceSumRow(isTax3, 3);
    generateInvoiceSumRow(isTax00, 0);
  };

  // generate invoice positions sum row for each existing in draft items tavle tax rate determined by first argument the boolean value
  const generateInvoiceSumRow = function(isTaxRate, checkingTaxRate) {
    const checkedTaxRate =
      storageController.draftItemsData.summaries.taxRates[`tax${checkingTaxRate}`];
    if (isTaxRate) {
      const vatRatefinalrow = document.createElement("tr");
      vatRatefinalrow.classList.add("invoice__summary-row");
      vatRatefinalrow.innerHTML = `
        <td colspan="5" class="invoice__summary-legend">W tym:</td>
        <td class="invoice__summary-net-value">${checkedTaxRate.netValue.toFixed(2)}</td>
        <td class="">${checkingTaxRate}%</td>
        <td class="invoice__summary-vat-value">${checkedTaxRate.taxValue.toFixed(2)}</td>
        <td class="invoice__summary-total">${checkedTaxRate.taxTotal.toFixed(2)}</td>`;
      DOMElements.invoicePositionsTable.appendChild(vatRatefinalrow);
    }
  };

  // showing modal complete
  const showCompleteInfo = function() {
    document.querySelector(".not-completed-form-modal").classList.add("visible");
    setTimeout(hidemodal, 2500);

    function hidemodal() {
      document.querySelector(".not-completed-form-modal").classList.remove("visible");
    }
  };

  const activatePrintInvoice = function() {
    DOMElements.printBtn.removeAttribute("disabled");
  };

  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Revealed methods 
  ----------------------------------------------------*/
  return {
    DOMElements,
    displayDraftItemNotFilledInputs,
    clearDraftItemFieds,
    rebuildDraftItemsTable,
    addItemToDraftItemsList,
    generateDraftSumRow,
    buildDraftSumValues,
    generateInvoice,
    generateInvoicePositions,
    showCompleteInfo,
    activatePrintInvoice,
  };
})();

/*-----------------------------------------------------
  Storage Controller 
  ----------------------------------------------------*/

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
          taxTotal: 0,
        },
        tax8: {
          netValue: 0,
          taxValue: 0,
          taxTotal: 0,
        },
        tax5: {
          netValue: 0,
          taxValue: 0,
          taxTotal: 0,
        },
        tax3: {
          netValue: 0,
          taxValue: 0,
          taxTotal: 0,
        },
        tax0: {
          netValue: 0,
          taxValue: 0,
          taxTotal: 0,
        },
      },
    },
  };

  const invoices = {
    invoice: {},
  };

  const DOMElements = uiController.DOMElements;

  const createInvoiceObj = function() {
    const invoice = {
      details: {
        document: {
          type: DOMElements.docTypeInp.value,
          number: DOMElements.docNumInp.value,
          place: DOMElements.docPlaceInp.value,
          date: DOMElements.docDateInp.value,
          sellDate: DOMElements.docSellDateInp.value,
        },
        seller: {
          name: DOMElements.sellerNameInp.value,
          street: DOMElements.sellerStreetInp.value,
          city: DOMElements.sellerCityInp.value,
          postCode: DOMElements.sellerPostCodeInp.value,
          nip: DOMElements.sellerNipInp.value,
        },
        buyer: {
          name: DOMElements.buyerNameInp.value,
          street: DOMElements.buyerStreetInp.value,
          city: DOMElements.buyerCityInp.value,
          postCode: DOMElements.buyerPostCodeInp.value,
          nip: DOMElements.buyerNipInp.value,
        },
        payment: {
          toPay: draftItemsData.summaries.total,
          method: DOMElements.payMethodInp.value,
          term: DOMElements.payTermInp.value,
          account: DOMElements.payAccountInp.value,
        },
      },
      positions: draftItemsData.items,
    };
    invoices.invoice = invoice;
  };

  const deleteDraftItem = function(delID) {
    draftItemsData.items = draftItemsData.items.filter(item => item.id != delID);
  };

  const createNewItem = function(id) {
    const newItem = {
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
      },
    };
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
  };

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
    }
  };

  // creating vat rates summaries in storage controller and building summaries rows in draft items table
  const createDraftVatRatesValues = function() {
    // boolean values for check if there are some products with specific tax rates
    const isTax00 = draftItemsData.items.some(item => item.taxRate === 0);
    const isTax3 = draftItemsData.items.some(item => item.taxRate === 3);
    const isTax5 = draftItemsData.items.some(item => item.taxRate === 5);
    const isTax8 = draftItemsData.items.some(item => item.taxRate === 8);
    const isTax23 = draftItemsData.items.some(item => item.taxRate === 23);

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

  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Revealed methods 
  ----------------------------------------------------*/
  return {
    invoices,
    draftItemsData,
    createNewItem,
    deleteDraftItem,
    createDraftVatRatesValues,
    createInvoiceObj,
    calculateDraftItemsTotals,
  };
})();

/*-----------------------------------------------------
  App Controller
----------------------------------------------------*/

const appController = (function(StorageCtrl, UiCtrl) {
  const DOMElements = UiCtrl.DOMElements;

  const loadEventListeners = function() {
    // generate invoice event listener
    DOMElements.genBtn.addEventListener("click", generateInvoice);
    // event listeners for draft section
    DOMElements.addBtn.addEventListener("click", addItem);
    DOMElements.itemQuantInp.addEventListener("change", calculateDraftItem);
    DOMElements.itemPriceInp.addEventListener("change", calculateDraftItem);
    DOMElements.itemNetValInp.addEventListener("change", calculateDraftItem);
    DOMElements.itemTaxRateInp.addEventListener("change", calculateDraftItem);
    DOMElements.draftItemTable.addEventListener("click", deleteDraftItem);

    // event listeners for verification for inputs section
    DOMElements.dataInpuForm.addEventListener("keyup", verifyInputField);
    DOMElements.dataInpuForm.addEventListener("change", verifyInputField);
    DOMElements.draftItemConstructor.addEventListener("keyup", verifyDraftItemInput);

    DOMElements.payMethodInp.addEventListener("change", isBankAccountCheck);

    // local storage save and load listeners
    DOMElements.sellerSaveBtn.addEventListener("click", saveSeller);
    DOMElements.sellerLoadBtn.addEventListener("click", loadSeller);
    DOMElements.buyerSaveBtn.addEventListener("click", saveBuyer);
    DOMElements.buyerLoadTrigger.addEventListener("click", retrieveBuyers);
    DOMElements.accountSaveBtn.addEventListener("click", saveAccount);
    DOMElements.accountLoadBtn.addEventListener("click", loadAccount);
    DOMElements.itemSaveBtn.addEventListener("click", saveItem);
    DOMElements.itemLoadTrigger.addEventListener("click", retrieveItems);
    DOMElements.itemsListModalClose.addEventListener("click", closeItemsModal);
    DOMElements.itemsLoadList.addEventListener("click", fillDraftInput);
  };

  // initialization function
  const init = function() {
    loadEventListeners();
  };
  const isBankAccountCheck = function(e) {
    if (e.target.value === "gotówka") {
      DOMElements.payAccountInp.parentElement.style.display = "none";
      DOMElements.payAccountInp.setAttribute("disabled", true);
      DOMElements.payAccountInp.value = "";
    } else {
      DOMElements.payAccountInp.parentElement.style.display = "flex";
      DOMElements.payAccountInp.removeAttribute("disabled");
    }
  };

  const verifyInputField = function(e) {
    if (e.target === DOMElements.sellerPostCodeInp || e.target === DOMElements.buyerPostCodeInp) {
      validationFunctions.validatePostCode(e);
    } else if (e.target === DOMElements.sellerNipInp || e.target === DOMElements.buyerNipInp) {
      validationFunctions.validateNip(e);
    } else if (e.target === DOMElements.payAccountInp) {
      if (
        DOMElements.payMethodInp.value !== "gotówka" ||
        DOMElements.payMethodInp.value !== "pobranie"
      ) {
        validationFunctions.validateAccount(e);
      }
    } else {
      validationFunctions.validateFillInFormInput(e);
    }
  };

  const verifyDraftItemInput = function(e) {
    validationFunctions.validateDraftItemInputs(e);
  };

  const verifyCompletedForm = function() {
    let inputs = Array.from(DOMElements.dataInpuForm.getElementsByClassName("input"));

    // If payment method is 'gotówka' cuts this field from inputs array to not validate ir
    if (DOMElements.payMethodInp.value === "gotówka") {
      inputs = inputs.filter(item => item.classList.contains("payment__account") === false);
    }
    if (inputs.some(input => input.value === "" || input.value === " ")) {
      inputs
        .filter(input => input.value === "" || input.value === " ")
        .forEach(input => input.classList.add("invalid"));
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
        e.target.classList.add("invalid");
      } else {
        e.target.classList.remove("invalid");
      }
    },
    validateNip: function(e) {
      const reg = /^\d{3}[- ]?\d{3}[- ]?\d\d[- ]?\d\d\s?$/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add("invalid");
      } else {
        e.target.classList.remove("invalid");
      }
    },
    validateAccount: function(e) {
      const reg = /^([A-Za-z]{2})?[ ]?\d{2}([ ]?\d{4}){6}\s?$/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add("invalid");
      } else {
        e.target.classList.remove("invalid");
      }
    },
    validateFillInFormInput: function(e) {
      const reg = /[A-Za-z\d]+/;
      if (!reg.test(e.target.value)) {
        e.target.classList.add("invalid");
      } else {
        e.target.classList.remove("invalid");
      }
    },
    validateDraftItemInputs: function(e) {
      if (
        DOMElements.itemNameInp.value !== "" &&
        DOMElements.itemNameInp.value !== "" &&
        DOMElements.itemQuantInp.value !== "" &&
        DOMElements.itemPriceInp.value !== ""
      ) {
        DOMElements.addBtn.disabled = false;
      } else {
        DOMElements.addBtn.disabled = true;
      }
    },
  };

  const addItem = function() {
    const newItemId = v4();
    storageController.createNewItem(newItemId);
    storageController.calculateDraftItemsTotals();
    UiCtrl.clearDraftItemFieds();
    UiCtrl.addItemToDraftItemsList(newItemId);
    StorageCtrl.createDraftVatRatesValues();
    UiCtrl.buildDraftSumValues();
    storageController.createDraftVatRatesValues();
    DOMElements.addBtn.disabled = true;
  };

  const calculateDraftItem = function() {
    // calculate and display not filled draft input values and placing it's values as input value
    UiCtrl.displayDraftItemNotFilledInputs();
  };

  const deleteDraftItem = function(e) {
    if (e.target.classList.contains("btn--item-del")) {
      // determine id of target item
      const delID = e.target.parentElement.parentElement.dataset.identifier;
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
  const generateInvoice = function() {
    const verified = verifyCompletedForm();
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

  const saveSeller = function(e) {
    e.preventDefault();

    const seller = {
      name: DOMElements.sellerNameInp.value,
      street: DOMElements.sellerStreetInp.value,
      city: DOMElements.sellerCityInp.value,
      postCode: DOMElements.sellerPostCodeInp.value,
      nip: DOMElements.sellerNipInp.value,
    };

    localStorage.setItem("seller", JSON.stringify(seller));
  };

  const loadSeller = function(e) {
    e.preventDefault();

    const seller = JSON.parse(localStorage.getItem("seller"));

    DOMElements.sellerNameInp.value = seller.name;
    DOMElements.sellerStreetInp.value = seller.street;
    DOMElements.sellerCityInp.value = seller.city;
    DOMElements.sellerPostCodeInp.value = seller.postCode;
    DOMElements.sellerNipInp.value = seller.nip;
  };

  const saveBuyer = function(e) {
    e.preventDefault();

    const buyer = {
      name: DOMElements.buyerNameInp.value,
      street: DOMElements.buyerStreetInp.value,
      city: DOMElements.buyerCityInp.value,
      postCode: DOMElements.buyerPostCodeInp.value,
      nip: DOMElements.buyerNipInp.value,
    };

    let buyers = {};
    if (localStorage.getItem("buyers")) {
      buyers = JSON.parse(localStorage.getItem("buyers"));
    }

    buyers[buyer.name] = buyer;

    localStorage.setItem("buyers", JSON.stringify(buyers));
  };

  const retrieveBuyers = function(e) {
    console.log("not yet baby");
  };

  const saveAccount = function(e) {
    e.preventDefault();

    const sellerAccount = {
      accountNumber: DOMElements.payAccountInp.value,
    };

    localStorage.setItem("sellerAccount", JSON.stringify(sellerAccount));
  };

  const loadAccount = function(e) {
    e.preventDefault();

    const sellerAccount = JSON.parse(localStorage.getItem("sellerAccount"));

    DOMElements.payAccountInp.value = sellerAccount.accountNumber;
  };

  const saveItem = function(e) {
    e.preventDefault();

    const item = {
      name: DOMElements.itemNameInp.value,
      unit: DOMElements.itemUnitInp.value,
      netPrice: DOMElements.itemPriceInp.valueAsNumber,
      taxRate: parseFloat(DOMElements.itemTaxRateInp.value),
    };

    let items = {};
    if (localStorage.getItem("items")) {
      items = JSON.parse(localStorage.getItem("items"));
    }

    items[item.name] = item;

    localStorage.setItem("items", JSON.stringify(items));
  };

  const retrieveItems = function(e) {
    e.preventDefault();
    // modal classlist add active
    DOMElements.itemsListModal.style = "display: block";
    setTimeout(() => {
      DOMElements.itemsListModal.classList.add("modal-active");
    }, 10);
    // localstorage list items
    let items = [];
    if (localStorage.getItem("items")) {
      let htmlOutput = "";
      const localStorageItems = JSON.parse(localStorage.getItem("items"));
      items = Object.entries(localStorageItems);
      console.log(items);
      items.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("items-load__item");

        const loadButton = document.createElement("button");
        loadButton.classList.add("btn");
        loadButton.classList.add("btn--load");
        loadButton.dataset.itemName = item[1].name;
        loadButton.textContent = "Wybierz";

        const nameSpan = document.createElement("span");
        nameSpan.classList.add("items-load__item-name");
        nameSpan.textContent = item[1].name;

        const priceSpan = document.createElement("span");
        priceSpan.classList.add("items-load__item-price");
        priceSpan.textContent = item[1].netPrice;

        const taxSpan = document.createElement("span");
        taxSpan.classList.add("items-load__item-tax");
        taxSpan.textContent = item[1].taxRate;

        li.appendChild(loadButton);
        li.appendChild(nameSpan);
        li.appendChild(priceSpan);
        li.appendChild(taxSpan);
        console.log(li);
        DOMElements.itemsLoadList.appendChild(li);
      });
    } else {
      DOMElements.itemsLoadList.textContent =
        "Nie ma żadnych produków zapisanych w twojej przeglądarce.";
    }
  };

  const fillDraftInput = function(e) {
    if (e.target.classList.contains("btn--load")) {
      console.log(e.target.dataset.itemName);
      const items = JSON.parse(localStorage.getItem("items"));
      const item = items[e.target.dataset.itemName];
      DOMElements.itemNameInp.value = item.name;
      DOMElements.itemUnitInp.value = item.unit;
      DOMElements.itemPriceInp.value = item.netPrice;
      DOMElements.itemTaxRateInp.value = item.taxRate;
      closeItemsModal();
    }
  };

  const closeItemsModal = function() {
    DOMElements.itemsListModal.classList.remove("modal-active");
    setTimeout(() => {
      DOMElements.itemsListModal.style = "display: none";
    }, 250);
    DOMElements.itemsLoadList.innerHTML = "";
  };

  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Revealed methods 
  ----------------------------------------------------*/
  return {
    init,
  };
})(storageController, uiController);

appController.init();

// print js script for printing
$(".btn--print-inv").on("click", function() {
  $(".invoice").printThis();
});
