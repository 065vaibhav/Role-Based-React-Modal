import { BarChart3, FileText, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Reports() {
  const departments = [['Product', 88], ['Operations', 81], ['Sales', 94], ['Finance', 68], ['Marketing', 72]];
  const volume = [['Apr', 48, 72], ['May', 66, 96], ['Jun', 58, 84], ['Jul', 78, 113], ['Aug', 91, 132], ['Sep', 72, 105]];

  return (
    <>
      <PageHeader eyebrow="REPORTING" title="Reports" description="Delivery and access metrics for regular stakeholder reviews." action={<button className="secondary" onClick={() => window.alert('Report generated for the demo.')}>Generate report</button>} />
      <div className="report-grid">
        <div className="card report-card">
          <div className="card-head"><div><h3>Delivery by department</h3><p>Current completion score</p></div><FileText size={20} /></div>
          {departments.map(([label, value]) => <div className="bar-row" key={label}><div><span>{label}</span><strong>{value}%</strong></div><div className="bar"><i style={{ width: `${value}%` }} /></div></div>)}
        </div>
        <div className="card report-card">
          <div className="card-head"><div><h3>Monthly volume</h3><p>Completed requests</p></div><BarChart3 size={20} /></div>
          <div className="bars">{volume.map(([month, height, total]) => <div className="bar-item" key={month}><span>{month}</span><i style={{ height: `${height}%` }} /><b>{total}</b></div>)}</div>
        </div>
        <div className="card report-card wide-report">
          <div className="card-head"><div><h3>Access coverage</h3><p>Application controls currently configured</p></div><ShieldCheck size={20} /></div>
          <div className="coverage"><div><strong>18</strong><span>Protected routes</span></div><div><strong>10</strong><span>Permission checks</span></div><div><strong>4</strong><span>Roles</span></div><div><strong>100%</strong><span>Audit coverage</span></div></div>
        </div>
      </div>
    </>
  );
}
