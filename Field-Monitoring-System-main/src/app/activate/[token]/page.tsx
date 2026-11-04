"use client";

import { useState } from "react";
import { activateAgent } from "@/lib/actions";
import { useRouter, useParams } from "next/navigation";
import { Leaf, Lock, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ActivatePage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("token", token as string);
      formData.append("password", password);

      const res = await activateAgent(formData);
      if (res.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to activate account. The link may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '1rem' }}>
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '440px', textAlign: 'center', padding: '3rem' }}>
          <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#166534', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={32} />
          </div>
          <h1 style={{ marginBottom: '1rem' }}>Account Activated!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your password has been set successfully. You can now log in to the platform.</p>
          <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '1rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white' }}>
            <Leaf size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>Activate Your Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Set your new password to get started.</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', gap: '0.75rem', border: '1px solid #fee2e2' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                required 
                className="search-input" 
                style={{ width: '100%', paddingLeft: '40px' }}
                placeholder="at least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                required 
                className="search-input" 
                style={{ width: '100%', paddingLeft: '40px' }}
                placeholder="repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.875rem' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Set Password & Activate"}
          </button>
        </form>
      </div>
    </div>
  );
}
