$(document).ready(function () {
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

    let expenseList = JSON.parse(localStorage.getItem('userexpenseList')) || {};
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !currentUser.username) {
        console.log('No current user or current user does not have a username');
        return;
    }

    if (!expenseList[currentUser.username]) {
        expenseList[currentUser.username] = { expenseList: [] };
    }

    // Add or update expense
    if (id) {
        const index = expenseList[currentUser.username].expenseList.findIndex(exp => exp.id === id);
        if (index !== -1) {
            expenseList[currentUser.username].expenseList[index] = {
                id: id,
                amount: amount,
                date: date,
                description: description
            };
        }
    } else {
        expenseList[currentUser.username].expenseList.push({
            id: Date.now().toString(),
            amount: amount,
            date: date,
            description: description
        });
    }

    // Save updated expenseList data
    localStorage.setItem('userexpenseList', JSON.stringify(expenseList));

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

    let expenseList = JSON.parse(localStorage.getItem('userexpenseList')) || {};
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !expenseList[currentUser.username]) {
        console.log('No current user or user expenseList found');
        return;
    }

    expenseList[currentUser.username].expenseList = expenseList[currentUser.username].expenseList.filter(expense => expense.id !== expenseId);
    localStorage.setItem('userexpenseList', JSON.stringify(expenseList));
    updateExpenseList();
}

function updateExpenseList() { // Update function for displaying updated list of items

    const expenseList = JSON.parse(localStorage.getItem('userexpenseList')) || {};
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !expenseList[currentUser.username]) {
        console.log('No expenseList or current user found');
        displayPlaceholder(true);
        return;
    }

    const userexpenseList = expenseList[currentUser.username].expenseList;
    if (userexpenseList.length > 0) {
        displayexpenseList(userexpenseList);
        displayPlaceholder(false);
    } else {
        displayPlaceholder(true);
    }
}


function displayexpenseList(expenseList) { // Function for displaying various expenses added to a list
    const list = $('#expenseList');
    list.empty();
    $.each(expenseList, function (index, expense) {
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
