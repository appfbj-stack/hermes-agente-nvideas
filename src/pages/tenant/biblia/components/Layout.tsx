import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import Player from './Player';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Início', path: '/t/biblia' },
    { icon: BookOpen, label: 'Bíblia', path: '/t/biblia/read' },
    { icon: MessageSquare, label: 'Hermes IA', path: '/t/biblia/chat' },
  ];

  return (
    <div className="flex h-full w-full bg-[#0F1115] text-[#E2E8F0] font-sans overflow-hidden rounded-2xl border border-white/5">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0F1115] relative">
        {/* Navigation Tabs - Instead of Sidebar */}
        <div className="flex items-center gap-2 p-4 bg-[#16191E] border-b border-white/5 overflow-x-auto shrink-0 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/t/biblia' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap",
                  isActive 
                    ? "bg-[#C5A059]/15 text-[#C5A059]" 
                    : "text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto flex flex-col relative w-full h-full">
          {children}
        </main>

        <Player />
      </div>
    </div>
  );
}
