// أسعار الصرف الافتراضية
const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    SAR: 3.75,
    AED: 3.67,
    EGP: 47.86,
    QAR: 3.64,
    KWD: 0.31,
    JPY: 151.50,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.90,
    CNY: 7.23
};

// أعلام العملات
const currencyFlags = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    SAR: '🇸🇦',
    AED: '🇦🇪',
    EGP: '🇪🇬',
    QAR: '🇶🇦',
    KWD: '🇰🇼',
    JPY: '🇯🇵',
    CAD: '🇨🇦',
    AUD: '🇦🇺',
    CHF: '🇨🇭',
    CNY: '🇨🇳'
};

// أسماء العملات بالعربية
const currencyNames = {
    USD: 'دولار أمريكي',
    EUR: 'يورو',
    GBP: 'جنيه إسترليني',
    SAR: 'ريال سعودي',
    AED: 'درهم إماراتي',
    EGP: 'جنيه مصري',
    QAR: 'ريال قطري',
    KWD: 'دينار كويتي',
    JPY: 'ين ياباني',
    CAD: 'دولار كندي',
    AUD: 'دولار أسترالي',
    CHF: 'فرنك سويسري',
    CNY: 'يوان صيني'
};

class CurrencyConverter {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupQuickAmounts();
        this.updateDisplay();
        this.startLiveUpdates();
    }

    initializeElements() {
        // عناصر الإدخال
        this.amountInput = document.getElementById('amount-input');
        this.resultInput = document.getElementById('result-input');
        this.fromCurrencySelect = document.getElementById('from-currency-select');
        this.toCurrencySelect = document.getElementById('to-currency-select');
        
        // عناصر العرض
        this.exchangeRate = document.getElementById('exchange-rate');
        this.lastUpdate = document.getElementById('last-update');
        this.liveBadge = document.getElementById('live-badge');
        
        // الأزرار
        this.swapButton = document.getElementById('swap-button');
        this.clearButton = document.getElementById('clear-btn');
        this.copyButton = document.getElementById('copy-btn');
        
        // معلومات العملة
        this.fromCurrencyInfo = document.querySelector('.from-currency .currency-info');
        this.toCurrencyInfo = document.querySelector('.to-currency .currency-info');
    }

    setupEventListeners() {
        // أحداث الإدخال
        this.amountInput.addEventListener('input', () => this.convert());
        this.fromCurrencySelect.addEventListener('change', () => this.updateCurrencyInfo());
        this.toCurrencySelect.addEventListener('change', () => this.updateCurrencyInfo());
        
        // أحداث الأزرار
        this.swapButton.addEventListener('click', () => this.swapCurrencies());
        this.clearButton.addEventListener('click', () => this.clearAmount());
        this.copyButton.addEventListener('click', () => this.copyResult());
        
        // أحداث لوحة المفاتيح
        this.amountInput.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // تحديث تلقائي
        setInterval(() => this.simulateLiveUpdate(), 30000);
    }

    setupQuickAmounts() {
        document.querySelectorAll('.quick-amount').forEach(button => {
            button.addEventListener('click', (e) => {
                const amount = e.target.dataset.amount;
                this.amountInput.value = amount;
                this.convert();
                
                // تأثير النقر
                e.target.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    e.target.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    convert() {
        const amount = parseFloat(this.amountInput.value) || 0;
        const fromCurrency = this.fromCurrencySelect.value;
        const toCurrency = this.toCurrencySelect.value;
        
        if (amount < 0) {
            this.showError('الرجاء إدخال مبلغ صحيح');
            return;
        }
        
        if (fromCurrency === toCurrency) {
            this.resultInput.value = this.formatNumber(amount);
            this.updateExchangeRateDisplay(amount, fromCurrency, amount, toCurrency);
            return;
        }
        
        const converted = this.calculateConversion(amount, fromCurrency, toCurrency);
        this.resultInput.value = this.formatNumber(converted);
        this.updateExchangeRateDisplay(amount, fromCurrency, converted, toCurrency);
    }

    calculateConversion(amount, from, to) {
        const amountInUSD = amount / exchangeRates[from];
        return amountInUSD * exchangeRates[to];
    }

    updateExchangeRateDisplay(amountFrom, currencyFrom, amountTo, currencyTo) {
        const rate = exchangeRates[currencyTo] / exchangeRates[currencyFrom];
        
        this.exchangeRate.textContent = 
            `1 ${currencyFrom} = ${rate.toFixed(4)} ${currencyTo}`;
        
        this.lastUpdate.textContent = this.getCurrentTime();
    }

    swapCurrencies() {
        const temp = this.fromCurrencySelect.value;
        this.fromCurrencySelect.value = this.toCurrencySelect.value;
        this.toCurrencySelect.value = temp;
        
        this.updateCurrencyInfo();
        this.convert();
        
        // تأثير الحركة
        this.swapButton.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.swapButton.style.transform = 'rotate(0deg)';
        }, 300);
    }

    updateCurrencyInfo() {
        const fromCurrency = this.fromCurrencySelect.value;
        const toCurrency = this.toCurrencySelect.value;
        
        this.fromCurrencyInfo.innerHTML = `
            <span class="currency-flag">${currencyFlags[fromCurrency]}</span>
            <span class="currency-code">${fromCurrency}</span>
            <span class="currency-name">${currencyNames[fromCurrency]}</span>
        `;
        
        this.toCurrencyInfo.innerHTML = `
            <span class="currency-flag">${currencyFlags[toCurrency]}</span>
            <span class="currency-code">${toCurrency}</span>
            <span class="currency-name">${currencyNames[toCurrency]}</span>
        `;
        
        this.convert();
    }

    clearAmount() {
        this.amountInput.value = '';
        this.resultInput.value = '0.00';
        this.amountInput.focus();
        
        // تأثير النقر
        this.clearButton.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.clearButton.style.transform = 'scale(1)';
        }, 150);
    }

    copyResult() {
        navigator.clipboard.writeText(this.resultInput.value).then(() => {
            this.showNotification('تم نسخ النتيجة!');
            
            // تأثير النقر
            this.copyButton.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.copyButton.style.transform = 'scale(1)';
            }, 150);
        });
    }

    formatNumber(num) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    simulateLiveUpdate() {
        // محاكاة تحديث الأسعار الحية
        Object.keys(exchangeRates).forEach(currency => {
            if (currency !== 'USD') {
                const change = 1 + (Math.random() * 0.01 - 0.005);
                exchangeRates[currency] *= change;
            }
        });
        
        this.convert();
        this.showLiveUpdate();
    }

    showLiveUpdate() {
        this.liveBadge.style.animation = 'none';
        setTimeout(() => {
            this.liveBadge.style.animation = '';
        }, 100);
    }

    startLiveUpdates() {
        setInterval(() => this.simulateLiveUpdate(), 30000);
    }

    handleKeyPress(e) {
        // منع الإدخال غير الرقمي
        if (!/[0-9]|\.|Backspace|Delete|Tab|ArrowLeft|ArrowRight/.test(e.key) && !e.ctrlKey) {
            e.preventDefault();
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--success);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-size: 14px;
            font-weight: 600;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    showError(message) {
        this.resultInput.value = '0.00';
        this.exchangeRate.textContent = message;
        this.exchangeRate.style.color = 'var(--error)';
        
        setTimeout(() => {
            this.exchangeRate.style.color = '';
        }, 2000);
    }

    updateDisplay() {
        this.updateCurrencyInfo();
        this.convert();
    }
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
});

// تأثيرات عند التحميل
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
