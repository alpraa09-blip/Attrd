// أسعار الصرف الافتراضية (لأغراض العرض والتجربة)
const defaultExchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 151.50,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.90,
    CNY: 7.23,
    SAR: 3.75,
    AED: 3.67,
    EGP: 47.86,
    QAR: 3.64,
    KWD: 0.31,
    BHD: 0.38,
    OMR: 0.38,
    JOD: 0.71,
    LBP: 89500,
    TRY: 32.05,
    INR: 83.30,
    RUB: 92.50
};

class CurrencyConverter {
    constructor() {
        this.exchangeRates = { ...defaultExchangeRates };
        this.initializeElements();
        this.bindEvents();
        this.loadExchangeRates();
    }

    initializeElements() {
        // عناصر الإدخال
        this.amountInput = document.getElementById('amount');
        this.fromCurrency = document.getElementById('from-currency');
        this.toCurrency = document.getElementById('to-currency');
        this.convertedAmount = document.getElementById('converted-amount');
        
        // عناصر التحكم
        this.swapBtn = document.getElementById('swap-btn');
        
        // عناصر العرض
        this.resultText = document.getElementById('result-text');
        this.rateText = document.getElementById('rate-text');
        this.lastUpdate = document.getElementById('last-update');
        this.loadingSpinner = document.getElementById('loading-spinner');
    }

    bindEvents() {
        // أحداث الإدخال
        this.amountInput.addEventListener('input', () => this.convertCurrency());
        this.fromCurrency.addEventListener('change', () => this.convertCurrency());
        this.toCurrency.addEventListener('change', () => this.convertCurrency());
        
        // أحداث الأزرار
        this.swapBtn.addEventListener('click', () => this.swapCurrencies());
        
        // أحداث لوحة المفاتيح
        this.amountInput.addEventListener('keypress', (e) => this.handleKeyPress(e));
        
        // تحديث تلقائي
        setInterval(() => this.loadExchangeRates(), 30000);
    }

    async loadExchangeRates() {
        try {
            this.showLoading(true);
            
            // في التطبيق الحقيقي، استخدم API مثل:
            // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            // const data = await response.json();
            // this.exchangeRates = data.rates;
            
            // لمحاكاة API حقيقي
            await this.simulateAPICall();
            
            this.convertCurrency();
            this.updateLastUpdateTime();
            this.showLoading(false);
            
        } catch (error) {
            console.error('خطأ في تحميل أسعار الصرف:', error);
            this.showError('تعذر تحديث الأسعار. جاري استخدام البيانات المحلية.');
            this.showLoading(false);
        }
    }

    async simulateAPICall() {
        // محاكاة استدعاء API مع تغييرات عشوائية طفيفة
        return new Promise((resolve) => {
            setTimeout(() => {
                Object.keys(this.exchangeRates).forEach(currency => {
                    if (currency !== 'USD') {
                        // تغيير عشوائي بسيط (±0.5%)
                        const change = 1 + (Math.random() * 0.01 - 0.005);
                        this.exchangeRates[currency] *= change;
                    }
                });
                resolve();
            }, 1000);
        });
    }

    convertCurrency() {
        const amount = parseFloat(this.amountInput.value);
        const from = this.fromCurrency.value;
        const to = this.toCurrency.value;
        
        // التحقق من صحة المدخلات
        if (isNaN(amount) || amount < 0) {
            this.displayInvalidAmount();
            return;
        }
        
        if (from === to) {
            this.displaySameCurrency(amount, from);
            return;
        }
        
        // إجراء التحويل
        const convertedValue = this.calculateConversion(amount, from, to);
        this.displayResult(amount, from, to, convertedValue);
    }

    calculateConversion(amount, from, to) {
        // التحويل عبر الدولار الأمريكي كعملة وسيطة
        const amountInUSD = amount / this.exchangeRates[from];
        return amountInUSD * this.exchangeRates[to];
    }

    displayResult(amount, from, to, convertedValue) {
        // تنسيق الأرقام
        const formattedAmount = this.formatNumber(amount);
        const formattedConverted = this.formatNumber(convertedValue);
        const exchangeRate = this.exchangeRates[to] / this.exchangeRates[from];
        
        // تحديث واجهة المستخدم
        this.convertedAmount.value = formattedConverted;
        this.resultText.textContent = `${formattedAmount} ${from} = ${formattedConverted} ${to}`;
        this.rateText.textContent = `سعر الصرف: 1 ${from} = ${exchangeRate.toFixed(6)} ${to}`;
    }

    displayInvalidAmount() {
        this.convertedAmount.value = "0.00";
        this.resultText.textContent = "الرجاء إدخال مبلغ صحيح";
        this.rateText.textContent = "سعر الصرف: -";
        this.resultText.style.color = "#dc3545";
        
        setTimeout(() => {
            this.resultText.style.color = "#2575fc";
        }, 2000);
    }

    displaySameCurrency(amount, currency) {
        const formattedAmount = this.formatNumber(amount);
        this.convertedAmount.value = formattedAmount;
        this.resultText.textContent = `${formattedAmount} ${currency} = ${formattedAmount} ${currency}`;
        this.rateText.textContent = `سعر الصرف: 1 ${currency} = 1.000000 ${currency}`;
    }

    swapCurrencies() {
        const fromValue = this.fromCurrency.value;
        const toValue = this.toCurrency.value;
        
        // إضافة تأثير مرئي
        this.swapBtn.style.transform = 'rotate(180deg)';
        
        setTimeout(() => {
            this.fromCurrency.value = toValue;
            this.toCurrency.value = fromValue;
            this.convertCurrency();
            this.swapBtn.style.transform = 'rotate(0deg)';
        }, 300);
    }

    formatNumber(number) {
        // تنسيق الأرقام الكبيرة
        if (number >= 1000000) {
            return (number / 1000000).toFixed(2) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(2) + 'K';
        }
        
        // للأرقام العادية
        return new Intl.NumberFormat('ar-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.lastUpdate.textContent = `آخر تحديث: ${timeString}`;
    }

    showLoading(show) {
        this.loadingSpinner.style.display = show ? 'flex' : 'none';
        this.lastUpdate.style.display = show ? 'none' : 'block';
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            border: 1px solid #f5c6cb;
        `;
        
        this.infoSection.appendChild(errorElement);
        
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }

    handleKeyPress(e) {
        // منع إدخال الأحرف غير الرقمية
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
        
        if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
        
        // منع إدخال أكثر من نقطة عشرية واحدة
        if (e.key === '.' && this.amountInput.value.includes('.')) {
            e.preventDefault();
        }
    }

    get infoSection() {
        return document.querySelector('.info-section');
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
});

// دالة مساعدة لإضافة تأثيرات
function addVisualEffect(element, effectClass, duration = 600) {
    element.classList.add(effectClass);
    setTimeout(() => {
        element.classList.remove(effectClass);
    }, duration);
}

// تصدير الكلاس للاستخدام في ملفات أخرى (إذا لزم الأمر)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CurrencyConverter;
}
