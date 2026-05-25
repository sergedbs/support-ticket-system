import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-8">
            <p className="eyebrow">MVP support ticket system</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Track support requests from intake to resolution.</h2>
            <p className="muted mt-4 max-w-2xl text-lg">
              A compact helpdesk demo with role-based access, ticket management, filters, search, and theme persistence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="btn-primary" to={isAuthenticated ? '/dashboard' : '/tickets'}>
                Open workspace
              </Link>
              <Link className="btn-secondary" to="/tickets/new">
                Create ticket
              </Link>
            </div>
          </div>
          <div className="bg-slate-900 p-6 text-white">
            <div className="grid h-full min-h-72 content-center gap-4">
              {['Open', 'In Progress', 'Resolved'].map((status, index) => (
                <div key={status} className="rounded-lg border border-white/10 bg-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{status}</span>
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-900">{index + 2}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/20">
                    <div className="h-2 rounded-full bg-blue-400" style={{ width: `${45 + index * 20}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="panel">
          <h3 className="font-semibold">Simple demo token</h3>
          <p className="muted mt-2">Switch roles from the side panel and test protected routes without a full auth system.</p>
        </div>
        <div className="panel">
          <h3 className="font-semibold">Ticket workflow</h3>
          <p className="muted mt-2">Create, edit, delete, vote, search, and filter tickets with local runtime data.</p>
        </div>
        <div className="panel">
          <h3 className="font-semibold">Backend-ready</h3>
          <p className="muted mt-2">The frontend has an API client placeholder for the later Express integration.</p>
        </div>
      </section>
    </div>
  );
}
