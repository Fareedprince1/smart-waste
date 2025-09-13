
document.addEventListener('DOMContentLoaded', () => {
  initLoginPage();
});

function initLoginPage() {
  const form = document.getElementById('authForm');
  const emailEl = document.getElementById('email');
  const passwordEl = document.getElementById('password');
  const roleEl = document.getElementById('role');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const messageEl = document.getElementById('authMessage');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  function getUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
  }

  function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function setCurrentUserByEmail(email) {
    localStorage.setItem('currentUserEmail', email);
  }

  function uid() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  function validate() {
    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();
    let ok = true;

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      emailError.classList.remove('hidden');
      ok = false;
    } else {
      emailError.classList.add('hidden');
    }

    if (password.length < 6) {
      passwordError.classList.remove('hidden');
      ok = false;
    } else {
      passwordError.classList.add('hidden');
    }

    return ok;
  }

  function setBusy(isBusy) {
    loginBtn.disabled = isBusy;
    registerBtn.disabled = isBusy;
    loginBtn.textContent = isBusy ? 'Please wait…' : 'Login';
    registerBtn.textContent = isBusy ? 'Please wait…' : 'Register';
  }

  loginBtn.addEventListener('click', async () => {
    if (!validate()) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 400));

    const email = emailEl.value.trim().toLowerCase();
    const password = passwordEl.value.trim();
    const users = getUsers();
    const user = users.find((u) => u.email === email);

    if (!user || user.password !== password) {
      messageEl.textContent = 'Invalid credentials.';
      messageEl.className = 'text-sm text-center text-red-600';
      console.error('Login failed: Invalid credentials for', email);
    } else {
      setCurrentUserByEmail(user.email);
      messageEl.textContent = 'Logged in! Redirecting…';
      messageEl.className = 'text-sm text-center text-eco';
      setTimeout(() => (location.href = 'dashboard.html'), 500);
    }

    setBusy(false);
  });

  registerBtn.addEventListener('click', async () => {
    if (!validate()) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 400));

    const email = emailEl.value.trim().toLowerCase();
    const password = passwordEl.value.trim();
    const role = roleEl.value;
    const users = getUsers();
    const existing = users.find((u) => u.email === email);

    if (existing) {
      messageEl.textContent = 'Account already exists. Try logging in.';
      messageEl.className = 'text-sm text-center text-slate-600';
    } else {
      const user = {
        id: uid(),
        email,
        password,
        role,
        name: email.split('@')[0],
        points: 0,
        joinedMissions: [],
        createdAt: Date.now(),
      };
      users.push(user);
      setUsers(users);
      setCurrentUserByEmail(email);
      messageEl.textContent = 'Registered! Redirecting…';
      messageEl.className = 'text-sm text-center text-eco';
      setTimeout(() => (location.href = 'dashboard.html'), 500);
    }

    setBusy(false);
  });
}