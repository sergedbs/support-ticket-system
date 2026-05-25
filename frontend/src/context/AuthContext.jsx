import { createContext, useContext, useMemo, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage.js';

const AuthContext = createContext(null);
const rolePermissions = {
  Visitor: ['PUBLIC_READ'],
  User: ['TICKET_CREATE', 'TICKET_READ_OWN', 'TICKET_UPDATE_OWN', 'TICKET_DELETE_OWN'],
  Agent: ['TICKET_READ_ALL', 'TICKET_UPDATE_ALL'],
  Admin: ['TICKET_READ_ALL', 'TICKET_CREATE', 'TICKET_UPDATE_ALL', 'TICKET_DELETE_ALL', 'ADMIN_READ'],
};

function createDemoToken(role) {
  const expiresAt = Date.now() + 60 * 1000;
  return {
    token: `demo-${role.toLowerCase()}-${expiresAt}`,
    role,
    permissions: rolePermissions[role],
    expiresAt,
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStorage('support-session', null));

  const loginAs = (role) => {
    const nextSession = createDemoToken(role);
    setSession(nextSession);
    writeStorage('support-session', nextSession);
  };

  const logout = () => {
    setSession(null);
    writeStorage('support-session', null);
  };

  const isExpired = session?.expiresAt ? Date.now() > session.expiresAt : false;
  const role = isExpired ? 'Visitor' : session?.role || 'Visitor';

  const value = useMemo(
    () => ({
      session: isExpired ? null : session,
      role,
      permissions: isExpired ? rolePermissions.Visitor : session?.permissions || rolePermissions.Visitor,
      isAuthenticated: role !== 'Visitor',
      loginAs,
      logout,
    }),
    [isExpired, role, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
