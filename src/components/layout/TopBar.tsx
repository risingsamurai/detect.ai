import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function TopBar() {
  const { user } = useAuthStore();

  return (
    <header className="h-20 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 flex items-center justify-between px-8">
      <div className="relative w-96">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search audits, datasets, or metrics..."
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF] transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D6D] rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">{user?.displayName || 'Demo User'}</p>
            <p className="text-xs text-gray-400">{user?.email || 'demo@lumis.ai'}</p>
          </div>
          <img
            src={user?.photoURL || 'https://ui-avatars.com/api/?name=User&background=6C47FF&color=fff'}
            alt="User avatar"
            className="w-10 h-10 rounded-full border border-white/10"
          />
        </div>
      </div>
    </header>
  );
}
