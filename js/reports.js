// 1. Get Data from LocalStorage
const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
document.getElementById('current-year-label').innerText = new Date().getFullYear();

// 2. Process Data for Pie Chart (Income vs Expenses)
const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

const totalExpense = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0));

// 3. Process Data for Bar Chart (Monthly Trends)
// We create an array of 12 months, all starting at 0
const monthlyData = new Array(12).fill(0);

transactions.forEach(t => {
    const date = new Date(t.date);
    if(date.getFullYear() === new Date().getFullYear()) {
        const month = date.getMonth(); // 0 (Jan) to 11 (Dec)
        if(t.amount < 0) {
            monthlyData[month] += Math.abs(t.amount); // Track spending only for trend
        }
    }
});

// --- CHART 1: PIE CHART ---
const ctxPie = document.getElementById('incomeExpenseChart').getContext('2d');
new Chart(ctxPie, {
    type: 'doughnut', // 'pie' or 'doughnut'
    data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [totalIncome, totalExpense],
            backgroundColor: ['#2ecc71', '#b74b4b'], // Green and your Perodua Red
            hoverOffset: 20,
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom', labels: { font: { family: 'Poppins', size: 14 } } }
        }
    }
});

// --- CHART 2: BAR CHART ---
const ctxBar = document.getElementById('monthlyTrendChart').getContext('2d');
new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Monthly Spending (RM)',
            data: monthlyData,
            backgroundColor: '#b74b4b',
            borderRadius: 8,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true, ticks: { font: { family: 'Poppins' } } },
            x: { ticks: { font: { family: 'Poppins' } } }
        },
        plugins: {
            legend: { display: false }
        }
    }
});