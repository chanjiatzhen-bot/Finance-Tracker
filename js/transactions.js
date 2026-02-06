const list = document.getElementById('full-list');
const monthFilter = document.getElementById('month-filter');
const yearFilter = document.getElementById('year-filter');
const searchInput = document.getElementById('search-input');
const itemCount = document.getElementById('item-count');
const viewTotal = document.getElementById('view-total');
const selectedCurrency = localStorage.getItem('finance_currency') || 'RM';

// Load Data
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function updateUI() {
    const selMonth = monthFilter.value;
    const selYear = yearFilter.value;
    const searchText = searchInput.value.toLowerCase();

    // 1. Filter Logic
    const filtered = transactions.filter(t => {
        const tDate = new Date(t.date);
        const tMonth = (tDate.getMonth() + 1).toString().padStart(2, '0');
        const tYear = tDate.getFullYear().toString();
        const tText = t.text.toLowerCase();

        const monthMatch = selMonth === 'all' || tMonth === selMonth;
        const yearMatch = selYear === '' || tYear === selYear;
        const searchMatch = tText.includes(searchText);

        return monthMatch && yearMatch && searchMatch;
    });

    // 2. Clear and Render
    list.innerHTML = '';
    
    filtered.forEach(t => {
        const sign = t.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add(t.amount < 0 ? 'minus' : 'plus');

        item.innerHTML = `
            <div>
                <strong>${t.text}</strong>
                <small>${t.date}</small>
            </div>
            <div class="category-tag">${t.amount < 0 ? 'Expense' : 'Income'}</div>
            <span style="text-align: right;">${sign}${selectedCurrency} ${Math.abs(t.amount).toFixed(2)}</span>
            <button class="delete-btn" onclick="removeTransaction(${t.id})">x</button>
        `;
        list.appendChild(item);
    });

    // 3. Update Footer Info
    itemCount.innerText = filtered.length;
    const total = filtered.reduce((acc, item) => (acc += item.amount), 0).toFixed(2);
    viewTotal.innerText = `${selectedCurrency} ${total}`;
}

function removeTransaction(id) {
    if(confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateUI();
    }
}

// Event Listeners
monthFilter.addEventListener('change', updateUI);
yearFilter.addEventListener('input', updateUI);
searchInput.addEventListener('input', updateUI);

// Init
updateUI();