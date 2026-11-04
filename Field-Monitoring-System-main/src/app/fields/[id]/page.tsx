import { prisma } from "@/lib/prisma";
import { calculateFieldStatus } from "@/lib/status";
import DashboardLayout from "@/components/DashboardLayout";
import FieldUpdateForm from "@/components/FieldUpdateForm";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User as UserIcon,
  Timer,
  History,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteField } from "@/lib/actions";
import FieldAssignmentController from "@/components/FieldAssignmentController";

export default async function FieldDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const field = await prisma.field.findUnique({
    where: { id },
    include: {
      updates: {
        orderBy: { createdAt: "desc" },
        include: { author: true }
      },
      supervisor: true,
      assistant: true
    },
  });

  if (!field) notFound();

  // Enforce isolation for Agents
  if (user.role === "AGENT") {
    if (field.supervisorId !== user.id && field.assistantId !== user.id) {
      redirect("/dashboard");
    }
  }

  const status = calculateFieldStatus(field as any);

  // Fetch agents for administration
  const agents = user.role === "ADMIN" 
    ? await prisma.user.findMany({ where: { role: "AGENT", status: "ACTIVE" } })
    : [];

  const isAssigned = !!field.supervisorId;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/fields" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} />
          Back to Fields
        </Link>
        <div className="page-header">
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{field.name}</h1>
            <div className="page-actions" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> Central Region, Zone A</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> Planted: {new Date(field.plantingDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="page-actions">
            {user.role === "ADMIN" && (
              <form action={async () => {
                "use server";
                await deleteField(id);
                redirect("/fields");
              }}>
                <button type="submit" className="btn" style={{ background: 'none', border: '1px solid #fee2e2', color: '#b91c1c' }}>
                  <Trash2 size={18} />
                  Delete Field
                </button>
              </form>
            )}
            <span className={`badge badge-${status.toLowerCase().replace(' ', '-')}`} style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
              Progress: {status}
            </span>
            <span className={`badge`} style={{ 
              padding: '0.5rem 1.25rem', 
              fontSize: '0.875rem', 
              background: isAssigned ? '#dcfce7' : '#fffbeb',
              color: isAssigned ? '#166534' : '#92400e',
              border: isAssigned ? '1px solid #bbf7d0' : '1px solid #fef3c7'
            }}>
              {isAssigned ? "Assigned" : "Unassigned (Pending)"}
            </span>
          </div>
        </div>
      </div>

      <div className="split-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Assignment Section (Admin Only) */}
          {user.role === "ADMIN" && (
            <FieldAssignmentController 
              fieldId={id} 
              supervisor={field.supervisor as any}
              assistant={field.assistant as any}
              availableAgents={agents as any}
            />
          )}

          {/* Field Details Card */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Timer size={22} color="var(--primary)" />
              Monitoring Oversight
            </h3>
            <div className="info-grid">
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Crop / Stage</p>
                <p style={{ fontWeight: 600, fontSize: '1rem' }}>{field.cropType} - {field.stage}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Assigned Agent</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <UserIcon size={12} color="var(--primary)" />
                   </div>
                   <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{field.supervisor?.name || 'Unassigned'}</p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Extra Agent (Assistant)</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <UserIcon size={12} color="var(--text-muted)" />
                   </div>
                   <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{field.assistant?.name || 'None'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <History size={22} color="var(--primary)" />
              Activity History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {field.updates.map((update, idx) => (
                <div key={update.id} style={{ display: 'flex', gap: '2rem', position: 'relative', paddingBottom: '2rem' }}>
                  {idx !== field.updates.length - 1 && (
                    <div style={{ position: 'absolute', left: '19px', top: '24px', bottom: 0, width: '2px', background: 'var(--border)' }} />
                  )}
                  <div style={{ 
                    zIndex: 1,
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: 'white', 
                    border: '2px solid var(--primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <p style={{ fontWeight: 700 }}>{update.stageAtUpdate}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(update.createdAt).toLocaleString()}</span>
                    </div>
                    <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: '1.5' }}>{update.note}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {update.author.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Update Form (Only for Agent or Admin) */}
          <FieldUpdateForm fieldId={field.id} currentStage={field.stage} />
        </div>
      </div>
    </DashboardLayout>
  );
}
