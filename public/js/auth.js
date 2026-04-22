const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const signupFields = document.getElementById('signupFields');
const authForm = document.getElementById('authForm');
const authMessage = document.getElementById('authMessage');

let mode = 'login';

const setMode = (nextMode) => {
  mode = nextMode;
  const isSignup = mode === 'signup';
  signupFields.classList.toggle('hidden', !isSignup);
  loginTab.classList.toggle('bg-accent', !isSignup);
  signupTab.classList.toggle('bg-accent', isSignup);
};

loginTab.addEventListener('click', () => setMode('login'));
signupTab.addEventListener('click', () => setMode('signup'));

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(authForm);
  const payload = Object.fromEntries(formData.entries());

  const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    authMessage.textContent = data.message || 'Authentication failed';
    return;
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  window.location.href = '/dashboard';
});
