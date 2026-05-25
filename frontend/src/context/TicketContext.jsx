import { createContext, useContext, useMemo, useState } from 'react';
import { seedTickets } from '../data/seedTickets.js';
import { readStorage, writeStorage } from '../utils/storage.js';
import { useAuth } from './AuthContext.jsx';

const TicketContext = createContext(null);

function createId() {
  return `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function TicketProvider({ children }) {
  const { role } = useAuth();
  const [tickets, setTickets] = useState(() => readStorage('support-tickets', seedTickets));

  const persist = (nextTickets) => {
    setTickets(nextTickets);
    writeStorage('support-tickets', nextTickets);
  };

  const visibleTickets = useMemo(() => {
    if (role === 'User') {
      return tickets.filter((ticket) => ticket.ownerRole === 'User');
    }
    return tickets;
  }, [role, tickets]);

  const createTicket = (values) => {
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

  const updateTicket = (id, values) => {
    const updated = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, ...values, updatedAt: new Date().toISOString() } : ticket,
    );
    persist(updated);
  };

  const deleteTicket = (id) => {
    persist(tickets.filter((ticket) => ticket.id !== id));
  };

  const voteTicket = (id) => {
    const updated = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, votes: ticket.votes + 1, updatedAt: new Date().toISOString() } : ticket,
    );
    persist(updated);
  };

  const getTicket = (id) => tickets.find((ticket) => ticket.id === id);

  const value = useMemo(
    () => ({
      tickets,
      visibleTickets,
      createTicket,
      updateTicket,
      deleteTicket,
      voteTicket,
      getTicket,
    }),
    [tickets, visibleTickets],
  );

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
}

export function useTickets() {
  return useContext(TicketContext);
}
