"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, User as UserIcon, Menu } from "lucide-react";
import { useSidebar } from "@/lib/sidebar-context";

export default function Header() {
  const { data: session } = useSession();
  const { toggle } = useSidebar();
  const role =
    session?.user &&
    "role" in session.user &&
    typeof session.user.role === "string"
      ? session.user.role
      : "";

  return (
    <header className="header">
      <div className="header-left">
        <button 
          onClick={toggle}
          className="mobile-only"
          style={{ 
            background: 'var(--primary-soft)', 
            color: 'var(--primary)', 
            padding: '8px', 
            borderRadius: '8px',
            display: 'none', // Controlled by CSS
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Menu size={24} />
        </button>
        <h2 style={{ fontSize: '1.25rem' }}>Overview</h2>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search fields or agents..." 
            className="search-input" 
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <button className="btn" style={{ padding: '0.5rem', background: 'none', border: '1px solid var(--border)' }}>
          <Bell size={20} color="var(--text-muted)" />
        </button>

        <div className="header-user">
          <div className="header-user-copy">
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>{session?.user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.025em' }}>{role}</p>
          </div>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '50%', 
            background: '#ecfdf5', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            border: '1.5px solid #10b981', 
            overflow: 'hidden',
            boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.05)'
          }}>
             {session?.user?.image ? (
               <img src={session.user.image} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             ) : (
               <UserIcon size={20} color="#10b981" />
             )}
          </div>
        </div>
      </div>
    </header>
  );
}
