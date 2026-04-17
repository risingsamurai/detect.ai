import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuthStore } from '../../store/authStore';

export default function PageLayout() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
        <div className="w-8 h-8 border-4 border-[#6C47FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Allow non-authenticated users to view the dashboard and playground in demo mode,
  // but ideally we'd force login for most features. 
  // Let's not strict enforce login for the hackathon demo unless we explicitly want to block it.
  
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
