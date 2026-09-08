import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-page">
      <div className="brand"><div className="brand-mark"><ShieldCheck size={20} /></div><span>Northstar</span></div>
      <h1>404</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/dashboard" className="primary">Back to dashboard</Link>
    </div>
  );
}
