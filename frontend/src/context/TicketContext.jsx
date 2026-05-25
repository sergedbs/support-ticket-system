import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../api/client.js';
import { seedTickets } from '../data/seedTickets.js';
import { readStorage, writeStorage } from '../utils/storage.js';
import { useAuth } from './AuthContext.jsx';

const TicketContext = createContext(null);

function createId() {
  return `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function TicketProvider({ children }) {
  const { isAuthenticated, role, session } = useAuth();
  const [tickets, setTickets] = useState(() => readStorage('support-tickets', seedTickets));
  const [apiStatus, setApiStatus] = useState('local');
  const [error, setError] = useState('');

  const persist = (nextTickets) => {
    setTickets(nextTickets);
    writeStorage('support-tickets', nextTickets);
  };

  const fetchTickets = async () => {
    if (!isAuthenticated || !session?.token) {
      setApiStatus('local');
      return;
    }

    try {
      setError('');
      const { data } = await apiClient.get('/tickets', { params: { limit: 50, offset: 0 } });
      setTickets(data.items);
      setApiStatus('api');
    } catch {
      setApiStatus('local');
      setError('Backend API is unavailable, using local demo tickets.');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [isAuthenticated, session?.token]);

  const visibleTickets = useMemo(() => {
    if (role === 'User') {
      return tickets.filter((ticket) => ticket.ownerRole === 'User');
    }
    return tickets;
  }, [role, tickets]);

  const createTicket = async (values) => {
    if (apiStatus === 'api') {
      const { data } = await apiClient.post('/tickets', values);
      setTickets((current) => [data, ...current]);
      return data;
    }

    const now = new Date().toISOString();
    const ticket = {
      id: createId(),
      votes: 0,
      status: 'Open',
      ownerRole: role === 'Visitor' ? 'User' : role,
      ownerName: role === 'Agent' ? 'Support Agent' : role === 'Admin' ? 'Admin' : 'Demo User',
      createdAt: now,
      updatedAt: now,
      ...values,
    };
    persist([ticket, ...tickets]);
    return ticket;
  };

  const updateTicket = async (id, values) => {
    if (apiStatus === 'api') {
      const { data } = await apiClient.patch(`/tickets/${id}`, values);
      setTickets((current) => current.map((ticket) => (String(ticket.id) === String(id) ? data : ticket)));
      return data;
    }

    const updated = tickets.map((ticket) =>
      String(ticket.id) === String(id) ? { ...ticket, ...values, updatedAt: new Date().toISOString() } : ticket,
    );
    persist(updated);
  };

  const deleteTicket = async (id) => {
    if (apiStatus === 'api') {
      await apiClient.delete(`/tickets/${id}`);
      setTickets((current) => current.filter((ticket) => String(ticket.id) !== String(id)));
      return;
    }

    persist(tickets.filter((ticket) => String(ticket.id) !== String(id)));
  };

  const voteTicket = async (id) => {
    if (apiStatus === 'api') {
      const { data } = await apiClient.post(`/tickets/${id}/vote`);
      setTickets((current) => current.map((ticket) => (String(ticket.id) === String(id) ? data : ticket)));
      return data;
    }

    const updated = tickets.map((ticket) =>
      String(ticket.id) === String(id) ? { ...ticket, votes: ticket.votes + 1, updatedAt: new Date().toISOString() } : ticket,
    );
    persist(updated);
  };

  const getTicket = (id) => tickets.find((ticket) => String(ticket.id) === String(id));

  const value = useMemo(
    () => ({
      tickets,
      visibleTickets,
      createTicket,
      updateTicket,
      deleteTicket,
      voteTicket,
      getTicket,
      apiStatus,
      error,
      fetchTickets,
    }),
    [apiStatus, error, tickets, visibleTickets],
  );

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
}

export function useTickets() {
  return useContext(TicketContext);
}
