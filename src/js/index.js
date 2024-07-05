$(document).ready(function() { // Check if logged in
    
    if (!localStorage.getItem('currentUser')) {
        window.location.href = 'login.html'; // Redirect to login if no user is logged in
    } else {
        window.location.href = 'main.html'; // Redirect to main page if user is logged in
    }
});
