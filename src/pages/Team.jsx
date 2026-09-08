import { useEffect, useState } from 'react';
import { Mail, ShieldCheck, UserPlus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { hasPermission, roles } from '../auth/permissions';

export default function Team() {
  const { user } = useAuth();
  const { users, loadUsers, saveUser, addAudit } = useData();
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadUsers(user.tenantId);
  }, [loadUsers, user.tenantId]);

  async function save(member) {
    const payload = { ...member, id: member.id || `u${Date.now()}`, tenantId: user.tenantId, lastActive: member.id ? member.lastActive : 'Invite pending', status: member.id ? member.status : 'Invited' };
    await saveUser(payload);
    await addAudit({ actor: user.name, action: member.id ? 'Updated member' : 'Invited member', target: payload.email, severity: 'Low', tenantId: user.tenantId });
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        eyebrow="ACCESS MANAGEMENT"
        title="Team & Access"
        description="Manage workspace members and their application roles."
        action={hasPermission(user.role, 'team.manage') ? <button className="primary" onClick={() => setEditing({ name: '', email: '', role: 'user', department: 'Operations' })}><UserPlus size={16} /> Invite member</button> : null}
      />

      <div className="card table-card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Member</th><th>Department</th><th>Role</th><th>Status</th><th>Last active</th>{hasPermission(user.role, 'team.manage') ? <th /> : null}</tr></thead>
            <tbody>
              {users.map((member) => (
                <tr key={member.id}>
                  <td><div className="member-inline"><div className="avatar tiny">{member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><strong>{member.name}</strong><span>{member.email}</span></div></div></td>
                  <td>{member.department}</td>
                  <td><span className="soft-label">{roles[member.role]?.label}</span></td>
                  <td><span className={`status-chip ${member.status === 'Active' ? 'success' : 'warning'}`}>{member.status}</span></td>
                  <td>{member.lastActive}</td>
                  {hasPermission(user.role, 'team.manage') ? <td><button className="secondary small" onClick={() => setEditing(member)}>Edit</button></td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="access-summary">
        <div className="card mini-card"><ShieldCheck size={18} /><div><strong>4 roles</strong><span>Available in this demo</span></div></div>
        <div className="card mini-card"><Mail size={18} /><div><strong>{users.filter((member) => member.status === 'Invited').length} invitations</strong><span>Waiting for acceptance</span></div></div>
      </div>

      {editing ? <MemberModal member={editing} onClose={() => setEditing(null)} onSave={save} /> : null}
    </>
  );
}

function MemberModal({ member, onClose, onSave }) {
  const [form, setForm] = useState({ ...member });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal eyebrow="TEAM MEMBER" title={member.id ? 'Edit member' : 'Invite member'} onClose={onClose} footer={<><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" onClick={() => onSave(form)}>{member.id ? 'Save changes' : 'Send invitation'}</button></>}>
      <div className="form-grid">
        <label>Full name<input value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
        <label>Email<input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label>
        <label>Role<select value={form.role} onChange={(event) => update('role', event.target.value)}><option value="admin">Administrator</option><option value="manager">Manager</option><option value="user">Standard User</option></select></label>
        <label>Department<select value={form.department} onChange={(event) => update('department', event.target.value)}><option>Operations</option><option>Product</option><option>Sales</option><option>Finance</option><option>Technology</option><option>Marketing</option></select></label>
      </div>
    </Modal>
  );
}
