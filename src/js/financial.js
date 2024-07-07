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

    updateExpenseList();
    clearFormFields();
    closeModal();
}


function openEditModal(expense) {   // Opens the menu for adding/editing items
    if (expense) {                  // Checks if an item was opened
        $('#expenseId').val(expense.id);
        $('#expenseAmount').val(expense.amount);
        $('#expenseDate').val(expense.date);
        $('#expenseDescription').val(expense.description);
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

function updateExpenseList() { // Update function for displaying updated list of items

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


function displayfinancial(financial) { // Function for displaying various expenses added to a list
    const list = $('#expenseList');
    list.empty();
    $.each(financial, function (index, expense) {
        const formattedAmount = `RM ${parseFloat(expense.amount).toFixed(2)}`;
        const item = $(`
            <ion-item lines="full"> 
                <ion-label class="ion-text-wrap">
                    <h2>${expense.description}</h2>
                    <p>${expense.date}</p>
                </ion-label>
                <ion-note slot="end" color="danger">${formattedAmount}</ion-note>
            </ion-item>
        `); // Builds the list dynamically of the items with formatted data

        item.on('click', function () {
            openEditModal(expense); // Opens a modal to edit the clicked expense item
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
