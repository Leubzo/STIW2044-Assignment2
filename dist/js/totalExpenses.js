$(document).ready(function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const expenseList = JSON.parse(localStorage.getItem('userexpenseList')) || {};
    const userexpenseList = (currentUser && expenseList[currentUser.username]) ? expenseList[currentUser.username].expenseList : [];

    displayExpenses(userexpenseList);
    displayTotalExpenses(userexpenseList);
});

function displayExpenses(expenseList) {
    const list = $('#expenseList');
    list.empty();
    if (expenseList.length === 0) {
        list.append('<ion-item>No expenses found.</ion-item>');
        return;
    }
    expenseList.forEach(expense => {
        const formattedAmount = `RM ${parseFloat(expense.amount).toFixed(2)}`;
        const item = $(`
            <ion-item lines="full">
                <ion-label class="ion-text-wrap">
                    <h2>${expense.description}</h2>
                    <p>${expense.date}</p>
                </ion-label>
                <ion-note slot="end" color="danger">${formattedAmount}</ion-note>
            </ion-item>
        `);
        list.append(item);
    });
}

function displayTotalExpenses(expenseList) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyExpenses = expenseList.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const total = monthlyExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    const formattedTotal = `RM ${total.toFixed(2)}`;
    $('#totalExpenses').text(`Total Expenses for ${currentDate.toLocaleString('default', { month: 'long' })}: ${formattedTotal}`);
}
