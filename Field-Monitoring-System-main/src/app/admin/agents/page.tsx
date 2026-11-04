import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/DashboardLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  Trash2, 
  UserX, 
  UserCheck, 
  Send,
  Mail,
  IdCard,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge"; // I'll create this helper
import AgentRowActions from "@/components/AgentRowActions"; // I'll create this client component

export default async function AdminAgentsPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const agents = await prisma.user.findMany({
    where: { role: "AGENT" },
    include: {
      _count: {
        select: { 
          supervisorFields: true,
          assistantFields: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Field Agents</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your workforce, monitor their workload, and control system access.</p>
        </div>
        
        <Link href="/admin/agents/new" className="btn btn-primary">
          <UserPlus size={20} />
          Add New Agent
        </Link>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap table-agents">
        <table>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Agent Profile</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Details</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Workload</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}></th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)', fontSize: '1.25rem' }}>
                      {agent.name?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700 }}>{agent.name}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={14} /> {agent.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <p style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IdCard size={14} color="var(--text-muted)" />
                      {agent.idNumber || 'No ID set'}
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Briefcase size={14} />
                      {agent.designation || 'Field Agent'}
                    </p>
                  </div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-main)', borderRadius: '8px', display: 'inline-flex', gap: '1rem', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '1.125rem' }}>{agent._count.supervisorFields}</p>
                      <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Supervisor</p>
                    </div>
                    <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '1.125rem' }}>{agent._count.assistantFields}</p>
                      <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assistant</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                   <StatusBadge status={agent.status} />
                </td>
                <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                  <AgentRowActions agentId={agent.id} status={agent.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
