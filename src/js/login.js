$(document).ready(function() {
    const usernameInput = $('#username');
    const passwordInput = $('#password');
    const loginBtn = $('#loginBtn');
    const signupBtn = $('#signupBtn');

    signupBtn.click(function() { // Sign up function for new users
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const newUser = {
                username: usernameInput.val().trim(),
                password: passwordInput.val()
            };
            // Basic validation for empty fields
            if (!newUser.username || !newUser.password) {
                alert('Both fields are required.');
                return;
            }
            users.push(newUser); // Adds new user to local storage
            localStorage.setItem('users', JSON.stringify(users));
            alert('Signup successful!');
        } catch (error) {
            console.error('Error accessing localStorage', error);
            alert('Signup failed. Please try again.');
        }
    });

    loginBtn.click(function() { // Login function for existing users
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const foundUser = users.find(user => user.username === usernameInput.val().trim() && user.password === passwordInput.val());
            if (foundUser) {
                localStorage.setItem('currentUser', JSON.stringify(foundUser));
                window.location.href = 'main.html'; // Redirect to main page
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error accessing localStorage', error);
            alert('Login failed. Please try again.');
        }
    });
});
