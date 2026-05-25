import { NavLink, Outlet } from 'react-router-dom';
import RolePanel from './RolePanel.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Home', public: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/tickets/new', label: 'New Ticket', roles: ['User', 'Admin'] },
  { to: '/admin', label: 'Admin', roles: ['Admin'] },
];

export default function AppLayout() {
  const { role, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-ink transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Support Desk</p>
            <h1 className="text-2xl font-bold">Ticket workspace</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex flex-wrap gap-2">
              {links
                .filter((link) => link.public || isAuthenticated)
                .filter((link) => !link.roles || link.roles.includes(role))
                .map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-brand text-white'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_320px]">
        <section className="min-w-0">
          <Outlet />
        </section>
        <aside>
          <RolePanel />
        </aside>
      </main>
    </div>
  );
}
