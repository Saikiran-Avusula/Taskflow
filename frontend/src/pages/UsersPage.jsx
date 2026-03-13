import { useEffect, useState } from 'react';
import api from '../api/client';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/api/users')
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err?.response?.data?.error || 'Unable to load users'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary uppercase tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Personnel Dashboard<span className="text-accent">_</span>
        </h1>
        <p className="text-text-secondary text-sm font-medium">Registry of authorized personnel and account clearance levels.</p>
      </header>

      {error && (
        <div className="p-4 border border-danger/30 rounded-md bg-danger/5 text-danger text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-text-muted font-mono text-xs uppercase tracking-widest pl-2">
          <div className="w-4 h-4 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
          Syncing personnel records...
        </div>
      ) : (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-text-muted" />
            <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Authorized Entities</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="premium-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-raised/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Entry ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Personnel Identity</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Clearance Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {users.map((user, idx) => (
                    <tr 
                      key={user.id} 
                      className="group hover:bg-surface-raised/30 transition-colors animate-in fade-in slide-in-from-left-2 duration-500"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <td className="px-6 py-6 font-mono text-xs text-text-muted">
                        REG-{user.id.toString().padStart(4, '0')}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-accent font-bold text-[10px]">
                            {user.name?.[0] || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-text-primary uppercase tracking-tight">{user.name}</span>
                            <span className="text-[10px] font-mono text-text-muted">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                          user.role === 'ADMIN' ? 'border-accent text-accent bg-accent/5' : 'border-border text-text-secondary bg-bg'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-text-muted gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Zero personnel records detected.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
