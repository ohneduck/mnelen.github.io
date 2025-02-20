// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    initModeButtons();
    initInputHandlers();
    initButtons();
 });
 
 // Состояние приложения
 let currentMode = 'auto'; // 'auto' или 'manual'
 
 // const
 const CLINIC_MIN = 9;
 const CLINIC_MAX = 18;
 const HOME_MIN = 5;
 const HOME_MAX = 10;
 
 // Коэффициенты распределения
 const RATIOS = {
    CLINIC: {
        HEALTHY: 250/380,
        EARLY_AGE: 80/250,
        SICK_SOMATIC: 70/130
    },
    HOME: {
        SOMATIC: 25/215,
        INFECTIOUS: 90/215,
        NEWBORN: 50/215
    },
    DOCS: {
        AFTER_ILLNESS: 100/815,
        KINDERGARTEN: 25/815,
        HOSPITALIZATION: 25/815,
        SPA_REQUEST: 25/815,
        SPA_CARD: 15/815,
        OUTPATIENT: 595/815,
        EMERGENCY: 30/815
    }
 };
 
 // Установка текущей даты
 function setCurrentDate() {
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('currentDate').value = currentDate;
 }
 
 // Инициализация кнопок режимов
 function initModeButtons() {
    const autoBtn = document.getElementById('autoMode');
    const manualBtn = document.getElementById('manualMode');
 
    autoBtn.addEventListener('click', () => switchMode('auto'));
    manualBtn.addEventListener('click', () => switchMode('manual'));
 
    // Установка начального режима
    autoBtn.classList.add('active');
 }
 
 // Переключение режимов
 function switchMode(mode) {
    currentMode = mode;
    document.getElementById('autoMode').classList.toggle('active', mode === 'auto');
    document.getElementById('manualMode').classList.toggle('active', mode === 'manual');
    clearAllFields();
 }
 
 // Инициализация кнопок
 function initButtons() {
    document.getElementById('calculateBtn').addEventListener('click', calculateAllCoefficients);
    document.getElementById('clearBtn').addEventListener('click', clearAllFields);
    document.getElementById('randomBtn').addEventListener('click', generateRandomData);
    document.getElementById('exportPdfBtn').addEventListener('click', () => window.print());
 }
 
 // Инициализация обработчиков ввода
 function initInputHandlers() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', (e) => {
            const id = e.target.getAttribute('data-id');
            if (currentMode === 'auto') {
                handleAutoModeInput(id, e.target.value);
            }
            calculateAllCoefficients();
        });
    });
 }
 
 // Обработка ввода в автоматическом режиме
 function handleAutoModeInput(id, value) {
    const numValue = parseInt(value) || 0;
    switch(id) {
        case '1':
            distributeClinic(numValue);
            break;
        case '2':
            distributeHome(numValue);
            break;
        case '16':
            distributeDocs(numValue);
            break;
    }
 }
 
 // Генерация случайных данных
 function generateRandomData() {
    const clinicTotal = Math.floor(Math.random() * (CLINIC_MAX - CLINIC_MIN + 1)) + CLINIC_MIN;
    const homeTotal = Math.floor(Math.random() * (HOME_MAX - HOME_MIN + 1)) + HOME_MIN;
    const docsTotal = Math.floor((clinicTotal + homeTotal) * 1.2);
 
    setInputValue('1', clinicTotal);
    setInputValue('2', homeTotal);
    setInputValue('16', docsTotal);
 
    distributeClinic(clinicTotal);
    distributeHome(homeTotal);
    distributeDocs(docsTotal);
 
    generateRelatedData(clinicTotal, homeTotal);
    calculateAllCoefficients();
 }
 
 // Генерация связанных данных
 function generateRelatedData(clinicTotal, homeTotal) {
    // Пункты 3-15
    const relatedFields = {
        '3': clinicTotal,
        '4': Math.round(clinicTotal * 0.21),
        '5': Math.round(clinicTotal * 0.39),
        '6': Math.round(clinicTotal * 0.39),
        '7': Math.round(clinicTotal * 0.26),
        '8': Math.round(clinicTotal * 0.21),
        '9': Math.round(clinicTotal * 0.21),
        '10': Math.round(clinicTotal * 0.21),
        '11': Math.round(clinicTotal * 0.07),
        '12': Math.round(clinicTotal * 0.66),
        '13': Math.round(clinicTotal * 0.04),
        '14': clinicTotal,
        '15': Math.round(homeTotal * 0.42),
        '17': Math.round(homeTotal * 0.14),
        '18': Math.round(homeTotal * 0.23),
        '19': Math.round(homeTotal * 0.12),
        '20': Math.round((clinicTotal + homeTotal) * 0.08)
    };
 
    Object.entries(relatedFields).forEach(([id, value]) => {
        setInputValue(id, value);
    });
 }
 
 // Распределение для поликлиники
 function distributeClinic(total) {
    if (!total) return;
 
    const healthyTotal = Math.round(total * RATIOS.CLINIC.HEALTHY);
    const sickTotal = total - healthyTotal;
    
    const earlyAge = Math.round(healthyTotal * RATIOS.CLINIC.EARLY_AGE);
    const olderAge = healthyTotal - earlyAge;
    
    const somaticDiseases = Math.round(sickTotal * RATIOS.CLINIC.SICK_SOMATIC);
    const chronicPatients = sickTotal - somaticDiseases;
 
    const clinicFields = {
        '1A': healthyTotal,
        '1A1': earlyAge,
        '1A2': olderAge,
        '1B': sickTotal,
        '1B1': somaticDiseases,
        '1B2': chronicPatients
    };
 
    Object.entries(clinicFields).forEach(([id, value]) => {
        setInputValue(id, value);
    });
 }
 
 // Распределение для дома
 function distributeHome(total) {
    if (!total) return;
 
    const somaticDiseases = Math.round(total * RATIOS.HOME.SOMATIC);
    const infectiousDiseases = Math.round(total * RATIOS.HOME.INFECTIOUS);
    const newbornPatronage = Math.round(total * RATIOS.HOME.NEWBORN);
    const firstYearPatronage = total - somaticDiseases - infectiousDiseases - newbornPatronage;
 
    const homeFields = {
        '2A': somaticDiseases,
        '2B': infectiousDiseases,
        '2C': newbornPatronage,
        '2D': firstYearPatronage
    };
 
    Object.entries(homeFields).forEach(([id, value]) => {
        setInputValue(id, value);
    });
 }
 
 // Распределение для документов
 function distributeDocs(total) {
    if (!total) return;
 
    const docsFields = {
        '16A': Math.round(total * RATIOS.DOCS.AFTER_ILLNESS),
        '16B': Math.round(total * RATIOS.DOCS.KINDERGARTEN),
        '16C': Math.round(total * RATIOS.DOCS.HOSPITALIZATION),
        '16D': Math.round(total * RATIOS.DOCS.SPA_REQUEST),
        '16E': Math.round(total * RATIOS.DOCS.SPA_CARD),
        '16F': Math.round(total * RATIOS.DOCS.OUTPATIENT),
        '16G': Math.round(total * RATIOS.DOCS.EMERGENCY)
    };
 
    Object.entries(docsFields).forEach(([id, value]) => {
        setInputValue(id, value);
    });
 }
 
 // Расчет коэффициентов
 // Функция для расчета коэффициента
