"use client";

import { useState } from "react";
import { createField } from "@/lib/actions";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  ArrowLeft, 
  Sprout, 
  Tag, 
  Calendar,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function NewFieldPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
       const res = await createField(formData);
       if (res.success) {
         setSuccess(true);
         setTimeout(() => router.push(`/fields/${res.id}`), 1500);
       }
    } catch (err) {
       alert("Failed to create field. Please check your data and try again.");
    } finally {
       setLoading(false);
    }
  }

  if (success) {
    return (
      <DashboardLayout>
        <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card text-center" style={{ padding: '3rem', maxWidth: '400px' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>Field Created!</h2>
            <p style={{ color: 'var(--text-muted)' }}>The field has been successfully registered. Redirecting to details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2rem' }}>Register New Field</h1>
        <p style={{ color: 'var(--text-muted)' }}>Add a new area of cultivation to the monitoring system.</p>
      </div>

      <div style={{ maxWidth: '600px' }}>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Field Name</label>
              <div style={{ position: 'relative' }}>
                <Sprout size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  name="name" 
                  type="text" 
                  required 
                  className="search-input" 
                  style={{ width: '100%', paddingLeft: '40px' }} 
                  placeholder="e.g. North Valey Maize Field" 
                />
              </div>
            </div>

            <div className="form-grid-2" style={{ marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Crop Type</label>
                <div style={{ position: 'relative' }}>
                  <Tag size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    name="cropType" 
                    type="text" 
                    required 
                    className="search-input" 
                    style={{ width: '100%', paddingLeft: '40px' }} 
                    placeholder="e.g. White Maize" 
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Planting Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    name="plantingDate" 
                    type="date" 
                    required 
                    className="search-input" 
                    style={{ width: '100%', paddingLeft: '40px' }} 
                  />
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
                  <Plus size={20} />
                  Create Registration
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  );
}
