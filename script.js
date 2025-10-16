// أسعار الصرف (بيانات افتراضية للتجربة)
const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    SAR: 3.75,
    AED: 3.67,
    EGP: 47.86,
    QAR: 3.64,
    KWD: 0.31,
    JOD: 0.71,
    OMR: 0.38,
    BHD: 0.38,
    TRY: 32.05
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
    JOD: 'دينار أردني',
    OMR: 'ريال عماني',
    BHD: 'دينار بحريني',
    TRY: 'ليرة تركية'
};

class CurrencyConverter {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupQuickButtons();
        this.convert();
    }

    initializeElements() {
        // عناصر الإدخال
        this.amountFrom = document.getElementById('amount-from');
        this.amountTo = document.getElementById('amount-to');
        this.currencyFrom = document.getElementById('currency-from');
        this.currencyTo = document.getElementById('currency-to');
        
        // عناصر العرض
        this.fromCurrencyName = document.getElementById('from-currency-name');
        this.toCurrencyName = document.getElementById('to-currency-name');
        this.resultMain = document.getElementById('result-main');
        this.resultRate = document.getElementById('result-rate');
        this.updateTime = document.getElementById('update-time');
        
        // الأزرار
        this.swapBtn = document.getElementById('swap-btn');
        this.quickButtons = document.getElementById('quick-buttons');
    }

    setupEventListeners() {
        // أحداث الإدخال
        this.amountFrom.addEventListener('input', () => this.convert());
        this.currencyFrom.addEventListener('change', () => {
            this.updateCurrencyNames();
            this.convert();
        });
        this.currencyTo.addEventListener('change', () => {
            this.updateCurrencyNames();
            this.convert();
        });
        
        // زر التبديل
        this.swapBtn.addEventListener('click', () => this.swapCurrencies());
        
        // تحديث تلقائي كل 30 ثانية
        setInterval(() => this.simulateRateUpdate(), 30000);
    }

    setupQuickButtons() {
        const quickAmounts = [1, 5, 10, 50, 100, 500];
        
        this.quickButtons.innerHTML = quickAmounts.map(amount => 
            `<button class="quick-btn" data-amount="${amount}">${amount}</button>`
        ).join('');
        
        // إضافة event listeners للأزرار السريعة
        this.quickButtons.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.amountFrom.value = e.target.dataset.amount;
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
        const amount = parseFloat(this.amountFrom.value) || 0;
        const fromCurrency = this.currencyFrom.value;
        const toCurrency = this.currencyTo.value;
        
        if (amount < 0) {
            this.showError('الرجاء إدخال مبلغ صحيح');
            return;
        }
        
        if (fromCurrency === toCurrency) {
            this.amountTo.value = amount.toFixed(2);
            this.displayResult(amount, fromCurrency, amount, toCurrency);
            return;
        }
        
        const converted = this.calculateConversion(amount, fromCurrency, toCurrency);
        this.amountTo.value = converted.toFixed(2);
        this.displayResult(amount, fromCurrency, converted, toCurrency);
    }

    calculateConversion(amount, from, to) {
        // التحويل عبر USD كعملة وسيطة
        const amountInUSD = amount / exchangeRates[from];
        return amountInUSD * exchangeRates[to];
    }

    displayResult(amountFrom, currencyFrom, amountTo, currencyTo) {
        const rate = exchangeRates[currencyTo] / exchangeRates[currencyFrom];
        
        this.resultMain.textContent = 
            `${this.formatNumber(amountFrom)} ${currencyFrom} = ${this.formatNumber(amountTo)} ${currencyTo}`;
        
        this.resultRate.textContent = 
            `سعر الصرف: 1 ${currencyFrom} = ${rate.toFixed(4)} ${currencyTo}`;
        
        this.updateTime.textContent = `آخر تحديث: ${new Date().toLocaleTimeString('ar-EG')}`;
    }

    swapCurrencies() {
        const temp = this.currencyFrom.value;
        this.currencyFrom.value = this.currencyTo.value;
        this.currencyTo.value = temp;
        
        this.updateCurrencyNames();
        this.convert();
        
        // تأثير الحركة
        this.swapBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.swapBtn.style.transform = 'rotate(0deg)';
        }, 300);
    }

    updateCurrencyNames() {
        const fromCode = this.currencyFrom.value;
        const toCode = this.currencyTo.value;
        
        this.fromCurrencyName.textContent = 
            `${fromCode} - ${currencyNames[fromCode]}`;
        
        this.toCurrencyName.textContent = 
            `${toCode} - ${currencyNames[toCode]}`;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return new Intl.NumberFormat('ar-EG').format(num);
    }

    simulateRateUpdate() {
        // محاكاة تحديث الأسعار (في التطبيق الحقيقي سيكون استدعاء API)
        Object.keys(exchangeRates).forEach(currency => {
            if (currency !== 'USD') {
                const change = 1 + (Math.random() * 0.02 - 0.01); // ±1%
                exchangeRates[currency] *= change;
            }
        });
        
        this.convert();
        this.showNotification('🔄 تم تحديث الأسعار تلقائياً');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 12px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showError(message) {
        this.resultMain.textContent = message;
        this.resultMain.style.color = '#e53e3e';
        setTimeout(() => {
            this.resultMain.style.color = 'white';
        }, 2000);
    }
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
});

// إضافة تأثيرات عند فتح الصفحة
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
