import { useMemo, useState } from 'react';
import TicketCard from '../components/TicketCard.jsx';
import { ticketCategories, ticketPriorities, ticketStatuses } from '../data/seedTickets.js';
import { useTickets } from '../context/TicketContext.jsx';
import { readStorage, writeStorage } from '../utils/storage.js';

const initialFilters = {
  search: '',
  status: 'All',
  priority: 'All',
  category: 'All',
};

export default function TicketsPage() {
  const { visibleTickets } = useTickets();
  const { apiStatus, error } = useTickets();
  const [filters, setFilters] = useState(() => readStorage('support-ticket-filters', initialFilters));

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    writeStorage('support-ticket-filters', next);
  };

  const filteredTickets = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return visibleTickets.filter((ticket) => {
      const matchesSearch =
        !search ||
        ticket.title.toLowerCase().includes(search) ||
        ticket.description.toLowerCase().includes(search) ||
        ticket.id.toLowerCase().includes(search);
      const matchesStatus = filters.status === 'All' || ticket.status === filters.status;
      const matchesPriority = filters.priority === 'All' || ticket.priority === filters.priority;
      const matchesCategory = filters.category === 'All' || ticket.category === filters.category;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [filters, visibleTickets]);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Ticket queue</p>
        <h2 className="page-title">Tickets</h2>
        <p className="muted mt-2">Search and filter the currently visible tickets for your role.</p>
        <p className="muted mt-2 text-sm">Data source: {apiStatus === 'api' ? 'Backend API' : 'Local demo state'}</p>
        {error && <p className="mt-2 text-sm font-semibold text-warning">{error}</p>}
      </div>
      <div className="panel">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="field">
            <span>Search</span>
            <input
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Title, description, or ID"
            />
          </label>
          <FilterSelect label="Status" value={filters.status} options={ticketStatuses} onChange={(value) => updateFilter('status', value)} />
          <FilterSelect
            label="Priority"
            value={filters.priority}
            options={ticketPriorities}
            onChange={(value) => updateFilter('priority', value)}
          />
          <FilterSelect
            label="Category"
            value={filters.category}
            options={ticketCategories}
            onChange={(value) => updateFilter('category', value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="muted">{filteredTickets.length} matching tickets</span>
        <span className="muted">Showing first 10 results</span>
      </div>
      <div className="grid gap-4">
        {filteredTickets.slice(0, 10).map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
        {filteredTickets.length === 0 && <div className="panel muted">No tickets match the current filters.</div>}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option>All</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
