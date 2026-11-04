"use client";

import { useState } from "react";
import { registerAgent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  ArrowLeft, 
  UserPlus, 
  Mail, 
  User, 
  IdCard, 
  Briefcase,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function NewAgentPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
       await registerAgent(formData);
       setSuccess(true);
       setTimeout(() => router.push("/admin/agents"), 2000);
    } catch (err) {
       alert("Failed to register agent. Please try again.");
    } finally {
       setLoading(false);
    }
  }

  if (success) {
    return (
      <DashboardLayout>
        <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card text-center" style={{ padding: '3rem', maxWidth: '400px' }}>
            <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#166534', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>Invitation Sent!</h2>
            <p style={{ color: 'var(--text-muted)' }}>An activation email has been sent to the agent. Redirecting to dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/admin/agents" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} />
          Back to Agents
        </Link>
        <h1 style={{ fontSize: '2rem' }}>Add New Agent</h1>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2" style={{ marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="name" type="text" required className="search-input" style={{ width: '100%', paddingLeft: '40px' }} placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="email" type="email" required className="search-input" style={{ width: '100%', paddingLeft: '40px' }} placeholder="john@example.com" />
              </div>
            </div>
          </div>

          <div className="form-grid-2" style={{ marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>ID Number</label>
              <div style={{ position: 'relative' }}>
                <IdCard size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="idNumber" type="text" required className="search-input" style={{ width: '100%', paddingLeft: '40px' }} placeholder="ID-12345678" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Designation</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="designation" type="text" className="search-input" style={{ width: '100%', paddingLeft: '40px' }} placeholder="Senior Field Observer" />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', justifyContent: 'center' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <UserPlus size={20} />
                Register Agent & Send Invite
              </>
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
