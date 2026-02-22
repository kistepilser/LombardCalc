// --- КОНСТАНТЫ И SVG ---
const SVGS = {
    arrow: `<svg class="arrow-icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    types: {
        'fianite': `<svg viewBox="0 0 24 24"><polygon points="12 2 2 8 12 22 22 8 12 2"/><line x1="2" y1="8" x2="22" y2="8"/></svg>`,
        'diamond': `<svg viewBox="0 0 24 24"><polygon points="12 2 2 8 12 22 22 8 12 2"/><line x1="2" y1="8" x2="22" y2="8"/><polyline points="12 2 12 22"/><polyline points="12 2 6 8 12 22"/><polyline points="12 2 18 8 12 22"/></svg>`,
        'amber': `<svg viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 7.477 2 13s4.477 9 10 9z"/></svg>`,
        'pearl': `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>`,
        'enamel': `<svg viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12c0-4.418 4.25-9.633 8.35-13.8a2.5 2.5 0 0 1 3.3 0C17.75 2.367 22 7.582 22 12c0 5.523-4.477 10-10 10z"/></svg>`
    },
    shapes: {
        'krug': `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>`,
        'oval': `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="6" ry="10"/></svg>`,
        'baget': `<svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="1"/></svg>`,
        'kvadrat': `<svg viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>`,
        'markiz': `<svg viewBox="0 0 24 24"><path d="M12 2C18 8 18 16 12 22C6 16 6 8 12 2Z"/></svg>`,
        'grusha': `<svg viewBox="0 0 24 24"><path d="M12 2C12 2 6 10 6 15A6 6 0 0 0 18 15C18 10 12 2 12 2Z"/></svg>`,
        'oktagon': `<svg viewBox="0 0 24 24"><polygon points="8 3 16 3 21 8 21 16 16 21 8 21 3 16 3 8"/></svg>`,
        'serdtse': `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        'treugolnik': `<svg viewBox="0 0 24 24"><polygon points="12 3 3 20 21 20"/></svg>`,
        'trillion': `<svg viewBox="0 0 24 24"><path d="M12 3C15 9 21 19 21 19C16 21 8 21 3 19C3 19 9 9 12 3Z"/></svg>`,
        'shar': `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>`
    },
    names: {
        'fianite': 'Фианит', 'diamond': 'Бриллиант', 'amber': 'Янтарь', 'pearl': 'Жемчуг', 'enamel': 'Эмаль',
        'krug': 'Круг', 'oval': 'Овал', 'baget': 'Багет', 'kvadrat': 'Квадрат', 'markiz': 'Маркиз', 'grusha': 'Груша',
        'oktagon': 'Октагон', 'serdtse': 'Сердце', 'treugolnik': 'Треугольник', 'trillion': 'Триллион', 'shar': 'Шар'
    }
};

const stoneCoeffs = { 'krug':0.0135, 'baget':0.02175, 'grusha':0.013125, 'kvadrat':0.01725, 'markiz':0.012, 'oval':0.015, 'oktagon':0.018375, 'serdtse':0.01575, 'treugolnik':0.0135, 'trillion':0.01275, 'shar':0.019425 };
const BASE_SELLING_PRICE = 6500; 
let currentLoanTotal = 0; 

// --- ИНИЦИАЛИЗАЦИЯ ДАТЫ ---
const targetDateInput = document.getElementById('targetDate');
const todayDate = new Date();
const pad = n => String(n).padStart(2, '0');
const todayStr = `${todayDate.getFullYear()}-${pad(todayDate.getMonth()+1)}-${pad(todayDate.getDate())}`;
targetDateInput.min = todayStr;

const nextMonthDate = new Date();
nextMonthDate.setDate(nextMonthDate.getDate() + 31);
targetDateInput.value = `${nextMonthDate.getFullYear()}-${pad(nextMonthDate.getMonth()+1)}-${pad(nextMonthDate.getDate())}`;

// --- ГЛАВНАЯ ФУНКЦИЯ РАСЧЕТА ---
function calculate() {
    const totalW = parseFloat(document.getElementById('totalWeight').value) || 0;
    const isHollow = document.getElementById('isHollow').checked;
    const isBuyout = document.getElementById('isBuyout').checked; 
    
    const insSwitch = document.getElementById('isInsured');
    const insContainer = document.getElementById('ins-container');
    const opStatus = document.getElementById('op-status');
    const insStatus = document.getElementById('ins-status');
    const interestBlock = document.getElementById('interest-block');
    
    // Логика переключателей
    if (isBuyout) {
        opStatus.innerText = "Скупка"; opStatus.style.color = "var(--accent)";
        document.getElementById('price-group-zalog').style.display = 'none';
        document.getElementById('price-group-skupka').style.display = 'flex';
        document.getElementById('lbl-price-group').innerText = "Тариф за грамм (Скупка)";
        document.getElementById('margin-block').style.display = 'block'; 
        interestBlock.style.display = 'none'; 
        
        insSwitch.checked = true; insContainer.style.opacity = '0.6'; insContainer.style.pointerEvents = 'none';
        insStatus.innerText = "Обязательно (Скупка)"; insStatus.style.color = "var(--accent)";
    } else {
        opStatus.innerText = "Залог"; opStatus.style.color = "var(--text-main)";
        document.getElementById('price-group-zalog').style.display = 'flex';
        document.getElementById('price-group-skupka').style.display = 'none';
        document.getElementById('lbl-price-group').innerText = "Тариф за грамм (Залог)";
        document.getElementById('margin-block').style.display = 'none'; 
        interestBlock.style.display = 'block'; 
        
        insContainer.style.opacity = '1'; insContainer.style.pointerEvents = 'auto';
        insStatus.innerText = insSwitch.checked ? "Включена (База)" : "Отключена (Снижен)";
        insStatus.style.color = insSwitch.checked ? "#34c759" : "var(--danger)";
    }

    const isInsured = insSwitch.checked;
    const itemDeduct = parseFloat(document.querySelector('input[name="itemType"]:checked').value);
    let stoneWeightCt = 0; let cartItemsHTML = '';

    if (totalW > 0) {
        cartItemsHTML += `<div class="cart-item deduction"><span>Загрязнение х 1</span><span>-0.100 г</span></div>`;
        if (itemDeduct === 0.15) cartItemsHTML += `<div class="cart-item deduction"><span>Замок х 1</span><span>-0.050 г</span></div>`;
    }

    // Расчет камней
    document.querySelectorAll('.stone-row').forEach(row => {
        const type = row.querySelector('.val-t').value;
        const shape = row.querySelector('.val-shape').value;
        const summaryTextEl = row.querySelector('.summary-text');
        const summaryIconEl = row.querySelector('.summary-icon');
        
        const lInput = row.querySelector('.s-l');
        const wInput = row.querySelector('.s-w');
        const hInput = row.querySelector('.s-h');
        const qtyInput = row.querySelector('.s-q');
        
        const l = parseFloat(lInput.value) || 0;
        const w = parseFloat(wInput.value) || l;
        const hInputVal = hInput.value;
        const h = parseFloat(hInputVal) || (w * 0.6);
        const qty = parseInt(qtyInput.value) || 1;
        
        if (l > 0) {
            let ctTotal = 0, gramTotal = 0, dimsText = "";
            
            if (type === 'enamel') {
                let area = (l * w) / 100;
                gramTotal = area * 0.1 * qty;
                dimsText = `${l}x${w} мм (${area.toFixed(2)} см²)`;
                cartItemsHTML += `<div class="cart-item deduction"><span>Эмаль ${dimsText} х ${qty} шт</span><span>-${gramTotal.toFixed(3)} г</span></div>`;
                summaryIconEl.innerHTML = SVGS.types.enamel;
                summaryTextEl.innerHTML = `<span style="color:var(--text-main);">Эмаль</span> <span class="badge-qty">${qty} шт</span> <span style="margin-left:auto;"><b style="color:var(--danger);">-${gramTotal.toFixed(3)} г</b></span>`;
            } else if (type === 'pearl') {
                let ct = Math.pow(l, 3) * 0.01295; ctTotal = ct * qty; gramTotal = ctTotal * 0.2; dimsText = `Ø${l}`;
                cartItemsHTML += `<div class="cart-item deduction"><span>Жемчуг ${dimsText} мм х ${qty} шт</span><span>-${gramTotal.toFixed(3)} г</span></div>`;
                summaryIconEl.innerHTML = SVGS.types.pearl;
                summaryTextEl.innerHTML = `<span style="color:var(--text-main);">Жемчуг</span> <span class="badge-qty">${qty} шт</span> <span style="margin-left:auto;"><b style="color:var(--danger);">-${gramTotal.toFixed(3)} г</b> <span style="color:var(--text-secondary); font-size:11px;">(${ctTotal.toFixed(3)} ct)</span></span>`;
            } else if (type === 'amber') {
                let ct = l * w * h * 0.0065; ctTotal = ct * qty; gramTotal = ctTotal * 0.2;
                dimsText = `${l}x${w}`; if (hInputVal !== "") dimsText += `x${hInputVal}`; else dimsText += `x${h.toFixed(1)}`;
                cartItemsHTML += `<div class="cart-item deduction"><span>Янтарь ${dimsText} мм х ${qty} шт</span><span>-${gramTotal.toFixed(3)} г</span></div>`;
                summaryIconEl.innerHTML = SVGS.types.amber;
                summaryTextEl.innerHTML = `<span style="color:var(--text-main);">Янтарь</span> <span class="badge-qty">${qty} шт</span> <span style="margin-left:auto;"><b style="color:var(--danger);">-${gramTotal.toFixed(3)} г</b> <span style="color:var(--text-secondary); font-size:11px;">(${ctTotal.toFixed(3)} ct)</span></span>`;
            } else {
                let ct = l * w * h * (stoneCoeffs[shape] || 0.0135);
                if (type === 'diamond') ct *= (0.0037 / 0.0081);
                ctTotal = ct * qty; gramTotal = ctTotal * 0.2;
                
                if (shape === 'krug' || shape === 'shar') { dimsText = `Ø${l}`; } 
                else if (shape === 'kvadrat') { dimsText = `${l}x${l}`; if (hInputVal !== "") dimsText += `x${hInputVal}`; else dimsText += `x${h.toFixed(1)}`; } 
                else { dimsText = `${l}x${w}`; if (hInputVal !== "") dimsText += `x${hInputVal}`; else dimsText += `x${h.toFixed(1)}`; }
                
                cartItemsHTML += `<div class="cart-item deduction"><span>${SVGS.names[type]} ${SVGS.names[shape]} ${dimsText} мм х ${qty} шт</span><span>-${gramTotal.toFixed(3)} г</span></div>`;
                summaryIconEl.innerHTML = SVGS.shapes[shape];
                summaryTextEl.innerHTML = `<span style="color:var(--text-main);">${SVGS.names[type]} ${SVGS.names[shape]}</span> <span class="badge-qty">${qty} шт</span> <span style="margin-left:auto;"><b style="color:var(--danger);">-${gramTotal.toFixed(3)} г</b> <span style="color:var(--text-secondary); font-size:11px;">(${ctTotal.toFixed(3)} ct)</span></span>`;
            }
            stoneWeightCt += ctTotal;
        } else {
            summaryIconEl.innerHTML = SVGS.types[type] || SVGS.types.fianite;
            summaryTextEl.innerHTML = `<span style="color:var(--text-secondary);">Вставка (нажмите для ввода)</span>`;
        }
    });

    const stonesG = document.querySelectorAll('.stone-row').length > 0 ? 
        Array.from(document.querySelectorAll('.stone-row')).reduce((sum, row) => {
            const type = row.querySelector('.val-t').value;
            const shape = row.querySelector('.val-shape').value;
            const l = parseFloat(row.querySelector('.s-l').value) || 0;
            const w = parseFloat(row.querySelector('.s-w').value) || l;
            const h = parseFloat(row.querySelector('.s-h').value) || (w * 0.6);
            const qty = parseInt(row.querySelector('.s-q').value) || 1;
            
            if (l === 0) return sum;
            if (type === 'enamel') return sum + ((l * w) / 100 * 0.1 * qty);
            if (type === 'pearl') return sum + (Math.pow(l, 3) * 0.01295 * qty * 0.2);
            if (type === 'amber') return sum + (l * w * h * 0.0065 * qty * 0.2);
            
            let ct = l * w * h * (stoneCoeffs[shape] || 0.0135);
            if (type === 'diamond') ct *= (0.0037 / 0.0081);
            return sum + (ct * qty * 0.2);
        }, 0) : 0;

    const hollowD = isHollow ? (totalW * 0.05) : 0;
    const heavyD = totalW > 20 ? (totalW * 0.005) : 0;
    
    if (totalW > 0) {
        if (isHollow) cartItemsHTML += `<div class="cart-item deduction"><span>Пустотелость (5%)</span><span>-${hollowD.toFixed(3)} г</span></div>`;
        if (heavyD > 0) cartItemsHTML += `<div class="cart-item deduction"><span>Свыше 20г (0.5%)</span><span>-${heavyD.toFixed(3)} г</span></div>`;
    }

    let netW = 0;
    if (totalW > 0) {
        netW = Math.max(0, totalW - itemDeduct - stonesG - hollowD - heavyD);
        document.getElementById('cart-container').style.display = 'block';
        document.getElementById('cart-items').innerHTML = cartItemsHTML;
        document.getElementById('cart-net-weight').innerText = `${netW.toFixed(3)} г`;
    } else {
        document.getElementById('cart-container').style.display = 'none';
    }
    
    document.getElementById('netWeight').value = netW.toFixed(3);

    const purity = parseFloat(document.querySelector('input[name="purity"]:checked').value);
    const btn7000 = document.getElementById('btn7000');
    
    if (!isBuyout) btn7000.value = isInsured ? "7000" : "6300";

    // Обновление цифр на кнопках
    document.querySelectorAll('input[name="price_zalog"], input[name="price_skupka"]').forEach(radio => {
        const baseVal = parseFloat(radio.value);
        const calcVal = Math.round(baseVal * (purity / 585));
        const btn = radio.nextElementSibling;
        btn.querySelector('.calc-val').innerText = `${calcVal.toLocaleString('ru-RU')} ₽`;
        btn.querySelector('.base-val').innerText = `(${baseVal.toLocaleString('ru-RU')} ₽)`;
    });

    // Лимиты
    let basePrice = 0;
    if (isBuyout) {
        basePrice = parseFloat(document.querySelector('input[name="price_skupka"]:checked').value);
        btn7000.disabled = false;
        document.getElementById('limitMsg').style.display = 'none';
    } else {
        basePrice = parseFloat(document.querySelector('input[name="price_zalog"]:checked').value);
        const checkPrice = isInsured ? 7000 : 6300;
        const checkAmountHand = Math.round(netW * Math.round(checkPrice * (purity/585)));
        if (checkAmountHand > 150000) {
            btn7000.disabled = true; document.getElementById('limitMsg').style.display = 'flex';
            if(btn7000.checked) { document.querySelector('input[name="price_zalog"][value="6000"]').checked = true; basePrice = 6000; }
        } else {
            btn7000.disabled = false; document.getElementById('limitMsg').style.display = 'none';
        }
    }

    const actualPrice = Math.round(basePrice * (purity / 585));
    
    document.getElementById('res-base-price').innerText = basePrice.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('res-actual-price').innerText = actualPrice.toLocaleString('ru-RU') + ' ₽';

    if (isBuyout) {
        const actualSellingPrice = Math.round(BASE_SELLING_PRICE * (purity / 585));
        const margin = Math.round((actualSellingPrice - actualPrice) * netW);
        document.getElementById('res-margin').innerText = margin.toLocaleString('ru-RU') + ' ₽';
    }

    const amountHand = Math.round(netW * actualPrice);
    
    if(isInsured && amountHand > 0) {
        document.getElementById('insurance-blocks').style.display = 'block';
        const insAmount = Math.round(amountHand * 0.2376);
        const loanTotal = amountHand + insAmount;
        document.getElementById('res-hand').innerText = amountHand.toLocaleString('ru-RU') + ' ₽';
        document.getElementById('res-ins').innerText = insAmount.toLocaleString('ru-RU') + ' ₽';
        document.getElementById('total-label').innerText = "Сумма в договор займа:";
        document.getElementById('res-total').innerText = loanTotal.toLocaleString('ru-RU') + ' ₽';
        
        currentLoanTotal = loanTotal; 
    } else {
        document.getElementById('insurance-blocks').style.display = 'none';
        document.getElementById('total-label').innerText = "К выдаче на руки:";
        document.getElementById('res-total').innerText = amountHand.toLocaleString('ru-RU') + ' ₽';
        
        currentLoanTotal = amountHand; 
    }

    updateInterest();
}

// --- РАСЧЕТ ПРОЦЕНТОВ ПО ЗАЛОГУ ---
function updateInterest() {
    if (document.getElementById('isBuyout').checked || currentLoanTotal === 0) {
        document.getElementById('int-days').innerText = "0";
        document.getElementById('int-percent').innerText = "0.000%";
        document.getElementById('int-sum').innerText = "0 ₽";
        document.getElementById('int-total-return').innerText = "0 ₽";
        return;
    }

    const tDate = new Date(targetDateInput.value);
    const today = new Date();
    today.setHours(0,0,0,0); tDate.setHours(0,0,0,0);

    let diffTime = tDate.getTime() - today.getTime();
    let days = Math.floor(diffTime / (1000 * 3600 * 24)) + 1; 
    
    if (days < 1) days = 1;

    let percent = 0;
    if (days > 1) percent += Math.min(days - 1, 5) * 0.402; 
    if (days > 6) percent += Math.min(days - 6, 17) * 0.128; 
    if (days > 23) percent += (days - 23) * 0.578;          

    const accruedSum = Math.round(currentLoanTotal * (percent / 100));
    const totalReturn = currentLoanTotal + accruedSum;

    document.getElementById('int-days').innerText = days;
    document.getElementById('int-percent').innerText = percent.toFixed(3) + '%';
    document.getElementById('int-sum').innerText = accruedSum.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('int-total-return').innerText = totalReturn.toLocaleString('ru-RU') + ' ₽';
}

targetDateInput.addEventListener('input', updateInterest);

// --- ГЕНЕРАЦИЯ ОПЦИЙ SELECT ---
function generateOptionsHTML(dataObj, currentKey) {
    return Object.keys(dataObj).map(key => `<div class="select-option" data-val="${key}">${dataObj[key]} ${SVGS.names[key]}</div>`).join('');
}

// --- КОНСТРУКТОР КАМНЕЙ ---
document.getElementById('btnAddStone').onclick = () => {
    document.querySelectorAll('.stone-row').forEach(r => r.classList.add('collapsed'));

    const div = document.createElement('div');
    div.className = 'stone-row';
    div.dataset.shape = 'krug'; 
    
    div.innerHTML = `
        <div class="stone-content">
            <div class="stone-inputs">
                <div class="custom-select s-t-wrap">
                    <div class="select-trigger"><div class="trig-content">${SVGS.types.fianite} Фианит</div>${SVGS.arrow}</div>
                    <div class="select-options">${generateOptionsHTML(SVGS.types, 'fianite')}</div>
                    <input type="hidden" class="val-t" value="fianite">
                </div>
                <div class="custom-select s-shape-wrap">
                    <div class="select-trigger"><div class="trig-content">${SVGS.shapes.krug} Круг</div>${SVGS.arrow}</div>
                    <div class="select-options">${generateOptionsHTML(SVGS.shapes, 'krug')}</div>
                    <input type="hidden" class="val-shape" value="krug">
                </div>

                <input type="number" class="glass-input s-l" placeholder="Диаметр" step="0.01">
                <input type="number" class="glass-input s-w" placeholder="Д2" step="0.01">
                <input type="number" class="glass-input s-h" placeholder="Выс" step="0.01" data-auto="true">
                <input type="number" class="glass-input s-q" value="1" min="1" placeholder="Шт">
            </div>
            <div class="stone-summary">
                <div class="summary-text"><span class="summary-icon">${SVGS.types.fianite}</span> Вставка (нажмите для ввода)</div>
            </div>
        </div>
        <button class="btn-remove" title="Удалить">×</button>
    `;
    
    const typeInput = div.querySelector('.val-t');
    const shapeInput = div.querySelector('.val-shape');
    const shapeWrap = div.querySelector('.s-shape-wrap');
    const typeWrap = div.querySelector('.s-t-wrap');
    const lInput = div.querySelector('.s-l');
    const wInput = div.querySelector('.s-w');
    const hInput = div.querySelector('.s-h');

    const updateShapeUI = () => {
        const type = typeInput.value;
        const shape = shapeInput.value;
        
        shapeWrap.style.display = 'block';
        wInput.style.display = 'block'; 
        hInput.style.display = 'block';
        lInput.style.gridColumn = "auto";
        typeWrap.style.gridColumn = "auto";
        hInput.disabled = false;
        div.dataset.shape = shape;

        if (type === 'enamel') {
            shapeWrap.style.display = 'none'; 
            typeWrap.style.gridColumn = "span 2";
            lInput.placeholder = "Дл. (мм)"; wInput.placeholder = "Шир. (мм)"; hInput.placeholder = "см² (авто)";
            hInput.disabled = true; wInput.value = ""; hInput.value = "";
        } else if (type === 'pearl') {
            shapeWrap.style.display = 'none'; wInput.style.display = 'none'; hInput.style.display = 'none';
            typeWrap.style.gridColumn = "span 2"; lInput.style.gridColumn = "span 3";
            lInput.placeholder = "Диаметр (мм)"; wInput.value = ""; hInput.value = "";
        } else if (type === 'amber') {
            shapeWrap.style.display = 'none'; typeWrap.style.gridColumn = "span 2";
            lInput.placeholder = "Д1"; wInput.placeholder = "Д2"; hInput.placeholder = "Выс";
        } else {
            if (shape === 'krug' || shape === 'shar') {
                lInput.placeholder = "Диаметр"; wInput.style.display = "none"; hInput.style.display = "none";
                lInput.style.gridColumn = "span 3"; wInput.value = ""; hInput.value = ""; 
            } else if (shape === 'kvadrat') {
                lInput.placeholder = "Сторона"; wInput.style.display = "none"; lInput.style.gridColumn = "span 2"; wInput.value = ""; 
            } else { lInput.placeholder = "Д1"; wInput.placeholder = "Д2"; hInput.placeholder = "Выс"; }
        }
        updateHeightAndCalc();
    };

    const updateHeightAndCalc = () => {
        let type = typeInput.value;
        let l = parseFloat(lInput.value) || 0; let w = parseFloat(wInput.value) || l;
        
        if (type === 'enamel') {
            if (l > 0) hInput.value = ((l * w) / 100).toFixed(2); else hInput.value = "";
        } else if (type !== 'pearl' && l > 0 && hInput.dataset.auto === "true") {
            hInput.value = (w * 0.6).toFixed(2);
        } else if (l === 0 && w === 0 && hInput.dataset.auto === "true") { hInput.value = ""; }
        calculate();
    };

    div.querySelectorAll('.custom-select').forEach(select => {
        select.querySelector('.select-trigger').onclick = (e) => {
            const isOpen = select.classList.contains('open');
            document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
            if(!isOpen) select.classList.add('open');
        };
        select.querySelectorAll('.select-option').forEach(opt => {
            opt.onclick = () => {
                const val = opt.dataset.val; const text = opt.innerText; const icon = opt.querySelector('svg').outerHTML;
                select.querySelector('.trig-content').innerHTML = `${icon} ${text}`;
                select.querySelector('input[type="hidden"]').value = val;
                select.classList.remove('open');
                updateShapeUI();
            };
        });
    });

    lInput.oninput = updateHeightAndCalc; wInput.oninput = updateHeightAndCalc;
    hInput.oninput = () => { hInput.dataset.auto = hInput.value === '' ? "true" : "false"; calculate(); };
    div.querySelector('.btn-remove').onclick = () => { div.remove(); calculate(); };
    div.querySelectorAll('.s-q').forEach(el => el.addEventListener('input', calculate));
    
    document.getElementById('stones-container').appendChild(div);
    updateShapeUI();
};

// --- ГЛОБАЛЬНЫЕ СЛУШАТЕЛИ КЛИКОВ ---
document.addEventListener('click', (e) => {
    // Dropdowns
    if (!e.target.closest('.custom-select')) { document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open')); }
    
    // Accordion Interest
    if (e.target.closest('#btn-interest-toggle')) {
        document.getElementById('btn-interest-toggle').classList.toggle('open');
    }

    // Accordion Stones
    const clickedSummary = e.target.closest('.stone-summary');
    if (clickedSummary) {
        const rowToExpand = clickedSummary.closest('.stone-row');
        document.querySelectorAll('.stone-row').forEach(r => { if (r !== rowToExpand) r.classList.add('collapsed'); });
        rowToExpand.classList.remove('collapsed');
        return;
    }

    const clickedInsideRow = e.target.closest('.stone-row');
    const clickedAddBtn = e.target.closest('#btnAddStone');
    const clickedRemoveBtn = e.target.closest('.btn-remove');
    const clickedToggle = e.target.closest('.switch');
    
    if (!clickedInsideRow && !clickedAddBtn && !clickedRemoveBtn && !clickedToggle && !e.target.closest('.interest-header')) {
        document.querySelectorAll('.stone-row').forEach(r => r.classList.add('collapsed'));
    }
});

// Слушаем изменения во всех полях
document.querySelectorAll('#totalWeight').forEach(el => el.oninput = calculate);
document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(el => el.onchange = calculate);

// Первичный расчет
calculate();
