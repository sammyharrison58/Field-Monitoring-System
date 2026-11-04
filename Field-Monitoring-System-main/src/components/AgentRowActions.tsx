"use client";

import { useState } from "react";
import { toggleAgentStatus, resendInvitation } from "@/lib/actions";
import { 
  MoreVertical, 
  UserX, 
  UserCheck, 
  Send,
  Loader2
} from "lucide-react";

export default function AgentRowActions({ agentId, status }: { agentId: string, status: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await toggleAgentStatus(agentId, status);
    setLoading(false);
    setIsOpen(false);
  };

  const handleResend = async () => {
    setLoading(true);
    await resendInvitation(agentId);
    setLoading(false);
    setIsOpen(false);
    alert("Invitation resent successfully!");
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn" 
        style={{ padding: '0.4rem', background: 'none' }}
      >
        <MoreVertical size={20} color="var(--text-muted)" />
      </button>

      {isOpen && (
        <>
          <div 
            onClick={() => setIsOpen(false)} 
            style={{ position: 'fixed', inset: 0, zIndex: 60 }} 
          />
          <div className="card shadow-lg" style={{ 
            position: 'absolute', 
            right: 0, 
            top: '110%', 
            zIndex: 70, 
            minWidth: '200px', 
            padding: '0.5rem',
            animation: 'fadeIn 0.2s ease'
          }}>
            <button 
              onClick={handleToggle}
              disabled={loading}
              className="nav-item" 
              style={{ width: '100%', border: 'none', background: 'none', display: 'flex', gap: '0.75rem', padding: '0.6rem 0.75rem' }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : (status === "ACTIVE" ? <UserX size={16} /> : <UserCheck size={16} />)}
              <span>{status === "ACTIVE" ? "Suspend Agent" : "Reinstate Agent"}</span>
            </button>

            {status === "PENDING" && (
              <button 
                onClick={handleResend}
                disabled={loading}
                className="nav-item" 
                style={{ width: '100%', border: 'none', background: 'none', display: 'flex', gap: '0.75rem', padding: '0.6rem 0.75rem' }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>Resend Invitation</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
