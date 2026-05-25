import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ticketCategories, ticketPriorities, ticketStatuses } from '../data/seedTickets.js';
import { getApiErrorMessage } from '../utils/errors.js';

export default function TicketFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { createTicket, getTicket, updateTicket } = useTickets();
  const { showToast } = useToast();
  const existingTicket = id ? getTicket(id) : null;
  const isEdit = Boolean(id);

  const [values, setValues] = useState(() => ({
    title: existingTicket?.title || '',
    description: existingTicket?.description || '',
    category: existingTicket?.category || 'General',
    priority: existingTicket?.priority || 'Medium',
    status: existingTicket?.status || 'Open',
  }));
  const [formError, setFormError] = useState('');

  const canEdit = useMemo(() => {
    if (!isEdit) return true;
    if (!existingTicket) return false;
    if (role === 'Admin' || role === 'Agent') return true;
    return existingTicket.ownerRole === 'User';
  }, [existingTicket, isEdit, role]);

  if (isEdit && !existingTicket) {
    return <Navigate to="/tickets" replace />;
  }

  if (!canEdit) {
    return <Navigate to={`/tickets/${id}`} replace />;
  }

  const updateValue = (key, value) => {
    setFormError('');
    setValues((current) => ({ ...current, [key]: value }));
  };

  const getValidationError = () => {
    if (values.title.trim().length < 4) return 'Title must be at least 4 characters long.';
    if (values.description.trim().length < 10) return 'Description must be at least 10 characters long.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = getValidationError();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      if (isEdit) {
        await updateTicket(id, values);
        showToast('Ticket updated.', 'success');
        navigate(`/tickets/${id}`);
      } else {
        const ticket = await createTicket(values);
        showToast('Ticket created.', 'success');
        navigate(`/tickets/${ticket.id}`);
      }
    } catch (error) {
      const message = getApiErrorMessage(error);
      setFormError(message);
      showToast(message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">{isEdit ? 'Update request' : 'New request'}</p>
        <h2 className="page-title">{isEdit ? 'Edit ticket' : 'Create ticket'}</h2>
      </div>
      <form className="panel grid gap-4" onSubmit={handleSubmit}>
        {formError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {formError}
          </div>
        )}
        <label className="field">
          <span>Title</span>
          <input
            required
            minLength="4"
            value={values.title}
            onChange={(event) => updateValue('title', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            required
            minLength="10"
            rows="6"
            value={values.description}
            onChange={(event) => updateValue('description', event.target.value)}
          />
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField label="Category" value={values.category} options={ticketCategories} onChange={(value) => updateValue('category', value)} />
          <SelectField label="Priority" value={values.priority} options={ticketPriorities} onChange={(value) => updateValue('priority', value)} />
          <SelectField label="Status" value={values.status} options={ticketStatuses} onChange={(value) => updateValue('status', value)} />
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <button className="btn-secondary" type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="btn-primary" type="submit">
            {isEdit ? 'Save changes' : 'Create ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
