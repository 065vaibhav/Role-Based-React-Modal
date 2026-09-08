import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('admin');

  async function submit(event) {
    event.preventDefault();
    try {
      const user = await signIn({ email, password, role });
      const from = location.state?.from;
      navigate(from || (user.role === 'super_admin' ? '/super-admin' : '/dashboard'), { replace: true });
    } catch {
      // Error is displayed from AuthContext.
    }
  }

  return (
    <div className="login-page">
      <div className="login-orb orb-a" />
      <div className="login-orb orb-b" />
      <form className="login-card" onSubmit={submit}>
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={20} /></div>
          <span>Northstar</span>
        </div>
        <div className="eyebrow">WORKSPACE ACCESS</div>
        <h1>Sign in</h1>
        <p className="muted">Use the demo role selector to see the permission-based navigation and routes.</p>

        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="demo user email" />
        </label>
        <label>
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
        </label>
        <label>
          Demo role
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="user">Standard User</option>
          </select>
        </label>

        {error ? <div className="error-box">{error}</div> : null}

        <button className="primary wide" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <div className="demo-note">
          <strong>Demo users</strong>
          <span>Admin: maya@acme.io · Manager: dev@globex.io · User: kabir@acme.io · Super Admin: aarav@northstar.io</span>
        </div>
      </form>
    </div>
  );
}
