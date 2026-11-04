"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useSidebar } from "@/lib/sidebar-context";
import { 
  LayoutDashboard, 
  Sprout, 
  Users, 
  LogOut, 
  Leaf,
  LineChart,
  UserCircle,
  X
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isOpen, close } = useSidebar();
  const role =
    session?.user &&
    "role" in session.user &&
    typeof session.user.role === "string"
      ? session.user.role
      : null;
  const userRole = role || "AGENT";

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Fields", href: "/fields", icon: Sprout },
    { name: "Profile", href: "/profile", icon: UserCircle },
    ...(userRole === "ADMIN" ? [
      { name: "Agents", href: "/admin/agents", icon: Users },
      { name: "Analytics", href: "/analytics", icon: LineChart },
    ] : []),
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={close}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.3)', 
            backdropFilter: 'blur(4px)',
            zIndex: 45 
          }} 
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <Link href="/" className="sidebar-logo" style={{ textDecoration: 'none', color: 'inherit', marginBottom: 0 }}>
            <Leaf size={32} strokeWidth={2.5} />
            <span>SmartSeason</span>
          </Link>
          
          <button 
            onClick={close}
            className="mobile-only"
            style={{ 
              background: 'var(--primary-soft)', 
              color: 'var(--primary)', 
              padding: '8px', 
              borderRadius: '8px',
              display: 'none' // Controlled by CSS
            }}
          >
            <X size={20} />
          </button>
        </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <button 
          onClick={() => signOut()}
          className="nav-item" 
          style={{ width: '100%', border: 'none', background: 'none' }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
      </aside>
    </>
  );
}
