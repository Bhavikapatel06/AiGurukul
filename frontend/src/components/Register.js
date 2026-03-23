/**
 * Register.js — NEW FILE
 * Path: frontend/src/components/Register.js
 *
 * Registration screen
 * On success → saves token + name to localStorage → goes to landing
 */

import { actions } from '../hooks/useGurukul.js';

const API = 'http://localhost:3001/api/auth';

export function renderRegister(container) {
  container.innerHTML = `
    <div style="
      flex:1; display:flex; align-items:center; justify-content:center;
      padding:40px 24px; min-height:100vh;
      background: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212,175,55,0.06) 0%, transparent 70%);
    ">
      <div style="
        background:var(--surface); border:1px solid var(--gold-border);
        border-radius:var(--r-lg); padding:40px 36px;
        width:100%; max-width:420px;
      ">
        <!-- Logo -->
        <div style="text-align:center; margin-bottom:24px">
          <div style="font-size:36px;margin-bottom:8px">🪷</div>
          <p style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:3px;color:var(--gold-dim);text-transform:uppercase;margin-bottom:6px">AI Gurukul</p>
          <h2 style="font-family:'Cinzel',serif;font-size:22px;color:var(--gold);margin-bottom:4px">Begin Your Journey</h2>
          <p style="font-size:13px;color:var(--text-dim)">Create your free account</p>
        </div>

        <div id="reg-err" style="display:none;background:rgba(226,75,74,.1);border:1px solid rgba(226,75,74,.3);border-radius:var(--r-sm);padding:10px 14px;font-size:13px;color:#E24B4A;margin-bottom:16px"></div>
        <div id="reg-ok"  style="display:none;background:rgba(58,155,140,.1);border:1px solid rgba(58,155,140,.3);border-radius:var(--r-sm);padding:10px 14px;font-size:13px;color:#3A9B8C;margin-bottom:16px"></div>

        <!-- Name -->
        <div style="margin-bottom:14px">
          <label style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-dim);display:block;margin-bottom:5px;font-family:'Cinzel',serif">Full Name</label>
          <input id="r-name" type="text" placeholder="Your name" style="width:100%;background:var(--bg);border:1px solid var(--gold-border);border-radius:var(--r-sm);padding:12px 14px;font-size:14px;color:var(--text);font-family:'Lato',sans-serif;outline:none"/>
        </div>

        <!-- Email -->
        <div style="margin-bottom:14px">
          <label style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-dim);display:block;margin-bottom:5px;font-family:'Cinzel',serif">Email</label>
          <input id="r-email" type="email" placeholder="your@email.com" style="width:100%;background:var(--bg);border:1px solid var(--gold-border);border-radius:var(--r-sm);padding:12px 14px;font-size:14px;color:var(--text);font-family:'Lato',sans-serif;outline:none"/>
        </div>

        <!-- Password -->
        <div style="margin-bottom:20px">
          <label style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-dim);display:block;margin-bottom:5px;font-family:'Cinzel',serif">Password</label>
          <input id="r-pass" type="password" placeholder="Min 6 characters" style="width:100%;background:var(--bg);border:1px solid var(--gold-border);border-radius:var(--r-sm);padding:12px 14px;font-size:14px;color:var(--text);font-family:'Lato',sans-serif;outline:none"/>
        </div>

        <button id="r-submit" style="width:100%;background:var(--gold-dim);border:none;border-radius:var(--r-sm);padding:14px;font-size:14px;font-family:'Cinzel',serif;font-weight:700;color:#0D0B08;cursor:pointer;letter-spacing:1px;transition:background .2s">
          Create Account
        </button>

        <p style="text-align:center;margin-top:20px;font-size:13px;color:var(--text-dim)">
          Already have an account?
          <a id="go-login" style="color:var(--gold-dim);cursor:pointer;text-decoration:underline">Login here</a>
        </p>
      </div>
    </div>
  `;

  const errEl = container.querySelector('#reg-err');
  const okEl  = container.querySelector('#reg-ok');
  const btn   = container.querySelector('#r-submit');

  function showErr(msg) { errEl.textContent = msg; errEl.style.display = 'block'; okEl.style.display = 'none'; }
  function showOk(msg)  { okEl.textContent  = msg; okEl.style.display  = 'block'; errEl.style.display = 'none'; }

  btn.addEventListener('click', async () => {
    const name     = container.querySelector('#r-name').value.trim();
    const email    = container.querySelector('#r-email').value.trim();
    const password = container.querySelector('#r-pass').value;

    if (!name || !email || !password) { showErr('Please fill in all fields.'); return; }
    if (password.length < 6) { showErr('Password must be at least 6 characters.'); return; }

    btn.disabled = true; btn.textContent = 'Creating account...';

    try {
      const res  = await fetch(`${API}/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) { showErr(data.message || 'Registration failed.'); btn.disabled = false; btn.textContent = 'Create Account'; return; }

      localStorage.setItem('ag_token', data.token);
      localStorage.setItem('ag_user',  data.user.name);

      showOk(`Account created! Welcome, ${data.user.name}!`);
      setTimeout(() => actions.goTo('landing'), 1000);

    } catch {
      showErr('Backend not reachable. Make sure server is running on port 3001.');
      btn.disabled = false; btn.textContent = 'Create Account';
    }
  });

  container.querySelector('#r-pass').addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
  container.querySelector('#go-login').addEventListener('click', () => actions.goTo('login'));
}
