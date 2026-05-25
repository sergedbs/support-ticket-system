export const roles = ['Visitor', 'User', 'Agent', 'Admin'];

export const rolePermissions = {
  Visitor: ['PUBLIC_READ'],
  User: ['TICKET_CREATE', 'TICKET_READ_OWN', 'TICKET_UPDATE_OWN', 'TICKET_DELETE_OWN'],
  Agent: ['TICKET_READ_ALL', 'TICKET_UPDATE_ALL'],
  Admin: ['TICKET_READ_ALL', 'TICKET_CREATE', 'TICKET_UPDATE_ALL', 'TICKET_DELETE_ALL', 'ADMIN_READ'],
};

export function canReadTicket(user, ticket) {
  if (user.role === 'Agent' || user.role === 'Admin') return true;
  return user.role === 'User' && ticket.ownerRole === 'User';
}

export function canUpdateTicket(user, ticket) {
  if (user.role === 'Agent' || user.role === 'Admin') return true;
  return user.role === 'User' && ticket.ownerRole === 'User';
}

export function canDeleteTicket(user, ticket) {
  if (user.role === 'Admin') return true;
  return user.role === 'User' && ticket.ownerRole === 'User';
}
