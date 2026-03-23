/**
 * Login.js — NEW FILE
 * Path: frontend/src/components/Login.js
 *
 * Login screen — shown first when app opens
 * On success → saves token + name to localStorage → goes to landing
 */

import { actions } from '../hooks/useGurukul.js';

const API = 'http://localhost:3001/api/auth';

export function renderLogin(container) {
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
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
            style="width:60px;height:60px;margin:0 auto 12px;display:block">
            <circle cx="60" cy="60" r="56" stroke="#D4AF37" stroke-width="0.5" opacity="0.4"/>
            <circle cx="60" cy="60" r="44" stroke="#D4AF37" stroke-width="0.5" opacity="0.3"/>
            <circle cx="60" cy="60" r="32" stroke="#D4AF37" stroke-width="0.5" opacity="0.3"/>
            <circle cx="60" cy="60" r="6" fill="#D4AF37" opacity="0.6"/>
            <g stroke="#D4AF37" stroke-width="0.6" opacity="0.5">
              <line x1="60" y1="4" x2="60" y2="28"/>
              <line x1="60" y1="92" x2="60" y2="116"/>
              <line x1="4" y1="60" x2="28" y2="60"/>
              <line x1="92" y1="60" x2="116" y2="60"/>
            </g>
          </svg>
          <p style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:3px;color:var(--gold-dim);text-transform:uppercase;margin-bottom:6px">AI Gurukul</p>
          <h2 style="font-family:'Cinzel',serif;font-size:22px;color:var(--gold);margin-bottom:4px">Welcome Back</h2>
          <p style="font-size:13px;color:var(--text-dim)">Login to continue your wisdom journey</p>
        </div>

        <!-- Error / Success -->
        <div id="login-err" style="
          display:none; background:rgba(226,75,74,.1); border:1px solid rgba(226,75,74,.3);
          border-radius:var(--r-sm); padding:10px 14px; font-size:13px;
          color:#E24B4A; margin-bottom:16px;
        "></div>
        <div id="login-ok" style="
          display:none; background:rgba(58,155,140,.1); border:1px solid rgba(58,155,140,.3);
          border-radius:var(--r-sm); padding:10px 14px; font-size:13px;
          color:#3A9B8C; margin-bottom:16px;
        "></div>

        <!-- Email -->
        <div style="margin-bottom:14px">
          <label style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-dim);display:block;margin-bottom:5px;font-family:'Cinzel',serif">Email</label>
          <input id="l-email" type="email" placeholder="your@email.com" style="
            width:100%; background:var(--bg); border:1px solid var(--gold-border);
            border-radius:var(--r-sm); padding:12px 14px; font-size:14px;
            color:var(--text); font-family:'Lato',sans-serif; outline:none;
            transition:border-color .2s;
          "/>
        </div>

        <!-- Password -->
        <div style="margin-bottom:20px">
          <label style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-dim);display:block;margin-bottom:5px;font-family:'Cinzel',serif">Password</label>
          <input id="l-pass" type="password" placeholder="••••••••" style="
            width:100%; background:var(--bg); border:1px solid var(--gold-border);
            border-radius:var(--r-sm); padding:12px 14px; font-size:14px;
            color:var(--text); font-family:'Lato',sans-serif; outline:none;
            transition:border-color .2s;
          "/>
        </div>

        <!-- Submit -->
        <button id="l-submit" style="
          width:100%; background:var(--gold-dim); border:none;
          border-radius:var(--r-sm); padding:14px; font-size:14px;
          font-family:'Cinzel',serif; font-weight:700; color:#0D0B08;
          cursor:pointer; letter-spacing:1px; transition:background .2s;
        ">Login</button>

        <!-- Switch to Register -->
        <p style="text-align:center;margin-top:20px;font-size:13px;color:var(--text-dim)">
          No account?
          <a id="go-register" style="color:var(--gold-dim);cursor:pointer;text-decoration:underline">Register here</a>
        </p>
      </div>
    </div>
  `;

  /* focus styles */
  container.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('focus', () => inp.style.borderColor = 'var(--gold-dim)');
    inp.addEventListener('blur',  () => inp.style.borderColor = 'var(--gold-border)');
  });

  const errEl = container.querySelector('#login-err');
  const okEl  = container.querySelector('#login-ok');
  const btn   = container.querySelector('#l-submit');

  function showErr(msg) { errEl.textContent = msg; errEl.style.display = 'block'; okEl.style.display = 'none'; }
  function showOk(msg)  { okEl.textContent  = msg; okEl.style.display  = 'block'; errEl.style.display = 'none'; }

  /* Submit */
  btn.addEventListener('click', async () => {
    const email    = container.querySelector('#l-email').value.trim();
    const password = container.querySelector('#l-pass').value;

    if (!email || !password) { showErr('Please fill in all fields.'); return; }

    btn.disabled    = true;
    btn.textContent = 'Logging in...';

    try {
      const res  = await fetch(`${API}/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) { showErr(data.message || 'Login failed.'); btn.disabled = false; btn.textContent = 'Login'; return; }

      localStorage.setItem('ag_token', data.token);
      localStorage.setItem('ag_user',  data.user.name);

      showOk(`Welcome back, ${data.user.name}!`);
      setTimeout(() => actions.goTo('landing'), 900);

    } catch {
      showErr('Backend not reachable. Make sure server is running on port 3001.');
      btn.disabled = false; btn.textContent = 'Login';
    }
  });

  /* Enter key */
  container.querySelector('#l-pass').addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });

  /* Go to register */
  container.querySelector('#go-register').addEventListener('click', () => actions.goTo('register'));
}
