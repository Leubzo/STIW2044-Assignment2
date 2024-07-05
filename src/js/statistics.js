$(document).ready(function () {
    $.getScript('https://cdn.jsdelivr.net/npm/chart.js', function() { // Function to calculate expenses into a pie chart
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const financial = JSON.parse(localStorage.getItem('userfinancial')) || {};
        const userfinancial = (currentUser && financial[currentUser.username]) ? financial[currentUser.username].financial : [];

        const categories = ['food', 'transportation', 'utilities', 'entertainment', 'other'];
        const financialstatistics = categories.map(category => {
            return {
                category: category,
                total: userfinancial.filter(expense => expense.category === category)
                                    .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0)
            };
        });

        renderPieChart(financialstatistics);
    });
});

function renderPieChart(financialstatistics) { // Function to render the pie chart of expenses
    const ctx = $('#categoryPieChart');
    const data = {
        labels: financialstatistics.map(expense => expense.category),
        datasets: [{
            data: financialstatistics.map(expense => expense.total),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
    };

    new Chart(ctx, {
        type: 'pie',
        data: data
    });
}
