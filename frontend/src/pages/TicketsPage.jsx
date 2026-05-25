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
  sort: 'updatedAt',
  direction: 'desc',
  pageSize: '5',
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
    const priorityRank = { High: 3, Medium: 2, Low: 1 };
    const statusRank = { Open: 4, 'In Progress': 3, Resolved: 2, Closed: 1 };
    const result = visibleTickets.filter((ticket) => {
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

    return result.sort((a, b) => {
      const direction = filters.direction === 'asc' ? 1 : -1;
      if (filters.sort === 'priority') return (priorityRank[a.priority] - priorityRank[b.priority]) * direction;
      if (filters.sort === 'status') return (statusRank[a.status] - statusRank[b.status]) * direction;
      if (filters.sort === 'votes') return (a.votes - b.votes) * direction;
      return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * direction;
    });
  }, [filters, visibleTickets]);

  const [page, setPage] = useState(1);
  const pageSize = Number(filters.pageSize);
  const pageCount = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageTickets = filteredTickets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const updatePagedFilter = (key, value) => {
    setPage(1);
    updateFilter(key, value);
  };

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
              onChange={(event) => updatePagedFilter('search', event.target.value)}
              placeholder="Title, description, or ID"
            />
          </label>
          <FilterSelect label="Status" value={filters.status} options={ticketStatuses} onChange={(value) => updatePagedFilter('status', value)} />
          <FilterSelect
            label="Priority"
            value={filters.priority}
            options={ticketPriorities}
            onChange={(value) => updatePagedFilter('priority', value)}
          />
          <FilterSelect
            label="Category"
            value={filters.category}
            options={ticketCategories}
            onChange={(value) => updatePagedFilter('category', value)}
          />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <FilterSelect
            label="Sort by"
            value={filters.sort}
            options={[
              ['updatedAt', 'Last updated'],
              ['priority', 'Priority'],
              ['status', 'Status'],
              ['votes', 'Votes'],
            ]}
            includeAll={false}
            onChange={(value) => updateFilter('sort', value)}
          />
          <FilterSelect
            label="Direction"
            value={filters.direction}
            options={[
              ['desc', 'Descending'],
              ['asc', 'Ascending'],
            ]}
            includeAll={false}
            onChange={(value) => updateFilter('direction', value)}
          />
          <FilterSelect
            label="Page size"
            value={filters.pageSize}
            options={[
              ['5', '5 tickets'],
              ['10', '10 tickets'],
              ['20', '20 tickets'],
            ]}
            includeAll={false}
            onChange={(value) => updatePagedFilter('pageSize', value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="muted">{filteredTickets.length} matching tickets</span>
        <span className="muted">
          Page {currentPage} of {pageCount}
        </span>
      </div>
      <div className="grid gap-4">
        {pageTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
        {filteredTickets.length === 0 && <div className="panel muted">No tickets match the current filters.</div>}
      </div>
      {filteredTickets.length > pageSize && (
        <div className="flex flex-wrap justify-end gap-2">
          <button className="btn-secondary" type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
            Previous
          </button>
          <button
            className="btn-secondary"
            type="button"
            disabled={currentPage === pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, options, onChange, includeAll = true }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {includeAll && <option>All</option>}
        {options.map((option) => (
          <option key={Array.isArray(option) ? option[0] : option} value={Array.isArray(option) ? option[0] : option}>
            {Array.isArray(option) ? option[1] : option}
          </option>
        ))}
      </select>
    </label>
  );
}
