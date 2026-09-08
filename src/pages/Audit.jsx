import { useEffect } from 'react';
import { Activity } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Audit() {
  const { user } = useAuth();
  const { audit, loadAudit } = useData();

  useEffect(() => {
    loadAudit(user.tenantId);
  }, [loadAudit, user.tenantId]);

  return (
    <>
      <PageHeader eyebrow="SECURITY" title="Audit Log" description="A tenant-scoped history of administrative and project changes." />
      <div className="audit-stats"><div className="card"><span>Events today</span><strong>{audit.length}</strong><small>Latest workspace events</small></div><div className="card"><span>High severity</span><strong>{audit.filter((item) => item.severity === 'High').length}</strong><small>Needs review</small></div><div className="card"><span>Policy changes</span><strong>12</strong><small>3 this week</small></div></div>
      <div className="card table-card"><div className="table-wrap"><table><thead><tr><th>Actor</th><th>Action</th><th>Target</th><th>When</th><th>Severity</th></tr></thead><tbody>{audit.map((entry) => <tr key={entry.id}><td><div className="member-inline"><div className="avatar tiny">{entry.actor[0]}</div>{entry.actor}</div></td><td><strong>{entry.action}</strong></td><td>{entry.target}</td><td>{entry.when}</td><td><span className={`status-chip ${entry.severity === 'High' ? 'danger' : entry.severity === 'Medium' ? 'warning' : 'neutral'}`}>{entry.severity}</span></td></tr>)}</tbody></table></div></div>
      <div className="note-line"><Activity size={15} /> Audit records in this demo are persisted to localStorage by the mock API.</div>
    </>
  );
}
