const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertedAmount = document.getElementById('converted-amount');
const resultText = document.getElementById('result-text');
const rateText = document.getElementById('rate-text');
const lastUpdate = document.getElementById('last-update');
const swapBtn = document.getElementById('swap-btn');

// تحميل كل العملات من API
async function loadCurrencies() {
  try {
    const res = await fetch('https://api.exchangerate.host/symbols');
    const data = await res.json();
    const symbols = data.symbols;

    for (let code in symbols) {
      const option1 = document.createElement('option');
      option1.value = code;
      option1.textContent = `${symbols[code].description} (${code})`;
      fromCurrency.appendChild(option1);

      const option2 = option1.cloneNode(true);
      toCurrency.appendChild(option2);
    }

    fromCurrency.value = 'USD';
    toCurrency.value = 'EGP';
    convertCurrency();
  } catch (error) {
    alert('حدث خطأ أثناء تحميل العملات.');
  }
}

// دالة التحويل
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || amount <= 0) {
    convertedAmount.value = "";
    resultText.textContent = 'أدخل مبلغًا صالحًا';
    return;
  }

  const res = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
  const data = await res.json();

  const converted = data.result.toFixed(2);
  convertedAmount.value = converted;
  resultText.textContent = `${amount} ${from} = ${converted} ${to}`;
  rateText.textContent = `سعر الصرف: 1 ${from} = ${(data.info.rate).toFixed(4)} ${to}`;
  lastUpdate.textContent = `آخر تحديث: ${new Date().toLocaleString('ar-EG')}`;
}

// تبديل العملات
swapBtn.addEventListener('click', () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  convertCurrency();
});

amountInput.addEventListener('input', convertCurrency);
fromCurrency.addEventListener('change', convertCurrency);
toCurrency.addEventListener('change', convertCurrency);

// تحميل العملات أول ما الصفحة تفتح
loadCurrencies();
