import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {isMobile ? (
        <>
          <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={true} />
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
              <Sidebar open={true} isMobile={true} onClose={() => setSidebarOpen(false)} />
            </div>
          )}
          <main className="pt-16 pb-20 px-4">
            <Outlet />
          </main>
          <MobileNav />
        </>
      ) : (
        <>
          <Sidebar open={sidebarOpen} />
          <div className={`transition-all duration-200 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
            <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <main className="p-6">
              <Outlet />
            </main>
          </div>
        </>
      )}
    </div>
  );
}