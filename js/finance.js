const balance = document.getElementById('balance');
const money_plus = document.getElementById('income-val');
const money_minus = document.getElementById('expense-val');
const list = document.getElementById('list');
const form = document.getElementById('finance-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const dateInput = document.getElementById('date');
const monthFilter = document.getElementById('month-filter');
const yearFilter = document.getElementById('year-filter');
const selectedCurrency = localStorage.getItem('finance_currency') || 'RM';

// 1. Load Data
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Set default year filter to current year
yearFilter.value = new Date().getFullYear();

// 2. Add Transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '' || dateInput.value === '') {
        alert('Please fill in all fields');
    } else {
        const transaction = {
            id: Math.floor(Math.random() * 100000000),
            text: text.value,
            amount: +amount.value,
            date: dateInput.value
        };

        transactions.push(transaction);
        updateLocalStorage();
        updateUI(); // Refresh screen

        text.value = '';
        amount.value = '';
        dateInput.value = '';
    }
}

// 3. Remove Transaction
function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    updateUI();
}

// 4. Update the Dashboard UI (Filter logic happens here)
function updateUI() {
    const selMonth = monthFilter.value;
    const selYear = yearFilter.value;

    // Filter list based on selected month/year
    const filteredTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        const tMonth = (tDate.getMonth() + 1).toString().padStart(2, '0');
        const tYear = tDate.getFullYear().toString();

        const monthMatch = selMonth === 'all' || tMonth === selMonth;
        const yearMatch = selYear === '' || tYear === selYear;

        return monthMatch && yearMatch;
    });

    // Reset History List
    list.innerHTML = '';
    filteredTransactions.forEach(t => {
        const sign = t.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add(t.amount < 0 ? 'minus' : 'plus');
        item.innerHTML = `
        <div>${t.text} <small>${t.date}</small></div>
        <span>${sign}${selectedCurrency} ${Math.abs(t.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${t.id})">x</button>
        `;
        list.appendChild(item);
    });

    // Update Totals (Based ONLY on filtered data)
    const amounts = filteredTransactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(i => i > 0).reduce((acc, i) => (acc += i), 0).toFixed(2);
    const expense = (amounts.filter(i => i < 0).reduce((acc, i) => (acc += i), 0) * -1).toFixed(2);

    balance.innerText = `${selectedCurrency} ${total}`;
    money_plus.innerText = `+ ${selectedCurrency} ${income}`;
    money_minus.innerText = `- ${selectedCurrency} ${expense}`;
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Event Listeners
form.addEventListener('submit', addTransaction);
monthFilter.addEventListener('change', updateUI);
yearFilter.addEventListener('input', updateUI);

// Init App
updateUI();