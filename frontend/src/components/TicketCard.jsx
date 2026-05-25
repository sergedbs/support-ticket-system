import { Link } from 'react-router-dom';
import TicketBadge from './TicketBadge.jsx';

export default function TicketCard({ ticket }) {
  return (
    <article className="panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">{ticket.id}</p>
          <h3 className="mt-1 text-xl font-semibold">{ticket.title}</h3>
          <p className="muted mt-2 line-clamp-2">{ticket.description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <TicketBadge value={ticket.status} />
          <TicketBadge value={ticket.priority} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="muted">
          {ticket.category} by {ticket.ownerName} · {ticket.votes} votes
        </div>
        <Link className="btn-secondary" to={`/tickets/${ticket.id}`}>
          View
        </Link>
      </div>
    </article>
  );
}
