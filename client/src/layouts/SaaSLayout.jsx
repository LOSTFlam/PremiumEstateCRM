import { useState } from "react";
import { motion } from "framer-motion";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../providers/ThemeProvider";
import { useSelector } from "react-redux";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "📊" },
  { label: "Pipeline", path: "/pipeline", icon: "🔄" },
  { label: "Leads", path: "/leads", icon: "👤" },
  { label: "Properties", path: "/properties", icon: "🏠" },
  { label: "Contacts", path: "/contacts", icon: "📇" },
  { label: "Tasks", path: "/tasks", icon: "✅" },
  { label: "Calendar", path: "/calendar", icon: "📅" },
  { label: "Analytics", path: "/analytics", icon: "📈" },
];

const adminNavItems = [
  ...navItems,
  { label: "Settings", path: "/admin/settings", icon: "⚙️" },
  { label: "Users", path: "/admin/users", icon: "👥" },
];

export function SaaSLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const items = user?.role === "superAdmin" ? adminNavItems : navItems;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full bg-[var(--card-bg)] border-r border-[var(--card-border)] z-40"
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg"
            >
              EstateCRM
            </motion.span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <nav className="mt-4 px-2">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-all mb-1 ${
                  isActive
                    ? "bg-[var(--accent-muted)] text-[var(--accent)] font-medium"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      <div className={`transition-all duration-200 ${sidebarOpen ? "ml-[260px]" : "ml-[72px]"}`}>
        <header className="sticky top-0 z-30 bg-[var(--card-bg)]/80 backdrop-blur-xl border-b border-[var(--card-border)] px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
          >
            ←
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-medium text-sm">
              {user?.firstName?.[0] || user?.username?.[0] || "U"}
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
