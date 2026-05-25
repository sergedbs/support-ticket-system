import StatCard from '../components/StatCard.jsx';
import { useTickets } from '../context/TicketContext.jsx';

export default function AdminPage() {
  const { tickets } = useTickets();
  const userTickets = tickets.filter((ticket) => ticket.ownerRole === 'User').length;
  const staffTickets = tickets.length - userTickets;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Admin only</p>
        <h2 className="page-title">Admin panel</h2>
        <p className="muted mt-2">A lightweight placeholder for role and user management in the final API-backed version.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total tickets" value={tickets.length} />
        <StatCard label="User-owned" value={userTickets} tone="active" />
        <StatCard label="Staff-owned" value={staffTickets} tone="done" />
      </div>
      <div className="panel">
        <h3 className="section-title">MVP admin scope</h3>
        <p className="muted mt-2">
          Admins have full ticket access in this demo. Full user management is documented as an optional improvement.
        </p>
      </div>
    </div>
  );
}
