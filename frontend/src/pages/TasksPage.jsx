import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function TasksPage() {
  const { role } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const hasProjects = projects.length > 0;
  const hasUsers = users.length > 0;
  const canCreateTask = hasProjects && hasUsers;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const tasksRes = await api.get('/api/tasks');
      setTasks(tasksRes.data);

      if (role === 'ADMIN') {
        const [projectsRes, usersRes] = await Promise.all([
          api.get('/api/projects'),
          api.get('/api/users'),
        ]);
        setProjects(projectsRes.data);
        setUsers(usersRes.data);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to load data');
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await api.post('/api/tasks', {
        title: newTitle,
        projectId: Number(newProject),
        assignedTo: Number(newAssignee),
        dueDate: newDueDate || null,
      });

      setNewTitle('');
      setNewProject('');
      setNewAssignee('');
      setNewDueDate('');
      loadData();
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to create task');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await api.put(`/api/tasks/${task.id}`, {
        ...task,
        status: newStatus,
      });
      loadData();
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      loadData();
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to delete task');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary uppercase tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Mission Control<span className="text-accent">_</span>
          </h1>
          <p className="text-text-secondary text-sm font-medium">Coordinate task deployment and operational workflows.</p>
        </div>
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
          Syncing mission database...
        </div>
      ) : (
        <div className="space-y-12">
          {/* CREATE TASK SECTION (ADMIN) */}
          {role === 'ADMIN' && (
            <section className="premium-card p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Deploy New Mission</h2>
                <div className="h-px flex-1 bg-border" />
              </div>

              {!canCreateTask && (
                <div className="mb-6 rounded-md border border-warning/30 bg-warning/5 p-4 text-sm text-text-secondary">
                  {!hasProjects
                    ? 'Create a project first in the Projects page before creating tasks.'
                    : 'No users are available to assign. Register a user account first.'}
                </div>
              )}
              
              <form className="grid grid-cols-1 md:grid-cols-4 gap-6" onSubmit={handleCreate}>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Mission Title</label>
                  <input
                    className="input-field py-3 px-4 font-mono"
                    placeholder="E.G. DATA_EXTRACTION_ZERO"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    disabled={!canCreateTask}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Parent Project</label>
                  <select
                    className="input-field py-3 px-4 appearance-none"
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    disabled={!canCreateTask}
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Assigned Agent</label>
                  <select
                    className="input-field py-3 px-4 appearance-none"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    disabled={!canCreateTask}
                    required
                  >
                    <option value="">Select Agent</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Deadline</label>
                  <input
                    className="input-field py-3 px-4 font-mono"
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    disabled={!canCreateTask}
                  />
                </div>

                <div className="md:col-span-3 flex items-center">
                  <p className="text-[10px] text-text-muted font-mono italic">Ensure all parameters are validated before deployment.</p>
                </div>

                <div className="flex justify-end">
                  <button
                    className="btn-primary w-full py-3 uppercase tracking-[0.15em] text-[10px] font-bold font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={!canCreateTask}
                  >
                    Authorize Mission
                  </button>
                </div>
              </form>
            </section>
          )}

          {role === 'USER' && (
            <section className="premium-card p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
                <div className="space-y-2">
                  <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Task Access
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Tasks are created and assigned by admins. You can view only your assigned tasks here and update their status.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* TASKS TABLE */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-text-muted" />
              <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Active Operations</h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="premium-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-surface-raised/50">
                      <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Identifier</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Mission Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Project / Agent</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {tasks.map((task, idx) => (
                      <tr 
                        key={task.id} 
                        className="group hover:bg-surface-raised/30 transition-colors animate-in fade-in slide-in-from-left-2 duration-500"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <td className="px-6 py-6 font-mono text-xs text-text-muted">
                          #{task.id}
                        </td>
                        <td className="px-6 py-6">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-text-primary uppercase tracking-tight">{task.title}</div>
                            <div className="text-[10px] font-mono text-text-muted">DUE: {task.dueDate || 'UNDEFINED'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <select
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-sm border bg-bg focus:outline-none transition-all cursor-pointer uppercase tracking-widest ${
                              task.status === 'DONE' ? 'border-success/30 text-success' : 
                              task.status === 'IN_PROGRESS' ? 'border-warning/30 text-warning' : 
                              'border-border text-text-muted'
                            }`}
                            value={task.status}
                            onChange={(e) => handleStatusChange(task, e.target.value)}
                          >
                            {DEFAULT_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span className="text-[10px] font-bold text-text-secondary uppercase">{task.projectName || `PID: ${task.projectId}`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-accent" />
                              <span className="text-[10px] font-medium text-text-muted italic">{task.assigneeName || `AGENT: ${task.assignedTo}`}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                          {role === 'ADMIN' && (
                            <button 
                              className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-sm transition-all"
                              onClick={() => handleDelete(task.id)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {tasks.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-text-muted gap-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Zero mission telemetry detected.</p>
                  {role === 'USER' && (
                    <p className="text-sm text-text-secondary">
                      No tasks are assigned to your account yet. Ask an admin to create and assign one.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
