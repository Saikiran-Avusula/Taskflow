import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await registerApi({ name, email, password });
      navigate('/login?registered=true');
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to register account');
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
        {/* LEFT PANEL (BRANDING) */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
              <div style={{
                width: 40, height: 40, backgroundColor: '#A8FF3E', color: '#080A0E',
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15,
                borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>TF</div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18 }}>TaskFlow</span>
            </div>

            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 52, lineHeight: 1.1, margin: 0 }}>
              Join the<br />
              <span style={{ color: '#A8FF3E' }}>Elite team.</span><br />
              Deploy results.
            </h1>

            <p style={{ marginTop: 20, fontSize: 14, color: '#6B7280', lineHeight: 1.7, maxWidth: 380 }}>
              Create your account to start managing projects with industrial precision.
            </p>
          </div>
        </div>

        {/* VERTICAL DIVIDER */}
        <div style={{ width: 1, backgroundColor: '#252830', height: '100%' }} />

        {/* RIGHT PANEL (FORM) */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ width: 340 }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 26, margin: 0 }}>Initialize Account</h1>
            <p style={{ marginTop: 4, fontSize: 13, color: '#A8FF3E' }}>
              Registration<span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.15em', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="AGENT NAME"
                  required
                  style={inputStyle} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.15em', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@taskflow.local"
                  required
                  style={inputStyle} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.15em', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Security Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={inputStyle} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.15em', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={inputStyle} 
                />
              </div>

              {error && <div style={{ color: '#EF4444', fontSize: 11, fontMono: 'true' }}>[ERROR]: {error}</div>}

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  marginTop: 8,
                  padding: '12px', backgroundColor: '#A8FF3E', color: '#080A0E',
                  border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer',
                  fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em',
                  opacity: loading ? 0.7 : 1, transition: 'all 0.2s'
                }}
              >
                {loading ? 'Initializing...' : 'Confirm Access →'}
              </button>

              <p style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: '#6B7280' }}>
                Already have access? <Link to="/login" style={{ color: '#A8FF3E', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
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
  borderRadius: 4, color: '#ECEEF2', fontSize: 13, outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.2s'
};
