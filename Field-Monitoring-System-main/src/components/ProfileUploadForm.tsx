"use client";

import { useState, useRef } from "react";
import { uploadProfileImage } from "@/lib/profile-actions";
import { Camera, Loader2 } from "lucide-react";

export default function ProfileUploadForm() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      await uploadProfileImage(formData);
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        title="Change profile picture"
        style={{ 
          position: 'absolute', 
          bottom: '-10px', 
          right: '-10px', 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%', 
          background: 'white', 
          border: '1px solid var(--border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          cursor: 'pointer',
          color: 'var(--primary)'
        }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={18} />}
      </button>
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />
    </>
  );
}
