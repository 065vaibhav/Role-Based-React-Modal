import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

function Toggle({ label, initial = false }) {
  const [enabled, setEnabled] = useState(initial);
  return <button type="button" className="toggle-row" onClick={() => setEnabled((value) => !value)}><span>{label}</span><span className={`toggle ${enabled ? 'on' : ''}`}><i /></span></button>;
}

export default function Settings() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader eyebrow="CONFIGURATION" title="Settings" description="Profile preferences and workspace security controls." />
      <div className="settings-grid">
        <div className="card settings-card">
          <h3>Profile</h3><p>Basic account details used across the workspace.</p>
          <label>Display name<input defaultValue={user.name} /></label>
          <label>Email address<input defaultValue={user.email} /></label>
          <label>Department<input defaultValue={user.department} /></label>
          <button className="secondary" onClick={() => window.alert('Profile saved for the demo.')}>Save profile</button>
        </div>
        <div className="card settings-card">
          <h3>Security policies</h3><p>These controls demonstrate permission-aware settings components.</p>
          <Toggle label="Require MFA for administrators" initial />
          <Toggle label="Session timeout after 30 minutes" initial />
          <Toggle label="Log permission changes" initial />
          <Toggle label="Allow external invitations" />
          <div className="policy-note"><ShieldCheck size={17} /><div><strong>Role based access is enabled</strong><span>Routes and actions are filtered from the current user's role.</span></div></div>
        </div>
      </div>
    </>
  );
}
