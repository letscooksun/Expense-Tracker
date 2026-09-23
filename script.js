
// Navigation
let navlinks = document.querySelector(".navlinks");

// Dashboard
let dashboard = document.querySelector("#dashboard");
let balance = document.querySelector("#balance");
let income = document.querySelector("#income");
let expenses = document.querySelector("#expenses");
let recentlist = document.querySelector("#recent-list");

// Transactions
let transactions = document.querySelector("#transactions");
let addtransactionform = document.querySelector(".add-transaction-form");

let description = document.querySelector("#description");
let amount = document.querySelector("#amount");
let type = document.querySelector("#type");
let category = document.querySelector("#category");

let searchtransaction = document.querySelector(".search-transaction");
let search = document.querySelector("#search");

let filter = document.querySelector(".filter");
let typefilter = document.querySelector("#type-filter");
let categoryfilter = document.querySelector("#category-filter");

let transactionlist = document.querySelector(".transaction-list");
let transactionslist = document.querySelector("#transactions-list");

// Analytics
let analytics = document.querySelector("#analytics");
let totalincome = document.querySelector("#total-income");
let totalexpenses = document.querySelector("#total-expenses");
let totalsavings = document.querySelector("#total-savings");

// Categories
let categories = document.querySelector("#categories");
let categoryaddition = document.querySelector("#category-addition");
let addcategory = document.querySelector("#add-category");

// Settings
let settings = document.querySelector("#settings");
let addcurrency = document.querySelector("#add-currency");
let changecurrency = document.querySelector("#change-currency");

addtransactionform.addEventListener("submit", function(event) {
    event.preventDefault();

    console.log(description.value);
    console.log(amount.value);
    console.log(type.value);
    console.log(category.value);

    const transaction = {
        description: description.value,
        amount: amount.value,
        type: type.value,
        category: category.value
    };

    console.log(transaction);
});

