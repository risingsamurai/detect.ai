import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileSearch, Dna, ArrowLeftRight, Settings, LogOut } from 'lucide-react';
import { logOut } from '../../services/firebase';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/audit/new', icon: FileSearch, label: 'New Audit' },
  { path: '/playground', icon: Dna, label: 'Playground' },
  { path: '/compare', icon: ArrowLeftRight, label: 'Compare' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  useAuthStore();

  return (
    <aside className="w-64 h-screen bg-[#12121A] border-r border-white/5 flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#6C47FF] to-[#00C2A8] flex items-center justify-center text-white font-bold text-xl">
          L
        </div>
        <span className="text-xl font-bold tracking-tight">LUMIS.AI</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#6C47FF]/10 text-[#6C47FF] font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={logOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
