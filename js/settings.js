// Load current settings
const userNameInput = document.getElementById('user-name');
const currencySelect = document.getElementById('currency-select');

// Set values from LocalStorage on load
userNameInput.value = localStorage.getItem('finance_user_name') || '';
currencySelect.value = localStorage.getItem('finance_currency') || 'RM';

// 1. SAVE PROFILE SETTINGS
function saveSettings() {
    localStorage.setItem('finance_user_name', userNameInput.value);
    localStorage.setItem('finance_currency', currencySelect.value);
    alert('Settings saved successfully!');
    window.location.reload(); // Refresh to update UI if necessary
}

// 2. CLEAR ALL DATA (The Delete All function)
function clearAllData() {
    const confirmation = confirm("Are you ABSOLUTELY sure? This will delete all your RM transactions and cannot be recovered.");
    
    if (confirmation) {
        localStorage.removeItem('transactions');
        alert('All data has been wiped.');
        window.location.href = 'finance.html'; // Redirect to dashboard
    }
}

// 3. EXPORT DATA (Advanced Pro Feature)
function exportData() {
    const transactions = localStorage.getItem('transactions');
    if (!transactions) return alert("No data found to export.");

    const blob = new Blob([transactions], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_backup_${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}