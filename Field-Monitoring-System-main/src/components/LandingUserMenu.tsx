"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  User as UserIcon,
  Loader2
} from "lucide-react";

export default function LandingUserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          background: 'rgba(5, 150, 105, 0.05)', 
          padding: '0.4rem 0.75rem', 
          borderRadius: '99px', 
          border: '1px solid rgba(5, 150, 105, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        className="hover-shadow"
      >
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          overflow: 'hidden', 
          background: '#059669', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '0.875rem'
        }}>
          {user.image ? (
            <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user.name?.charAt(0)
          )}
        </div>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{user.name?.split(' ')[0]}</span>
        <ChevronDown size={16} color="#6b7280" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <>
          <div 
            onClick={() => setIsOpen(false)} 
            style={{ position: 'fixed', inset: 0, zIndex: 60 }} 
          />
          <div style={{ 
            position: 'absolute', 
            right: 0, 
            top: '120%', 
            width: '220px', 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', 
            border: '1px solid #f1f5f9',
            padding: '0.5rem',
            zIndex: 70,
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
               <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Active Account</p>
               <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginTop: '0.2rem' }}>{user.role}</p>
            </div>

            <Link 
              href="/dashboard"
              className="nav-item"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#111827', textDecoration: 'none', borderRadius: '10px' }}
            >
              <LayoutDashboard size={18} color="#059669" />
              <span style={{ fontWeight: 500 }}>Back to Dashboard</span>
            </Link>

            <button 
              onClick={() => signOut()}
              className="nav-item"
              style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#dc2626', cursor: 'pointer', borderRadius: '10px' }}
            >
              <LogOut size={18} />
              <span style={{ fontWeight: 500 }}>Log Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
