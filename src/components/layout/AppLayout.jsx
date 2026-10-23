import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { AIChatbot } from '../ai/AIChatbot';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const mainRef = useRef(null);

  // Scroll reveal observer — re-runs on every route change
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      const elements = document.querySelectorAll(
        '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)'
      );
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 100); // slight delay so DOM is painted

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      {/* Sidebar for all dashboard/app routes */}
      {!isLandingPage && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${!isLandingPage ? 'lg:pl-64' : ''}`}>
        {!isLandingPage && (
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        )}
        <main ref={mainRef} className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto page-enter">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Global AI Chatbot — floats on all pages */}
      <AIChatbot />
    </div>
  );
}
