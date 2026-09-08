import { useEffect, useState } from 'react';
import { Activity, BarChart3, Building2, Globe2, Server, ShieldAlert } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Kpi from '../components/Kpi';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function SuperAdmin() {
  const { user } = useAuth();
  const { tenants, metrics, loadTenants, loadMetrics, saveTenant, addAudit } = useData();
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadTenants();
    loadMetrics();
  }, [loadMetrics, loadTenants]);

  async function updateTenant(tenant) {
    await saveTenant(tenant);
    await addAudit({ actor: user.name, action: 'Updated tenant', target: tenant.name, severity: tenant.status === 'Suspended' ? 'High' : 'Medium', tenantId: tenant.id });
    setEditing(null);
  }

  return (
    <>
      <PageHeader eyebrow="PLATFORM ADMINISTRATION" title="Platform Control" description="Manage tenants, plans and platform-level health from one place." action={<span className="security-badge danger-badge"><ShieldAlert size={14} /> Elevated access</span>} />
      <div className="kpi-grid">
        <Kpi label="Tenants" value={metrics ? metrics.tenants : '—'} change="All customer workspaces" icon={Building2} />
        <Kpi label="Active tenants" value={metrics ? metrics.activeTenants : '—'} change="Currently operational" icon={Globe2} />
        <Kpi label="Monthly recurring" value={metrics ? metrics.mrr : '—'} change="Across all plans" icon={BarChart3} />
        <Kpi label="Platform uptime" value={metrics ? metrics.uptime : '—'} change="Current target 99.95%" icon={Server} />
      </div>

      <div className="platform-grid">
        <div className="card table-card">
          <div className="card-head"><div><h3>Tenant portfolio</h3><p>Lifecycle and commercial information for each workspace.</p></div><button className="secondary small" onClick={() => window.alert('New tenant flow is available for backend integration.')}>New tenant</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tenant</th><th>Plan</th><th>Status</th><th>Members</th><th>MRR</th><th>Region</th><th /></tr></thead>
              <tbody>{tenants.map((tenant) => <tr key={tenant.id}><td><div className="project-name"><div className="project-icon"><Building2 size={14} /></div><div><strong>{tenant.name}</strong><span>Created {tenant.created}</span></div></div></td><td><span className="soft-label">{tenant.plan}</span></td><td><span className={`status-chip ${tenant.status === 'Active' ? 'success' : tenant.status === 'Trial' ? 'warning' : 'danger'}`}>{tenant.status}</span></td><td>{tenant.members}</td><td>{tenant.mrr}</td><td>{tenant.region}</td><td><button className="secondary small" onClick={() => setEditing(tenant)}>Manage</button></td></tr>)}</tbody>
            </table>
          </div>
        </div>

        <div className="card health-card">
          <div className="card-head"><div><h3>Platform health</h3><p>Mock service telemetry</p></div><Activity size={20} /></div>
          <div className="platform-health"><HealthMetric label="API gateway" value="99.999%" /><HealthMetric label="Auth service" value="99.997%" /><HealthMetric label="Database" value="99.991%" /><HealthMetric label="Background jobs" value="99.984%" /></div>
          <div className="incident"><ShieldAlert size={17} /><div><strong>{metrics?.incidents || 0} open incidents</strong><span>Low priority · no customer impact</span></div></div>
        </div>
      </div>

      {editing ? <TenantModal tenant={editing} onClose={() => setEditing(null)} onSave={updateTenant} /> : null}
    </>
  );
}

function HealthMetric({ label, value }) {
  return <div className="health-metric"><span>{label}</span><strong>{value}</strong><i /></div>;
}

function TenantModal({ tenant, onClose, onSave }) {
  const [form, setForm] = useState({ ...tenant });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <Modal eyebrow="TENANT ADMINISTRATION" title={`Manage ${tenant.name}`} onClose={onClose} footer={<><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" onClick={() => onSave(form)}>Apply changes</button></>}>
      <div className="form-grid">
        <label>Tenant name<input value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
        <label>Plan<select value={form.plan} onChange={(event) => update('plan', event.target.value)}><option>Enterprise</option><option>Growth</option><option>Starter</option></select></label>
        <label>Status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option>Active</option><option>Trial</option><option>Suspended</option></select></label>
        <label>Region<input value={form.region} onChange={(event) => update('region', event.target.value)} /></label>
      </div>
    </Modal>
  );
}
