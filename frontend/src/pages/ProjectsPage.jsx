import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function ProjectsPage() {
  const { role } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get('/api/projects');
        if (active) {
          setProjects(res.data);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.error || 'Unable to load projects');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      active = false;
    };
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await api.post('/api/projects', { name, description });
      setName('');
      setDescription('');
      loadProjects();
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to create project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      loadProjects();
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to delete project');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary uppercase tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Projects<span className="text-accent">_</span>
          </h1>
          <p className="text-text-secondary text-sm font-medium">Global repository of active initiatives and project statuses.</p>
        </div>
      </header>

      {error && (
        <div className="p-4 border border-danger/30 rounded-md bg-danger/5 text-danger text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
          {error}
        </div>
      )}

      {/* CREATE PROJECT SECTION */}
      {role === 'ADMIN' && (
        <section className="premium-card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Initialize New Project</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleCreate}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Project Identifier</label>
              <input 
                className="input-field py-3 px-4 font-mono"
                placeholder="E.G. PROJECT_X_ALPHA"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Operational Description</label>
              <textarea 
                className="input-field py-3 px-4 min-h-[50px] resize-none"
                placeholder="Provide technical scope..."
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            <div className="md:col-span-2 flex justify-end pt-2">
              <button className="btn-primary px-10 py-3 uppercase tracking-[0.15em] text-[10px] font-bold font-mono" type="submit">
                Commence Setup
              </button>
            </div>
          </form>
        </section>
      )}

      {/* PROJECTS GRID */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-text-muted" />
          <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Active Records</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-text-muted font-mono text-xs uppercase tracking-widest pl-2">
            <div className="w-4 h-4 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
            Syncing project database...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div 
                key={project.id} 
                className="premium-card p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-text-primary tracking-tight font-display">{project.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-[10px] font-bold text-success uppercase tracking-widest">{project.status}</span>
                    </div>
                  </div>
                  {role === 'ADMIN' && (
                    <button 
                      className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-sm transition-all"
                      onClick={() => handleDelete(project.id)}
                      title="Delete Permanently"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 min-h-[4.5em]">{project.description || 'No system logs available for this project.'}</p>
                
                <div className="pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Lead Authority</span>
                    <span className="text-xs text-text-secondary font-mono">{project.createdByName || 'SYSTEM'}</span>
                  </div>
                  <div className="px-3 py-1 bg-bg border border-border rounded-sm text-[10px] font-mono text-text-muted group-hover:text-accent transition-colors">
                    ID: {project.id}
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full py-20 premium-card flex flex-col items-center justify-center text-text-muted gap-4">
                <div className="w-12 h-12 border border-dashed border-border rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest">No project records found in the archive.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
