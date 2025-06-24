const API_BASE_URL = "http://localhost:8000/accounts";

// Handle Login Form Submission
async function handleLogin(event) {
    event.preventDefault();
    document.getElementById('login-error').textContent = "";
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const response = await fetch(`${API_BASE_URL}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok && result.access) {
        alert("Login successful!");
        localStorage.setItem('jwt', result.access);
        // window.location.href = "dashboard.html"; // Uncomment to redirect
    } else {
        document.getElementById('login-error').textContent = result.detail || "Login failed. Please check your credentials.";
    }
    return false;
}

// Handle Signup Form Submission
async function handleSignup(event) {
    event.preventDefault();
    document.getElementById('signup-error').textContent = "";
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const email = document.getElementById('signup-email').value.trim();

    const response = await fetch(`${API_BASE_URL}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email })
    });

    const result = await response.json();
    if (response.ok) {
        alert("Signup successful! Please log in.");
        closeSignup();
    } else {
        document.getElementById('signup-error').textContent = result.detail || "Signup failed. Please try again.";
    }
    return false;
}

// Show/Hide Signup Modal
function openSignup() {
    document.getElementById('signupModal').style.display = 'block';
}

function closeSignup() {
    document.getElementById('signupModal').style.display = 'none';
}
