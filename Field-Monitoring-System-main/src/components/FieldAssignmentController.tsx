"use client";

import { useState } from "react";
import { assignField, unassignField } from "@/lib/actions";
import { 
  UserPlus, 
  UserMinus, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck,
  Plus,
  User
} from "lucide-react";

interface Agent {
  id: string;
  name: string | null;
  email: string;
}

export default function FieldAssignmentController({ 
  fieldId, 
  supervisor, 
  assistant,
  availableAgents 
}: { 
  fieldId: string; 
  supervisor: Agent | null;
  assistant: Agent | null;
  availableAgents: Agent[] 
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [addingAssistant, setAddingAssistant] = useState(false);
  const [agentId, setAgentId] = useState("");

  const handleAssign = async (role: "SUPERVISOR" | "ASSISTANT", targetId: string) => {
    if (!targetId) return;
    setLoading(role);
    try {
      await assignField(fieldId, targetId, role);
      setAddingAssistant(false);
      setAgentId("");
    } catch (err) {
      alert(`Failed to assign ${role === "SUPERVISOR" ? 'agent' : 'assistant'}`);
    } finally {
      setLoading(null);
    }
  };

  const handleUnassign = async (role: "SUPERVISOR" | "ASSISTANT") => {
    const roleName = role === "SUPERVISOR" ? "primary agent" : "assistant";
    if (!confirm(`Are you sure you want to unassign the ${roleName}?`)) return;
    setLoading(role);
    try {
      await unassignField(fieldId, role);
    } catch (err) {
      alert(`Failed to unassign ${roleName}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Primary Assigned Agent Slot */}
      <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--primary)" />
            Assigned Agent
          </h3>
          {!supervisor && <span style={{ fontSize: '0.75rem', color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Unassigned</span>}
        </div>

        {supervisor ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {supervisor.name?.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{supervisor.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{supervisor.email}</p>
            </div>
            <button 
              disabled={!!loading}
              onClick={() => handleUnassign("SUPERVISOR")}
              className="btn" 
              style={{ background: 'none', border: '1px solid #fee2e2', color: '#b91c1c', padding: '0.5rem' }}
              title="Remove Agent"
            >
              {loading === "SUPERVISOR" ? <Loader2 className="animate-spin" size={16} /> : <UserMinus size={16} />}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <select 
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="search-input" 
              style={{ flex: 1, appearance: 'auto' }}
            >
              <option value="">Select primary agent...</option>
              {availableAgents.map((agent: any) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name || agent.email}
                </option>
              ))}
            </select>
            <button 
              disabled={!!loading || !agentId}
              onClick={() => handleAssign("SUPERVISOR", agentId)}
              className="btn btn-primary"
            >
              {loading === "SUPERVISOR" ? <Loader2 className="animate-spin" size={18} /> : 'Assign'}
            </button>
          </div>
        )}
      </div>

      {/* Assistant (Extra Agent) Slot */}
      {supervisor && (
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #94a3b8', background: '#fafafa' }}>
           <h4 style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={16} />
              Extra Agent (Assistant)
           </h4>

           {assistant ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>
                  {assistant.name?.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{assistant.name}</p>
                </div>
                <button 
                  disabled={!!loading}
                  onClick={() => handleUnassign("ASSISTANT")}
                  className="btn" 
                  style={{ background: 'none', color: '#b91c1c', padding: '0.4rem' }}
                >
                  {loading === "ASSISTANT" ? <Loader2 className="animate-spin" size={14} /> : <UserMinus size={14} />}
                </button>
             </div>
           ) : addingAssistant ? (
             <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  onChange={(e) => handleAssign("ASSISTANT", e.target.value)}
                  className="search-input" 
                  style={{ flex: 1, appearance: 'auto', fontSize: '0.875rem', padding: '0.4rem' }}
                >
                  <option value="">Select assistant...</option>
                  {availableAgents.filter(a => a.id !== supervisor.id).map((agent: any) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={() => setAddingAssistant(false)}
                  className="btn" 
                  style={{ background: 'none', border: '1px solid var(--border)', fontSize: '0.8125rem' }}
                >
                  Cancel
                </button>
             </div>
           ) : (
             <button 
               onClick={() => setAddingAssistant(true)}
               className="btn" 
               style={{ width: '100%', border: '1px dashed var(--border)', background: 'white', color: 'var(--text-muted)', justifyContent: 'center', fontSize: '0.875rem' }}
             >
               <Plus size={16} />
               Add Assistant Agent
             </button>
           )}
        </div>
      )}
    </div>
  );
}
