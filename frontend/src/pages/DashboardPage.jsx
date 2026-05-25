import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard.jsx';
import TicketCard from '../components/TicketCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';

export default function DashboardPage() {
  const { role } = useAuth();
  const { visibleTickets } = useTickets();
  const open = visibleTickets.filter((ticket) => ticket.status === 'Open').length;
  const active = visibleTickets.filter((ticket) => ticket.status === 'In Progress').length;
  const resolved = visibleTickets.filter((ticket) => ticket.status === 'Resolved' || ticket.status === 'Closed').length;
  const highPriority = visibleTickets.filter((ticket) => ticket.priority === 'High').length;
  const totalVotes = visibleTickets.reduce((sum, ticket) => sum + ticket.votes, 0);
  const newestTicket = [...visibleTickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const categoryCounts = visibleTickets.reduce((counts, ticket) => {
    counts[ticket.category] = (counts[ticket.category] || 0) + 1;
    return counts;
  }, {});
  const statusCounts = visibleTickets.reduce((counts, ticket) => {
    counts[ticket.status] = (counts[ticket.status] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{role} workspace</p>
          <h2 className="page-title">Dashboard</h2>
          <p className="muted mt-2">Overview of the tickets available to your current role.</p>
        </div>
        <Link className="btn-primary" to="/tickets/new">
          New ticket
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open" value={open} tone="active" />
        <StatCard label="In progress" value={active} />
        <StatCard label="Resolved or closed" value={resolved} tone="done" />
        <StatCard label="High priority" value={highPriority} tone="high" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <section className="panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Queue health</p>
              <h3 className="section-title">Status breakdown</h3>
            </div>
            <div className="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800">{totalVotes} votes</div>
          </div>
          <div className="mt-5 grid gap-3">
            {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => {
              const count = statusCounts[status] || 0;
              const percent = visibleTickets.length ? Math.round((count / visibleTickets.length) * 100) : 0;
              return (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold">{status}</span>
                    <span className="muted">{count} tickets</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-brand" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="panel">
          <p className="eyebrow">Categories</p>
          <h3 className="section-title">Work mix</h3>
          <div className="mt-4 grid gap-2">
            {Object.entries(categoryCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between rounded-md bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
                  <span className="font-semibold">{category}</span>
                  <span className="muted">{count}</span>
                </div>
              ))}
          </div>
          {newestTicket && (
            <div className="mt-4 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800">
              <p className="font-semibold">Newest ticket</p>
              <p className="muted mt-1">{newestTicket.title}</p>
            </div>
          )}
        </section>
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="section-title">Recent tickets</h3>
          <Link className="text-sm font-semibold text-brand" to="/tickets">
            View all
          </Link>
        </div>
        <div className="grid gap-4">
          {visibleTickets.slice(0, 3).map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </section>
    </div>
  );
}
