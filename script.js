// Theme
const themeToggle = document.querySelector(".themeToggle");

// Dashboard
const balanceEl = document.querySelector("#balance");
const incomeEl = document.querySelector("#income");
const expensesEl = document.querySelector("#expenses");
const recentList = document.querySelector("#recent-list");

// Transaction form
const transactionForm = document.querySelector(".add-transaction-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const typeInput = document.querySelector("#type");
const categoryInput = document.querySelector("#category");

// Search and filters
const searchInput = document.querySelector("#search");
const typeFilter = document.querySelector("#type-filter");
const categoryFilter = document.querySelector("#category-filter");
const transactionsList = document.querySelector("#transactions-list");

// Analytics
const totalIncomeEl = document.querySelector("#total-income");
const totalExpensesEl = document.querySelector("#total-expenses");
const totalSavingsEl = document.querySelector("#total-savings");

// Categories
const categoryList = document.querySelector(".category-list");
const categoryForm = document.querySelector(".add-category-form");
const categoryAdditionInput = document.querySelector("#category-addition");

// Currency
const currencyForm = document.querySelector(".currency");
const currencySelect = document.querySelector("#add-currency");


// Load transactions from localStorage
let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

// Load custom categories
let categories = JSON.parse(
    localStorage.getItem("categories")
) || [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Education",
    "Rent",
    "Other"
];

// Load saved currency
let currency = localStorage.getItem("currency") || "INR";

// Load saved theme
let isLightTheme = localStorage.getItem("theme") === "light";


//save data

function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function saveCategories() {
    localStorage.setItem(
        "categories",
        JSON.stringify(categories)
    );
}


//currency formatter

function formatMoney(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 2
    }).format(amount);
}


//theme toggle

function applyTheme() {
    document.body.classList.toggle(
        "light-theme",
        isLightTheme
    );

    themeToggle.textContent = isLightTheme ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
    isLightTheme = !isLightTheme;

    localStorage.setItem(
        "theme",
        isLightTheme ? "light" : "dark"
    );

    applyTheme();
});


//add transaction

transactionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get input values
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    // Validate inputs
    if (description === "") {
        alert("Please enter a transaction description.");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter an amount greater than zero.");
        return;
    }

    // Create transaction object
    const transaction = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        description: description,
        amount: amount,
        type: type,
        category: category,
        date: new Date().toISOString()
    };

    // Add transaction to array
    transactions.unshift(transaction);

    // Save data
    saveTransactions();

    // Update the entire application
    updateApp();

    // Reset form
    transactionForm.reset();
});


//delete transaction

function deleteTransaction(id) {
    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions();

    updateApp();
}


//display transaction
function renderTransactions() {

    // Clear previous transactions
    transactionsList.innerHTML = "";

    // Get search and filter values
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedType = typeFilter.value;
    const selectedCategory = categoryFilter.value;

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {

        const matchesSearch =
            transaction.description.toLowerCase().includes(searchValue) ||
            transaction.category.toLowerCase().includes(searchValue);

        const matchesType =
            selectedType === "all" ||
            transaction.type === selectedType;

        const matchesCategory =
            selectedCategory === "all" ||
            transaction.category.toLowerCase() ===
                selectedCategory.toLowerCase();

        return matchesSearch && matchesType && matchesCategory;
    });

    // Display empty message
    if (filteredTransactions.length === 0) {
        const li = document.createElement("li");

        li.textContent = transactions.length === 0
            ? "No transactions yet. Add your first transaction!"
            : "No transactions match your search or filters.";

        transactionsList.appendChild(li);

        return;
    }

    // Create transaction elements
    filteredTransactions.forEach(transaction => {

        const li = document.createElement("li");

        // Transaction information
        const info = document.createElement("div");

        const title = document.createElement("h4");
        title.textContent = transaction.description;

        const details = document.createElement("p");

        const date = new Date(transaction.date);

        details.textContent =
            `${transaction.category} • ${date.toLocaleDateString("en-IN")}`;

        info.appendChild(title);
        info.appendChild(details);

        // Amount
        const amountEl = document.createElement("span");

        const sign = transaction.type === "income" ? "+" : "-";

        amountEl.textContent =
            `${sign}${formatMoney(transaction.amount)}`;

        amountEl.style.color =
            transaction.type === "income" ? "#22c55e" : "#ef4444";

        amountEl.style.fontWeight = "700";

        // Delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";
        deleteBtn.type = "button";

        deleteBtn.addEventListener("click", () => {
            deleteTransaction(transaction.id);
        });

        // Add everything to list item
        li.appendChild(info);
        li.appendChild(amountEl);
        li.appendChild(deleteBtn);

        transactionsList.appendChild(li);
    });
}