const calculateCoefficient = (done, plan, coefficient) => {
    if (!done || !plan || coefficient === 'x' || coefficient === '×') return '×';
    const value = (done / plan) * coefficient;
    return value.toFixed(2);
};

// Расчет всех коэффициентов
const calculateAllCoefficients = () => {
    let totalSum = 0;

    document.querySelectorAll('tr').forEach(row => {
        const input = row.querySelector('input');
        if (!input) return;

        const done = parseFloat(input.value) || 0;
        const planCell = row.querySelector('td:nth-child(3)');
        const coeffCell = row.querySelector('td:nth-child(5)');
        const resultCell = row.querySelector('td:nth-child(6)');
        const dataId = input.getAttribute('data-id');

        if (!planCell || !coeffCell || !resultCell) return;

        const plan = parseFloat(planCell.textContent) || 0;
        const coeff = coeffCell.textContent.trim();

        if (coeff !== '×' && coeff !== 'x') {
            // Считаем результат напрямую для возможности его добавления в сумму
            const value = (done / plan) * parseFloat(coeff);
            
            if (dataId === '11') {
                // Для R-гр всегда показываем ×, но добавляем значение в сумму
                resultCell.textContent = '×';
                if (!isNaN(value)) {
                    totalSum += value;
                }
            } else {
                // Используем calculateCoefficient для отображения
                const result = calculateCoefficient(done, plan, parseFloat(coeff));
                if (result !== '×') {
                    resultCell.textContent = result;
                    totalSum += parseFloat(result);
                }
            }
        }
    });

    document.getElementById('totalCoefficient').textContent = totalSum.toFixed(2);
};
 
 // Очистка всех полей
 function clearAllFields() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    document.querySelectorAll('.result').forEach(cell => {
        if (cell.textContent !== '×') cell.textContent = '';
    });
    document.getElementById('totalCoefficient').textContent = '';
 }
 
 // Вспомогательная функция для установки значения input
 function setInputValue(id, value) {
    const input = document.querySelector(`input[data-id="${id}"]`);
    if (input) input.value = Math.round(value);
 }