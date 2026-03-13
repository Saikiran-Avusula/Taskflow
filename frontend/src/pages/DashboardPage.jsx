import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { role } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const endpoint = role === 'ADMIN' ? '/api/dashboard/admin' : '/api/dashboard/user';
    api
      .get(endpoint)
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.response?.data?.error || 'Unable to load dashboard'));
  }, [role]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary uppercase tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Overview<span className="text-accent">_</span>
        </h1>
        <p className="text-text-secondary text-sm font-medium">Monitoring platform-wide projects and operational status.</p>
      </header>

      {error && (
        <div className="p-4 border border-danger/30 rounded-md bg-danger/5 text-danger text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
          {error}
        </div>
      )}

      {!data && !error && (
        <div className="flex items-center gap-3 text-text-muted font-mono text-xs uppercase tracking-widest">
          <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          Fetching telemetry data...
        </div>
      )}

      {data && (
        <div className={`grid grid-cols-1 ${role === 'ADMIN' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150`}>
          <div className="premium-card p-8 flex flex-col gap-1 hover:translate-y-[-4px]">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{role === 'ADMIN' ? 'Total Projects' : 'My Projects'}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-text-primary font-display">{data.totalProjects}</span>
              <span className="text-xs text-accent font-mono font-bold">ACTV</span>
            </div>
          </div>

          <div className="premium-card p-8 flex flex-col gap-1 hover:translate-y-[-4px]">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{role === 'ADMIN' ? 'Global Tasks' : 'My Tasks'}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-text-primary font-display">{data.totalTasks}</span>
              <span className="text-xs text-warning font-mono font-bold">PEND</span>
            </div>
          </div>

          {role === 'ADMIN' && (
            <div className="premium-card p-8 flex flex-col gap-1 hover:translate-y-[-4px]">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Active Users</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-text-primary font-display">{data.totalUsers}</span>
                <span className="text-xs text-success font-mono font-bold">LIVE</span>
              </div>
            </div>
          )}

          <div className={`premium-card p-8 ${role === 'ADMIN' ? 'md:col-span-3' : 'md:col-span-2'} flex flex-col gap-8`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Task Distribution</span>
              <div className="h-px flex-1 mx-6 bg-border" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {Object.entries(data.tasksByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-text-secondary uppercase">{status}</span>
                    <span className="text-text-primary font-bold">{count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-border">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        status === 'DONE' ? 'bg-success' : status === 'IN_PROGRESS' ? 'bg-warning' : 'bg-text-muted'
                      }`}
                      style={{ width: `${(count / data.totalTasks) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {!data.tasksByStatus || Object.keys(data.tasksByStatus).length === 0 ? (
                <div className="text-text-muted font-mono text-xs uppercase py-4">No task telemetry available</div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
