import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateFieldStatus } from "@/lib/status";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (
    !user ||
    !("role" in user) ||
    typeof user.role !== "string" ||
    !("id" in user) ||
    typeof user.id !== "string"
  ) {
    redirect("/login");
  }

  const assignedFieldWhere = {
    OR: [{ supervisorId: user.id }, { assistantId: user.id }],
  };

  // Fetch fields based on role
  const fields = await prisma.field.findMany({
    where: user.role === "ADMIN" ? {} : assignedFieldWhere,
    include: {
      updates: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Calculate stats
  const stats = fields.reduce(
    (acc, field) => {
      const status = calculateFieldStatus(field);
      acc[status]++;
      return acc;
    },
    { total: fields.length, Active: 0, "At Risk": 0, Completed: 0 }
  );

  const recentUpdates = await prisma.fieldUpdate.findMany({
    where:
      user.role === "ADMIN"
        ? {}
        : { field: { is: assignedFieldWhere } },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { field: true },
  });

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Welcome, {user.name ?? "there"}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here&apos;s what&apos;s happening with your fields today.</p>
        </div>
        
        {user.role === "ADMIN" && (
          <Link href="/fields/new" className="btn btn-primary">
            <Plus size={20} />
            Add New Field
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'var(--primary-soft)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Fields</p>
            <h3 style={{ fontSize: '1.5rem' }}>{stats.total}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#dcfce7', borderRadius: '12px', color: '#166534' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Fields</p>
            <h3 style={{ fontSize: '1.5rem' }}>{stats.Active}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '12px', color: '#991b1b' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>At Risk</p>
            <h3 style={{ fontSize: '1.5rem' }}>{stats["At Risk"]}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '12px', color: '#854d0e' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Completed</p>
            <h3 style={{ fontSize: '1.5rem' }}>{stats.Completed}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Fields List */}
        <div className="card">
          <div className="page-header" style={{ marginBottom: '1.5rem' }}>
            <h3>Your Managed Fields</h3>
            <Link href="/fields" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 500 }}>View All</Link>
          </div>
          
          <div className="table-wrap table-dashboard">
            <table>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Field Name</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Crop</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Stage</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {fields.slice(0, 5).map((field) => {
                  const status = calculateFieldStatus(field);
                  return (
                    <tr key={field.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 0' }}>
                        <Link href={`/fields/${field.id}`} style={{ fontWeight: 600 }}>{field.name}</Link>
                      </td>
                      <td style={{ padding: '1rem 0' }}>{field.cropType}</td>
                      <td style={{ padding: '1rem 0' }}>{field.stage}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <span className={`badge badge-${status.toLowerCase().replace(' ', '-')}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {fields.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No fields are assigned to you yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="card">
           <h3 style={{ marginBottom: '1.5rem' }}>Recent Updates</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             {recentUpdates.map((update) => (
               <div key={update.id} style={{ display: 'flex', gap: '1rem' }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }} />
                 <div>
                   <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{update.field.name}</p>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{update.note}</p>
                   <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(update.createdAt).toLocaleDateString()}</p>
                 </div>
               </div>
             ))}
             {recentUpdates.length === 0 && (
               <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                 No recent updates.
               </p>
             )}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
