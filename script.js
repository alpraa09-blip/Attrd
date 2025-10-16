const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const amountInput = document.getElementById("amount");
const resultInput = document.getElementById("result-amount");
const resultText = document.getElementById("result-text");
const rateText = document.getElementById("rate-text");
const lastUpdate = document.getElementById("last-update");
const swapBtn = document.getElementById("swap");

async function loadCurrencies() {
  const res = await fetch("https://api.exchangerate.host/symbols");
  const data = await res.json();
  const symbols = data.symbols;

  for (let code in symbols) {
    const option1 = document.createElement("option");
    option1.value = code;
    option1.textContent = `${symbols[code].description} (${code})`;
    fromSelect.appendChild(option1);

    const option2 = option1.cloneNode(true);
    toSelect.appendChild(option2);
  }

  fromSelect.value = "USD";
  toSelect.value = "EUR";
  convertCurrency();
}

async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || amount <= 0) {
    resultInput.value = "";
    resultText.textContent = "أدخل مبلغًا صالحًا";
    return;
  }

  const res = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
  const data = await res.json();

  resultInput.value = data.result.toFixed(2);
  resultText.textContent = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
  rateText.textContent = `سعر الصرف: 1 ${from} = ${data.info.rate.toFixed(4)} ${to}`;
  lastUpdate.textContent = `آخر تحديث: ${new Date().toLocaleTimeString("ar-EG")}`;
}

swapBtn.addEventListener("click", () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  convertCurrency();
});

amountInput.addEventListener("input", convertCurrency);
fromSelect.addEventListener("change", convertCurrency);
toSelect.addEventListener("change", convertCurrency);

loadCurrencies();
