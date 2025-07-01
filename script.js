// script.js - 3 Chart (Total Penjualan, Keuntungan Rp, Keuntungan %), Chart di atas kalkulator

document.addEventListener('DOMContentLoaded', () => {
    const calculatorCards = document.querySelectorAll('.calculator-card');

    function formatRupiah(num) {
        if (isNaN(num) || num === null || num === 0) return '';
        return new Intl.NumberFormat('id-ID').format(Math.round(num));
    }

    function parseRupiah(str) {
        if (!str) return 0;
        return parseFloat(String(str).replace(/[^0-9]/g, '')) || 0;
    }

    function formatAsset(num) {
        if (isNaN(num) || num === null || num === 0) return '';
        return num.toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 8
        });
    }

    function parseAsset(str) {
        if (!str) return 0;
        return parseFloat(String(str).replace(/\./g, '').replace(/,/g, '.')) || 0;
    }

    // ------ INISIALISASI 3 CHART CHART.JS ------
    let chartTotal, chartProfitRp, chartProfitPercent;
    function updateCharts() {
        if (!window.Chart) return;
        const labels = [];
        const totals = [];
        const profitsRp = [];
        const profitsPercent = [];
        calculatorCards.forEach((card, idx) => {
            const coinName = card.querySelector('.coin-name').value.trim() || 'Koin ' + (idx+1);
            const modalEl = card.querySelector('.input-modal');
            const assetQuantityEl = card.querySelector('.input-assetQuantity');
            const sellPriceEl = card.querySelector('.input-sellPrice');
            const profitRpEl = card.querySelector('.input-profitRp');
            const profitPercentEl = card.querySelector('.input-profitPercent');
            let modal = parseRupiah(modalEl.value);
            let assetQuantity = parseAsset(assetQuantityEl.value);
            let sellPrice = parseRupiah(sellPriceEl.value);
            let profitRp = parseRupiah(profitRpEl.value);
            let profitPercent = parseAsset(profitPercentEl.value);

            // Total penjualan
            let final = (modal > 0 && assetQuantity > 0 && sellPrice > 0) ? (sellPrice * assetQuantity) : 0;
            // Keuntungan
            let profitValue = (modal > 0 && assetQuantity > 0 && sellPrice > 0) ? ((sellPrice * assetQuantity) - modal) : 0;
            // Persen keuntungan
            let profitPct = (modal > 0 && profitValue > 0) ? ((profitValue / modal) * 100) : 0;

            labels.push(coinName);
            totals.push(final);
            profitsRp.push(profitValue);
            profitsPercent.push(profitPct);
        });

        // Chart 1: Total Nilai Penjualan
        if (!chartTotal) {
            chartTotal = new Chart(document.getElementById('simulasiChartTotal').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Total Penjualan (Rp)',
                        data: totals,
                        borderWidth: 1,
                        backgroundColor: [
                            'rgba(37,99,235,0.7)',
                            'rgba(16,185,129,0.7)',
                            'rgba(245,158,11,0.7)'
                        ],
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false }},
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) { return 'Rp ' + formatRupiah(value); }
                            }
                        }
                    }
                }
            });
        } else {
            chartTotal.data.labels = labels;
            chartTotal.data.datasets[0].data = totals;
            chartTotal.update();
        }

        // Chart 2: Target Keuntungan (Rp)
        if (!chartProfitRp) {
            chartProfitRp = new Chart(document.getElementById('simulasiChartProfitRp').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Target Keuntungan (Rp)',
                        data: profitsRp,
                        borderWidth: 1,
                        backgroundColor: [
                            'rgba(37,99,235,0.7)',
                            'rgba(16,185,129,0.7)',
                            'rgba(245,158,11,0.7)'
                        ],
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false }},
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) { return 'Rp ' + formatRupiah(value); }
                            }
                        }
                    }
                }
            });
        } else {
            chartProfitRp.data.labels = labels;
            chartProfitRp.data.datasets[0].data = profitsRp;
            chartProfitRp.update();
        }

        // Chart 3: Target Keuntungan (%)
        if (!chartProfitPercent) {
            chartProfitPercent = new Chart(document.getElementById('simulasiChartProfitPercent').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Target Keuntungan (%)',
                        data: profitsPercent,
                        borderWidth: 1,
                        backgroundColor: [
                            'rgba(37,99,235,0.7)',
                            'rgba(16,185,129,0.7)',
                            'rgba(245,158,11,0.7)'
                        ],
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false }},
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) { return value + ' %'; }
                            }
                        }
                    }
                }
            });
        } else {
            chartProfitPercent.data.labels = labels;
            chartProfitPercent.data.datasets[0].data = profitsPercent;
            chartProfitPercent.update();
        }
    }

    calculatorCards.forEach((card, idx) => {
        const calcId = 'calc' + (idx + 1);

        const coinNameEl = card.querySelector('.coin-name');
        const modalEl = card.querySelector('.input-modal');
        const buyPriceEl = card.querySelector('.input-buyPrice');
        const assetQuantityEl = card.querySelector('.input-assetQuantity');
        const sellPriceEl = card.querySelector('.input-sellPrice');
        const profitRpEl = card.querySelector('.input-profitRp');
        const profitPercentEl = card.querySelector('.input-profitPercent');
        const coinNameSuffixEl = card.querySelector('.coin-name-suffix');
        const totalAfterProfitEl = card.querySelector('.total-after-profit');
        const resetButton = card.querySelector('.reset-button');

        const warningMsg = document.createElement('div');
        warningMsg.className = 'text-xs text-red-500 mt-1 hidden';
        warningMsg.textContent = 'Isi minimal 2 dari 3 kolom di atas dengan angka yang benar!';
        card.querySelector('.space-y-4').insertBefore(warningMsg, card.querySelector('.space-y-4').children[1]);

        const primaryInputs = [modalEl, buyPriceEl, assetQuantityEl];
        const targetInputs = [sellPriceEl, profitRpEl, profitPercentEl];
        const allInputs = [...primaryInputs, ...targetInputs];
        const rupiahInputs = [modalEl, buyPriceEl, sellPriceEl, profitRpEl];
        const assetInputs = [assetQuantityEl, profitPercentEl];

        // ---- LOAD DATA DARI LOCAL STORAGE SAAT PERTAMA KALI ----
        const saved = JSON.parse(localStorage.getItem('tradingSimData_' + calcId) || '{}');
        if (saved.coinName) coinNameEl.value = saved.coinName;
        if (saved.modal) modalEl.value = formatRupiah(saved.modal);
        if (saved.buyPrice) buyPriceEl.value = formatRupiah(saved.buyPrice);
        if (saved.assetQuantity) assetQuantityEl.value = formatAsset(saved.assetQuantity);
        if (saved.sellPrice) sellPriceEl.value = formatRupiah(saved.sellPrice);
        if (saved.profitRp) profitRpEl.value = formatRupiah(saved.profitRp);
        if (saved.profitPercent) profitPercentEl.value = formatAsset(saved.profitPercent);

        // ---- FUNGSI VALIDASI ----
        function validateInput(el, type = 'number') {
            const val = el.value.trim();
            if (!val) {
                el.classList.remove('border-red-500', 'bg-red-50');
                return true;
            }
            let valid = false;
            if (type === 'number') {
                valid = /^[0-9.]+$/.test(val.replace(/\./g, '').replace(/,/g, '.'));
            } else if (type === 'percent') {
                valid = /^-?\d+([.,]\d+)?$/.test(val);
            } else {
                valid = true;
            }
            if (!valid) {
                el.classList.add('border-red-500', 'bg-red-50');
            } else {
                el.classList.remove('border-red-500', 'bg-red-50');
            }
            return valid;
        }

        // ---- SIMPAN INPUT KE LOCAL STORAGE ----
        function saveToLocal() {
            localStorage.setItem('tradingSimData_' + calcId, JSON.stringify({
                coinName: coinNameEl.value,
                modal: parseRupiah(modalEl.value),
                buyPrice: parseRupiah(buyPriceEl.value),
                assetQuantity: parseAsset(assetQuantityEl.value),
                sellPrice: parseRupiah(sellPriceEl.value),
                profitRp: parseRupiah(profitRpEl.value),
                profitPercent: parseAsset(profitPercentEl.value)
            }));
        }

        let isCalculating = false;

        function calculate(sourceEl) {
            if (isCalculating) return;
            isCalculating = true;

            // Validasi angka hanya untuk input utama
            let validCount = 0;
            primaryInputs.forEach((inp) => {
                if (validateInput(inp, 'number') && (parseRupiah(inp.value) > 0 || parseAsset(inp.value) > 0)) {
                    validCount++;
                }
            });

            // Warning jika input kurang dari 2
            if (validCount < 2) {
                warningMsg.classList.remove('hidden');
                clearOutputs(targetInputs);
                totalAfterProfitEl.textContent = 'Rp -';
                isCalculating = false;
                saveToLocal();
                updateCharts();
                return;
            } else {
                warningMsg.classList.add('hidden');
            }

            let modal = parseRupiah(modalEl.value);
            let buyPrice = parseRupiah(buyPriceEl.value);
            let assetQuantity = parseAsset(assetQuantityEl.value);

            if (primaryInputs.includes(sourceEl)) {
                if ((sourceEl === modalEl || sourceEl === buyPriceEl) && modal > 0 && buyPrice > 0) {
                    assetQuantity = modal / buyPrice;
                    if(document.activeElement !== assetQuantityEl) assetQuantityEl.value = formatAsset(assetQuantity);
                } 
                else if ((sourceEl === modalEl || sourceEl === assetQuantityEl) && modal > 0 && assetQuantity > 0) {
                    buyPrice = modal / assetQuantity;
                    if(document.activeElement !== buyPriceEl) buyPriceEl.value = formatRupiah(buyPrice);
                } 
                else if ((sourceEl === buyPriceEl || sourceEl === assetQuantityEl) && buyPrice > 0 && assetQuantity > 0) {
                    modal = buyPrice * assetQuantity;
                    if(document.activeElement !== modalEl) modalEl.value = formatRupiah(modal);
                }
                clearOutputs(targetInputs);
            }

            if (modal > 0 && assetQuantity > 0) {
                let profit = 0;
                let sellPrice = 0;

                if (sourceEl === sellPriceEl) {
                    sellPrice = parseRupiah(sellPriceEl.value);
                    if (sellPrice > 0) {
                        profit = (sellPrice * assetQuantity) - modal;
                        profitRpEl.value = formatRupiah(profit);
                        profitPercentEl.value = formatAsset((profit / modal) * 100);
                    } else { clearOutputs([profitRpEl, profitPercentEl]); }
                } else if (sourceEl === profitRpEl) {
                    profit = parseRupiah(profitRpEl.value);
                    sellPrice = (modal + profit) / assetQuantity;
                    sellPriceEl.value = formatRupiah(sellPrice);
                    profitPercentEl.value = formatAsset((profit / modal) * 100);
                } else if (sourceEl === profitPercentEl) {
                    const percent = parseAsset(profitPercentEl.value) || 0;
                    profit = modal * (percent / 100);
                    sellPrice = (modal + profit) / assetQuantity;
                    profitRpEl.value = formatRupiah(profit);
                    sellPriceEl.value = formatRupiah(sellPrice);
                }
                
                const finalValue = modal + profit;
                if (finalValue >= modal && profit > 0) {
                    totalAfterProfitEl.textContent = 'Rp ' + formatRupiah(finalValue);
                } else {
                    totalAfterProfitEl.textContent = 'Rp ' + formatRupiah(modal);
                }
            } else {
                clearOutputs(targetInputs);
                totalAfterProfitEl.textContent = 'Rp -';
            }

            saveToLocal();
            isCalculating = false;
            updateCharts();
        }

        function clearOutputs(elementsToClear) {
            elementsToClear.forEach(el => {
                if(document.activeElement !== el) {
                    el.value = '';
                }
            });
        }

        allInputs.forEach(el => {
            el.addEventListener('input', (e) => {
                // Validasi saat input
                if (rupiahInputs.includes(el)) {
                    const originalValue = e.target.value;
                    const caretPos = e.target.selectionStart;
                    const numericValue = parseRupiah(originalValue);
                    
                    e.target.value = formatRupiah(numericValue);
                    
                    const newLength = e.target.value.length;
                    const oldLength = originalValue.length;
                    if (caretPos !== null) {
                        const oldDots = (originalValue.match(/\./g) || []).length;
                        const newDots = (e.target.value.match(/\./g) || []).length;
                        e.target.setSelectionRange(caretPos + (newDots - oldDots), caretPos + (newDots - oldDots));
                    }
                }
                validateInput(el, assetInputs.includes(el) ? 'percent' : 'number');
                calculate(el);
            });
            
            el.addEventListener('focus', (e) => {
                e.target.classList.add('input-active');
            });
            
            el.addEventListener('blur', (e) => {
                e.target.classList.remove('input-active');
                if (assetInputs.includes(el)) {
                    el.value = formatAsset(parseAsset(el.value));
                }
            });
        });

        coinNameEl.addEventListener('input', () => {
            const name = coinNameEl.value.trim().toUpperCase() || 'ASET';
            coinNameSuffixEl.textContent = name;
            saveToLocal();
            updateCharts();
        });

        // KONFIRMASI SEBELUM RESET
        resetButton.addEventListener('click', () => {
            if (confirm('Yakin ingin menghapus semua input di kalkulator ini?')) {
                allInputs.forEach(el => el.value = '');
                totalAfterProfitEl.textContent = 'Rp -';
                coinNameEl.value = '';
                warningMsg.classList.add('hidden');
                allInputs.forEach(el => el.classList.remove('border-red-500', 'bg-red-50'));
                saveToLocal();
                updateCharts();
            }
        });

        // Update grafik pertama kali (setelah load data)
        setTimeout(updateCharts, 100);
    });

    // Update grafik di awal (untuk load dari localstorage)
    setTimeout(updateCharts, 300);
});

// ----------- DARK MODE ------------
(function(){
    const toggleBtn = document.getElementById('toggleDark');
    // Cek preferensi dark mode di localstorage
    function setDarkMode(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        if (toggleBtn) {
            toggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
        localStorage.setItem('tradingSim_dark', isDark ? '1' : '0');
    }
    if (toggleBtn) {
        // Inisialisasi mode dari localStorage
        const darkActive = localStorage.getItem('tradingSim_dark') === '1';
        setDarkMode(darkActive);

        toggleBtn.addEventListener('click', function(){
            const now = document.documentElement.classList.contains('dark');
            setDarkMode(!now);
        });
    }
})();

// ----------- EXPORT PDF --------------
(function(){
    const btn = document.getElementById('exportPdfBtn');
    if (btn) {
        btn.addEventListener('click', function(){
            // Bagian yang mau di-export (grafik + judul + kalkulator + signature)
            const content = document.body; // Export seluruh halaman (rapi, sudah dark mode friendly)
            const opt = {
                margin:       0.3,
                filename:     'simulasi-trading.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'a2', orientation: 'landscape' }
            };
            html2pdf().set(opt).from(content).save();
        });
    }
})();

