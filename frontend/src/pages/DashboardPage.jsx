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
