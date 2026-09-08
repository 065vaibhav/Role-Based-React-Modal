import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, Plus, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { hasPermission } from '../auth/permissions';

const emptyProject = { name: '', owner: '', department: 'Operations', progress: 0, status: 'On track', budget: '₹0', updated: 'Today' };

export default function Projects() {
  const { user } = useAuth();
  const { projects, users, loadProjects, loadUsers, saveProject, addAudit } = useData();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadProjects(user.tenantId);
    loadUsers(user.tenantId);
  }, [loadProjects, loadUsers, user.tenantId]);

  const filtered = useMemo(() => projects.filter((project) => {
    const matchesQuery = `${project.name} ${project.owner} ${project.department}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'All' || project.status === status);
  }), [projects, query, status]);

  async function handleSave(project) {
    const payload = {
      ...project,
      id: project.id || `p${Date.now()}`,
      tenantId: user.tenantId,
      updated: 'Just now',
      progress: Number(project.progress) || 0,
    };
    await saveProject(payload);
    await addAudit({ actor: user.name, action: project.id ? 'Updated project' : 'Created project', target: payload.name, severity: 'Low', tenantId: user.tenantId });
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        eyebrow="DELIVERY"
        title="Projects"
        description="Track work, ownership, budget and delivery risk."
        action={hasPermission(user.role, 'projects.manage') ? <button className="primary" onClick={() => setEditing({ ...emptyProject })}><Plus size={16} /> New project</button> : null}
      />

      <div className="card table-card">
        <div className="table-toolbar">
          <div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" /></div>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option><option>On track</option><option>At risk</option><option>Complete</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Project</th><th>Owner</th><th>Status</th><th>Progress</th><th>Budget</th><th>Updated</th>{hasPermission(user.role, 'projects.manage') ? <th /> : null}</tr></thead>
            <tbody>
              {filtered.map((project) => (
                <tr key={project.id}>
                  <td><div className="project-name"><div className="project-icon"><BriefcaseBusiness size={14} /></div><div><strong>{project.name}</strong><span>{project.department}</span></div></div></td>
                  <td>{project.owner}</td>
                  <td><span className={`status-chip ${project.status === 'Complete' ? 'success' : project.status === 'At risk' ? 'warning' : 'neutral'}`}>{project.status}</span></td>
                  <td><div className="progress-cell"><div className="progress"><i style={{ width: `${project.progress}%` }} /></div><span>{project.progress}%</span></div></td>
                  <td>{project.budget}</td>
                  <td>{project.updated}</td>
                  {hasPermission(user.role, 'projects.manage') ? <td><button className="secondary small" onClick={() => setEditing(project)}>Edit</button></td> : null}
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length ? <div className="empty-table">No projects match this filter.</div> : null}
        </div>
      </div>

      {editing ? <ProjectModal project={editing} users={users} onClose={() => setEditing(null)} onSave={handleSave} /> : null}
    </>
  );
}

function ProjectModal({ project, users, onClose, onSave }) {
  const [form, setForm] = useState({ ...project });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal eyebrow="PROJECT" title={project.id ? 'Edit project' : 'Create project'} onClose={onClose} footer={<><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" onClick={() => onSave(form)}>Save project</button></>}>
      <div className="form-grid">
        <label>Project name<input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Customer Portal" /></label>
        <label>Owner<select value={form.owner} onChange={(event) => update('owner', event.target.value)}><option value="">Select owner</option>{users.map((user) => <option key={user.id}>{user.name}</option>)}</select></label>
        <label>Department<select value={form.department} onChange={(event) => update('department', event.target.value)}><option>Operations</option><option>Product</option><option>Sales</option><option>Finance</option><option>Technology</option><option>Marketing</option></select></label>
        <label>Status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option>On track</option><option>At risk</option><option>Complete</option></select></label>
        <label>Progress %<input type="number" min="0" max="100" value={form.progress} onChange={(event) => update('progress', event.target.value)} /></label>
        <label>Budget<input value={form.budget} onChange={(event) => update('budget', event.target.value)} placeholder="₹12.5L" /></label>
      </div>
    </Modal>
  );
}
