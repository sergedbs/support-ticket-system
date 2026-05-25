import { useAuth } from '../context/AuthContext.jsx';

const roles = ['User', 'Agent', 'Admin'];

export default function RolePanel() {
  const { session, role, permissions, loginAs, logout } = useAuth();

  return (
    <div className="panel sticky top-4">
      <div className="mb-4">
        <p className="eyebrow">Demo access</p>
        <h2 className="section-title">Role token</h2>
        <p className="muted mt-1">Select a role to simulate the backend token flow.</p>
      </div>
      <div className="grid gap-2">
        {roles.map((item) => (
          <button
            key={item}
            className={item === role ? 'btn-primary' : 'btn-secondary'}
            type="button"
            onClick={() => loginAs(item)}
          >
            Use {item}
          </button>
        ))}
        {session && (
          <button className="btn-danger" type="button" onClick={logout}>
            Clear token
          </button>
        )}
      </div>
      <div className="mt-5 rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
        <div className="font-semibold">Current role: {role}</div>
        <div className="mt-2 break-all text-xs text-slate-600 dark:text-slate-300">
          {session?.token || 'No token stored'}
        </div>
        <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
          Permissions: {permissions.join(', ')}
        </div>
      </div>
    </div>
  );
}
