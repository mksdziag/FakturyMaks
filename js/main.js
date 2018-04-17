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


const itemNameInp = document.querySelector('.item__name');
const itemUnitInp = document.querySelector('.item__unit');
const itemQuantInp = document.querySelector('.item__quantity');
const itemPrice = document.querySelector('.item__price');
const itemNetVal = document.querySelector('.item__net-value');
const itemTaxRate = document.querySelector('.item__tax-rate');
const itemTotVal = document.querySelector('.item__total-value');
const addBtn = document.querySelector('.btn--add-item');



// generate invoice event listener

genBtn.addEventListener('click', generateInvoice);
addBtn.addEventListener('click', addItem);


// function addItem() {
//   const item
//   itemNameInp.value
//   itemUnitInp.value
//   itemQuantInp.value
//   itemPrice.value
//   itemNetVal.value
//   itemTaxRate.value
//   itemTotVal.value

// }


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