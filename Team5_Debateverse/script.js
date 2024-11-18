
function toggleForm(form) {
    const forms = ['login', 'register', 'forgot'];
    
    
    forms.forEach(f => {
        document.getElementById(`${f}-form`).style.display = 'none';
    });

    
    document.getElementById(`${form}-form`).style.display = 'block';
}


function register(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value;

    
    console.log(`Registering user: ${username}, ${password}, ${email}`);
    
    alert('Registration successful!');
    toggleForm('login');
}


function login(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    
    console.log(`Logging in: ${username}, ${password}`);
    
    alert('Login successful!');
    
}


function forgotPassword(event) {
    event.preventDefault();

    const username = document.getElementById('forgot-username').value;
    const email = document.getElementById('forgot-email').value;

    
    console.log(`Password reset request for: ${username}, ${email}`);
    
    alert('Password reset instructions sent!');
    toggleForm('login');
}


window.onload = () => {
    toggleForm('login');
};
