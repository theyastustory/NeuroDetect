// LOGIN HANDLER
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(res => {
        if (res.status === 200 && res.body.access) {
            alert('Login successful!\nJWT: ' + res.body.access.substring(0, 20) + '...');
            // You can save the JWT in localStorage/sessionStorage here if needed
        } else {
            alert('Login failed: ' + (res.body.detail || 'Unknown error'));
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
    return false;
}

// SIGNUP MODAL HANDLERS
function openSignup() {
    document.getElementById('signupModal').style.display = 'block';
}
function closeSignup() {
    document.getElementById('signupModal').style.display = 'none';
}

// SIGNUP HANDLER
function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const email = document.getElementById('signup-email').value;

    fetch('/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(res => {
        if (res.status === 201) {
            alert('Signup successful! You can now log in.');
            closeSignup();
        } else {
            alert('Signup failed: ' + (res.body.detail || JSON.stringify(res.body)));
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
    return false;
}

// Optional: Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('signupModal');
    if (event.target === modal) {
        closeSignup();
    }
}
