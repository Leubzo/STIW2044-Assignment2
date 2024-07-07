$(document).ready(function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const financial = JSON.parse(localStorage.getItem('userfinancial')) || {};
    const userfinancial = (currentUser && financial[currentUser.username]) ? financial[currentUser.username].financial : [];

    displayExpenses(userfinancial);
    displayTotalExpenses(userfinancial);
});

function displayExpenses(financial) {
    const list = $('#expenseList');
    list.empty();
    if (financial.length === 0) {
        list.append('<ion-item>No expenses found.</ion-item>');
        return;
    }
    financial.forEach(expense => {
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

function displayTotalExpenses(financial) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyExpenses = financial.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const total = monthlyExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    const formattedTotal = `RM ${total.toFixed(2)}`;
    $('#totalExpenses').text(`Total Expenses for ${currentDate.toLocaleString('default', { month: 'long' })}: ${formattedTotal}`);
}