//dashboard calculation

function updateDashboard() {

    let totalIncome = 0;
    let totalExpenses = 0;

    // Calculate totals
    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }

    });

    // Calculate balance and savings
    const balance = totalIncome - totalExpenses;

    // Update dashboard
    balanceEl.textContent = formatMoney(balance);

    incomeEl.textContent = formatMoney(totalIncome);

    expensesEl.textContent = formatMoney(totalExpenses);

    // Update analytics
    totalIncomeEl.textContent = formatMoney(totalIncome);

    totalExpensesEl.textContent = formatMoney(totalExpenses);

    totalSavingsEl.textContent = formatMoney(balance);
}


// recent transaction

function renderRecentTransactions() {

    recentList.innerHTML = "";

    // Show latest five transactions
    const recentTransactions = transactions.slice(0, 5);

    if (recentTransactions.length === 0) {
        const li = document.createElement("li");

        li.textContent = "No recent transactions.";

        recentList.appendChild(li);

        return;
    }

    recentTransactions.forEach(transaction => {

        const li = document.createElement("li");

        const description = document.createElement("span");

        description.textContent = transaction.description;

        const amount = document.createElement("span");

        const sign = transaction.type === "income" ? "+" : "-";

        amount.textContent =
            `${sign}${formatMoney(transaction.amount)}`;

        amount.style.color =
            transaction.type === "income" ? "#22c55e" : "#ef4444";

        amount.style.fontWeight = "700";

        li.appendChild(description);
        li.appendChild(amount);

        recentList.appendChild(li);
    });
}


//add custom category

categoryForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const categoryName = categoryAdditionInput.value.trim();

    if (categoryName === "") {
        alert("Please enter a category name.");
        return;
    }

    // Prevent duplicate categories
    const alreadyExists = categories.some(
        category => category.toLowerCase() === categoryName.toLowerCase()
    );

    if (alreadyExists) {
        alert("This category already exists.");
        return;
    }

    // Add category
    categories.push(categoryName);

    saveCategories();

    // Update category displays
    renderCategories();

    updateCategoryDropdowns();

    categoryForm.reset();
});

//display category

function renderCategories() {

    categoryList.innerHTML = "";

    categories.forEach(category => {

        const div = document.createElement("div");

        div.className = "category";
        div.textContent = category;

        categoryList.appendChild(div);
    });
}


// update category

function updateCategoryDropdowns() {

    // Keep current selections
    const selectedCategory = categoryInput.value;
    const selectedFilter = categoryFilter.value;

    // Clear existing options
    categoryInput.innerHTML = "";
    categoryFilter.innerHTML = "";

    // Add default filter option
    const allOption = document.createElement("option");

    allOption.value = "all";
    allOption.textContent = "All Categories";

    categoryFilter.appendChild(allOption);

    // Add every category to both dropdowns
    categories.forEach(category => {

        const value = category.toLowerCase();

        const option1 = document.createElement("option");

        option1.value = value;
        option1.textContent = category;

        categoryInput.appendChild(option1);

        const option2 = document.createElement("option");

        option2.value = value;
        option2.textContent = category;

        categoryFilter.appendChild(option2);
    });

    // Restore selections if they still exist
    if (categories.some(c => c.toLowerCase() === selectedCategory)) {
        categoryInput.value = selectedCategory;
    }

    if (
        selectedFilter === "all" ||
        categories.some(c => c.toLowerCase() === selectedFilter)
    ) {
        categoryFilter.value = selectedFilter || "all";
    }
}


//search amd filter events

// Search transactions
searchInput.addEventListener("input", renderTransactions);

// Filter by income or expense
typeFilter.addEventListener("change", renderTransactions);

// Filter by category
categoryFilter.addEventListener("change", renderTransactions);


//change currency

currencyForm.addEventListener("submit", function (e) {

    e.preventDefault();

    currency = currencySelect.value;

    localStorage.setItem("currency", currency);

    // Refresh all amounts
    updateApp();

    alert("Currency changed successfully!");
});


//update applicaion

function updateApp() {

    updateDashboard();

    renderTransactions();

    renderRecentTransactions();
}


//initialize application

function init() {

    // Restore saved currency
    currencySelect.value = currency;

    // Restore theme
    applyTheme();

    // Render categories and dropdowns
    renderCategories();

    updateCategoryDropdowns();

    // Render saved transactions and totals
    updateApp();
}

// Start the application
init();