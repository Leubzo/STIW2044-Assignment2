$(document).ready(function () {
    console.log('hi');
    updateExpenseList();

    $('#signOutButton').click(function () {
        signOutUser();
    });

    $('#addExpenseButton').click(function () {
        openEditModal();
    });

    $('#expenseForm').submit(function (event) {
        event.preventDefault();
        addOrUpdateExpense();
    });
});

function addOrUpdateExpense() {
    const id = $('#expenseId').val();
    const amount = parseFloat($('#expenseAmount').val());
    const date = $('#expenseDate').val();
    const description = $('#expenseDescription').val();
    const category = $('#expenseCategory').val();

    let financial = JSON.parse(localStorage.getItem('userfinancial')) || {};
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !currentUser.username) {
        console.log('No current user or current user does not have a username');
        return;
    }

    if (!financial[currentUser.username]) {
        financial[currentUser.username] = { financial: [] };
    }

    // Add or update expense
    if (id) {
        const index = financial[currentUser.username].financial.findIndex(exp => exp.id === id);
        if (index !== -1) {
            financial[currentUser.username].financial[index] = {
                id: id,
                amount: amount,
                date: date,
                description: description,
                category: category
            };
        }
    } else {
        financial[currentUser.username].financial.push({
            id: Date.now().toString(),
            amount: amount,
            date: date,
            description: description,
            category: category
        });
    }

    // Save updated financial data
    localStorage.setItem('userfinancial', JSON.stringify(financial));

    // Check if expenses exceed the budget
    checkBudgetExceedance(financial[currentUser.username].financial, amount, date);

    updateExpenseList();
    clearFormFields();
    closeModal();
}

function checkBudgetExceedance(expenses, newAmount, newDate) {
    const dailyBudget = parseFloat(localStorage.getItem('dailyBudget')) || 0;
    const monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || 0;
    const yearlyBudget = parseFloat(localStorage.getItem('yearlyBudget')) || 0;

    const newExpenseDate = new Date(newDate);
    let dailyTotal = 0, monthlyTotal = 0, yearlyTotal = 0;

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.toDateString() === newExpenseDate.toDateString()) {
            dailyTotal += parseFloat(expense.amount);
        }
        if (expenseDate.getMonth() === newExpenseDate.getMonth() && expenseDate.getFullYear() === newExpenseDate.getFullYear()) {
            monthlyTotal += parseFloat(expense.amount);
        }
        if (expenseDate.getFullYear() === newExpenseDate.getFullYear()) {
            yearlyTotal += parseFloat(expense.amount);
        }
    });

    // Include the new expense in the totals
    dailyTotal += newAmount;
    monthlyTotal += newAmount;
    yearlyTotal += newAmount;

    // Check if any budget is exceeded
    if (dailyTotal > dailyBudget) {
        alert(`Daily budget exceeded! Total: $${dailyTotal}, Limit: $${dailyBudget}`);
    }
    if (monthlyTotal > monthlyBudget) {
        alert(`Monthly budget exceeded! Total: $${monthlyTotal}, Limit: $${monthlyBudget}`);
    }
    if (yearlyTotal > yearlyBudget) {
        alert(`Yearly budget exceeded! Total: $${yearlyTotal}, Limit: $${yearlyBudget}`);
    }
}


function openEditModal(expense) {   // Opens the menu for adding/editing items
    if (expense) {                  // Checks if an item was opened
        $('#expenseId').val(expense.id);
        $('#expenseAmount').val(expense.amount);
        $('#expenseDate').val(expense.date);
        $('#expenseDescription').val(expense.description);
        $('#expenseCategory').val(expense.category);
    } else {                        // Else opens the new item menu with cleared fields
        $('#expenseId').val('');
        clearFormFields();
        $('#deleteExpense').hide();  // Hide the delete button if adding new expense

    }

    let deleteButton = $('#deleteExpense'); // Button for deleting items
    if (deleteButton.length === 0) {
        deleteButton = $('<ion-button color="danger" id="deleteExpense" style="display: block; margin: 0 auto; max-width: 200px;">Delete</ion-button>');
        $('#expenseForm').append(deleteButton);
    }

    deleteButton.off('click').on('click', function () {
        deleteExpense($('#expenseId').val());
        closeModal();
    });

    const modal = document.querySelector('ion-modal');
    modal.present();
}

function deleteExpense(expenseId) { // Delete function for removing items from list

    let financial = JSON.parse(localStorage.getItem('userfinancial')) || {};
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !financial[currentUser.username]) {
        console.log('No current user or user financial found');
        return;
    }

    financial[currentUser.username].financial = financial[currentUser.username].financial.filter(expense => expense.id !== expenseId);
    localStorage.setItem('userfinancial', JSON.stringify(financial));
    updateExpenseList();
}

function updateExpenseList() { // Update function for modifying existing items

    const financial = JSON.parse(localStorage.getItem('userfinancial')) || {};
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !financial[currentUser.username]) {
        console.log('No financial or current user found');
        displayPlaceholder(true);
        return;
    }

    const userfinancial = financial[currentUser.username].financial;
    if (userfinancial.length > 0) {
        displayfinancial(userfinancial);
        displayPlaceholder(false);
    } else {
        displayPlaceholder(true);
    }
}

function getIconName(category) { // Set the image of various icons used in the app
    switch (category) {
        case 'food':
            return 'restaurant-outline';
        case 'transportation':
            return 'bus-outline';
        case 'utilities':
            return 'flash-outline';
        case 'entertainment':
            return 'tv-outline';
        case 'other':
            return 'bag-handle-outline';
        default:
            return 'wallet-outline'; // Default icon
    }
}

function displayfinancial(financial) { // Function for displaying various expenses added to a list
    const list = $('#expenseList');
    list.empty();
    $.each(financial, function (index, expense) {
        const formattedAmount = `RM ${parseFloat(expense.amount).toFixed(2)}`; // Formatting for the RM amount of expense
        const item = $(`
    <ion-item lines="full"> 
        <ion-avatar slot="start">
            <ion-icon name="${getIconName(expense.category)}" size="large"></ion-icon>
        </ion-avatar>
        <ion-label class="ion-text-wrap">
            <h2>${expense.description}</h2>
            <p>${expense.date}</p>
        </ion-label>
        <ion-note slot="end" color="danger">${formattedAmount}</ion-note>
    </ion-item>
`); // Function to build  the list dyamically of the items with formatted data


        item.on('click', function () {
            openEditModal(expense);
        });

        list.append(item);
    });
}

function closeModal() { // Function to close the expense window 
    const modal = document.querySelector('ion-modal');
    if (modal.dismiss) {
        modal.dismiss();
    } else {
        console.error('Modal dismiss function not available');
    }
}

function clearFormFields() { // Function to clear the expense window fields for a new expense
    $('#expenseAmount').val('');
    $('#expenseDate').val('');
    $('#expenseDescription').val('');
    $('#expenseCategory').val('');
    $('#expenseId').val('');
}

function displayPlaceholder(show) { // Function to display placeholder UI if no items in list
    const list = $('#expenseList');
    const placeholder = $('#placeholder');
    if (show) {
        list.hide();
        placeholder.show();
    } else {
        list.show();
        placeholder.hide();
    }
}

function signOutUser() {
    localStorage.removeItem('currentUser'); // Remove the current user from local storage
    window.location.href = 'index.html'; // Redirect to the index page
}
