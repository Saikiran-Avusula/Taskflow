import { useState } from 'react';
import { Navigate, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, role } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const registered = searchParams.get('registered') === 'true';

  const defaultRoute = role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard';

  if (isAuthenticated) {
    return <Navigate to={defaultRoute} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await loginApi({ email, password });
      login(result);
      navigate(result.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        backgroundColor: '#080A0E',
        color: '#ECEEF2',
        fontFamily: "'Geist Mono', 'IBM Plex Mono', monospace",
      }}>

        {/* LEFT PANEL */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{ maxWidth: 480 }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
              <div style={{
                width: 40, height: 40, backgroundColor: '#A8FF3E', color: '#080A0E',
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15,
                borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>TF</div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18 }}>TaskFlow</span>
            </div>

            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 52, lineHeight: 1.1, margin: 0 }}>
              Manage work.<br />
              <span style={{ color: '#A8FF3E' }}>Ship faster.</span><br />
              Stay in control.
            </h1>

            <p style={{ marginTop: 20, fontSize: 14, color: '#6B7280', lineHeight: 1.7, maxWidth: 380 }}>
              A task and project tracker built for teams that move fast and ship real things.
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
              {['⚡ Access', '📋 Projects', '✅ Tasks'].map((label) => (
                <div key={label} style={{
                  backgroundColor: '#111318', border: '1px solid #252830', borderRadius: 8,
                  padding: '8px 12px', fontSize: 11, color: '#6B7280'
                }}>{label}</div>
              ))}
            </div>
          </div>
        </div>

        {/* VERTICAL DIVIDER */}
        <div style={{ width: 1, backgroundColor: '#252830', height: '100%' }} />

        {/* RIGHT PANEL */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ width: 340 }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 26, margin: 0 }}>Welcome back</h1>
            <p style={{ marginTop: 4, fontSize: 13, color: '#A8FF3E' }}>
              TaskFlow<span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
            </p>

            {import.meta.env.DEV && (
              <div style={{ marginTop: 22, padding: 12, border: '1px solid #252830', backgroundColor: '#111318', borderRadius: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: '#A8FF3E', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>DEMO ADMIN LOGIN</span>
                  <button
                    type="button"
                    onClick={() => { setEmail('admin@taskflow.com'); setPassword('Admin@123'); }}
                    style={{ padding: '4px 7px', border: '1px solid #3A3E47', borderRadius: 4, background: 'transparent', color: '#ECEEF2', fontSize: 10, cursor: 'pointer' }}
                  >
                    Use credentials
                  </button>
                </div>
                <div style={{ marginTop: 8, color: '#A3A8B3', fontSize: 11, lineHeight: 1.7 }}>
                  <div>Email: <span style={{ color: '#ECEEF2' }}>admin@taskflow.com</span></div>
                  <div>Password: <span style={{ color: '#ECEEF2' }}>Admin@123</span></div>
                </div>
              </div>
            )}

            {registered && (
              <div style={{ marginTop: 24, padding: '12px', border: '1px solid #A8FF3E33', backgroundColor: '#A8FF3E08', borderRadius: 4 }}>
                <div style={{ color: '#A8FF3E', fontSize: 12, fontWeight: 700 }}>[SUCCESS]: Account Initialized</div>
                <div style={{ color: '#6B7280', fontSize: 11, marginTop: 4 }}>Access granted. Enter credentials to proceed.</div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ marginTop: registered ? 24 : 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.1em', color: '#6B7280', textTransform: 'uppercase' }}>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={inputStyle} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.1em', color: '#6B7280', textTransform: 'uppercase' }}>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle} 
                />
              </div>

              {error && <div style={{ color: '#EF4444', fontSize: 12 }}>{error}</div>}

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  padding: '12px', backgroundColor: '#A8FF3E', color: '#080A0E',
                  border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>

              <p style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: '#6B7280' }}>
                New agent? <Link to="/register" style={{ color: '#A8FF3E', textDecoration: 'none', fontWeight: 600 }}>Create Account</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  padding: '12px', backgroundColor: '#080A0E', border: '1px solid #252830',
  borderRadius: 4, color: '#ECEEF2', fontSize: 13, outline: 'none'
};
