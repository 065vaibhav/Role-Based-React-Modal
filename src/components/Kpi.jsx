export default function Kpi({ label, value, change, icon: Icon }) {
  return (
    <div className="card kpi">
      <div className="kpi-top">
        <span>{label}</span>
        <span className="kpi-icon"><Icon size={17} /></span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-change">{change}</div>
    </div>
  );
}
