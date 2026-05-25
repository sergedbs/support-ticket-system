import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import TicketBadge from '../components/TicketBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { deleteTicket, getTicket, voteTicket } = useTickets();
  const ticket = getTicket(id);

  if (!ticket) {
    return <Navigate to="/tickets" replace />;
  }

  const canDelete = role === 'Admin' || (role === 'User' && ticket.ownerRole === 'User');
  const canEdit = role === 'Admin' || role === 'Agent' || (role === 'User' && ticket.ownerRole === 'User');

  const handleDelete = async () => {
    await deleteTicket(ticket.id);
    navigate('/tickets');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">{ticket.id}</p>
          <h2 className="page-title">{ticket.title}</h2>
          <p className="muted mt-2">
            Created by {ticket.ownerName} on {new Date(ticket.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TicketBadge value={ticket.status} />
          <TicketBadge value={ticket.priority} />
        </div>
      </div>
      <article className="panel">
        <p className="whitespace-pre-line leading-7">{ticket.description}</p>
        <dl className="mt-6 grid gap-4 rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-800 sm:grid-cols-2">
          <Info label="Category" value={ticket.category} />
          <Info label="Votes" value={ticket.votes} />
          <Info label="Owner role" value={ticket.ownerRole} />
          <Info label="Updated" value={new Date(ticket.updatedAt).toLocaleString()} />
        </dl>
      </article>
      <div className="flex flex-wrap gap-3">
        <button className="btn-secondary" type="button" onClick={() => voteTicket(ticket.id)}>
          Upvote
        </button>
        {canEdit && (
          <Link className="btn-primary" to={`/tickets/${ticket.id}/edit`}>
            Edit
          </Link>
        )}
        {canDelete && (
          <button className="btn-danger" type="button" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="font-semibold">{label}</dt>
      <dd className="muted mt-1">{value}</dd>
    </div>
  );
}
