import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  User as UserIcon, 
  Camera, 
  Mail, 
  BadgeCheck, 
  IdCard,
  Briefcase
} from "lucide-react";
import ProfileUploadForm from "@/components/ProfileUploadForm";
import { updateProfileDetails } from "@/lib/profile-actions";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: (session?.user as any).id }
  });

  if (!user) return null;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem' }}>My Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and profile picture.</p>
      </div>

      <div className="profile-grid">
        {/* Left: Avatar & ID */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card text-center" style={{ padding: '2.5rem' }}>
             <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                 <div style={{ 
                   width: '100%', 
                   height: '100%', 
                   borderRadius: '24px', 
                   overflow: 'hidden', 
                   background: 'var(--primary-soft)', 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center',
                   border: '2px solid var(--primary)'
                 }}>
                   {user.image ? (
                     <img src={user.image} alt={user.name || "Profile"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   ) : (
                     <UserIcon size={48} color="var(--primary)" />
                   )}
                 </div>
                 <ProfileUploadForm />
             </div>
             <h2 style={{ marginBottom: '0.25rem' }}>{user.name}</h2>
             <span className="badge badge-active" style={{ marginBottom: '1.5rem' }}>{user.role}</span>
             
             <div style={{ textAlign: 'left', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <Mail size={16} color="var(--text-muted)" />
                  <span>{user.email}</span>
                </div>
                {user.designation && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <Briefcase size={16} color="var(--text-muted)" />
                    <span>{user.designation}</span>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right: Details Form */}
        <div className="card">
           <h3 style={{ marginBottom: '1.5rem' }}>Account Details</h3>
           <form action={updateProfileDetails}>
             <div className="form-grid-2" style={{ marginBottom: '1.5rem' }}>
               <div>
                 <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
                 <input 
                   name="name" 
                   type="text" 
                   defaultValue={user.name || ''} 
                   className="search-input" 
                   style={{ width: '100%' }} 
                 />
               </div>
               <div>
                 <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>ID Number</label>
                 <input 
                   name="idNumber" 
                   type="text" 
                   defaultValue={user.idNumber || ''} 
                   className="search-input" 
                   style={{ width: '100%' }} 
                 />
               </div>
             </div>

             <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  <BadgeCheck size={20} />
                  <p style={{ fontWeight: 600 }}>System Privileges</p>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Your account is verified as an active <strong>{user.role}</strong>. 
                  {user.status === 'ACTIVE' ? ' All monitoring features are available.' : ' Your account access is restricted.'}
                </p>
             </div>

             <button type="submit" className="btn btn-primary">
               Save Changes
             </button>
           </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
