
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    alert(`Attempting login with: ${username}`);
    // Here you'd add fetch or axios call to backend
    return false;
}
