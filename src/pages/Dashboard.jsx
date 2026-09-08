import { useEffect } from 'react';
import { Activity, BriefcaseBusiness, ChevronDown, Gauge, ShieldCheck, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Kpi from '../components/Kpi';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

function FakeChart() {
  const points = [18, 31, 27, 44, 39, 58, 52, 68, 61, 77, 72, 86];
  const width = 720;
  const height = 230;
  const path = points.map((value, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - (value / 100) * height;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="fake-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Operational velocity chart">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="url(#chartFill)" />
        <path d={path} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="chart-labels">
        <span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { projects, users, loadProjects, loadUsers } = useData();

  useEffect(() => {
    loadProjects(user.tenantId);
    loadUsers(user.tenantId);
  }, [loadProjects, loadUsers, user.tenantId]);

  return (
    <>
      <PageHeader
        eyebrow="WORKSPACE OVERVIEW"
        title={`Good evening, ${user.name.split(' ')[0]}.`}
        description="A quick view of delivery, access and team activity."
        action={<span className="security-badge"><ShieldCheck size={14} /> Session active</span>}
      />

      <div className="kpi-grid">
        <Kpi label="Active projects" value={String(projects.length)} change="6 tracked in this workspace" icon={BriefcaseBusiness} />
        <Kpi label="Team members" value={String(users.length)} change="Current tenant members" icon={Users} />
        <Kpi label="Delivery score" value="92%" change="+5.6% vs last month" icon={Gauge} />
        <Kpi label="API reliability" value="99.995%" change="No active customer impact" icon={Activity} />
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card">
          <div className="card-head">
            <div><h3>Operational velocity</h3><p>Completed requests over the last six months</p></div>
            <button className="secondary small">Last 6 months <ChevronDown size={13} /></button>
          </div>
          <FakeChart />
        </div>

        <div className="card health-card">
          <div className="card-head">
            <div><h3>Access posture</h3><p>Current workspace policy coverage</p></div>
            <ShieldCheck size={20} />
          </div>
          <div className="ring"><div className="ring-inner"><strong>96%</strong><span>policy coverage</span></div></div>
          <div className="health-list">
            <div><i className="dot success-dot" />Protected routes<strong>18/18</strong></div>
            <div><i className="dot success-dot" />Permission rules<strong>10/10</strong></div>
            <div><i className="dot success-dot" />Audit coverage<strong>100%</strong></div>
          </div>
        </div>
      </div>
    </>
  );
}
