"use client";

import { useState } from "react";
import { submitFieldUpdate } from "@/lib/actions";
import { Loader2, Send } from "lucide-react";

export default function FieldUpdateForm({ fieldId, currentStage }: { fieldId: string, currentStage: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await submitFieldUpdate(formData);
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  }

  const stages = ["PLANTED", "GROWING", "READY", "HARVESTED"];

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem' }}>Submit Update</h3>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="fieldId" value={fieldId} />
        
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Update Stage</label>
          <select name="stage" defaultValue={currentStage} className="search-input" style={{ width: '100%' }}>
            {stages.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Notes & Observations</label>
          <textarea 
            name="note" 
            required 
            rows={4} 
            className="search-input" 
            style={{ width: '100%', resize: 'none', height: 'auto' }}
            placeholder="Describe the current condition of the crop..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary" 
          style={{ width: '100%' }}
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : (
            <>
              <Send size={18} />
              Submit Observations
            </>
          )}
        </button>
      </form>
    </div>
  );
}
