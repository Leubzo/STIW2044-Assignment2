$(document).ready(function () {
    // Load financial page by default
    $('#contentContainer').load('financial.html');

    // Handle clicking the tabs at the bottom
    $('#financialTab').click(function () {
        $('#contentContainer').load('financial.html');
    });

    $('#budgetTab').click(function () {
        $('#contentContainer').load('budget.html');
    });

    $('#statisticsTab').click(function () {
        $('#contentContainer').load('statistics.html');
    });
});
