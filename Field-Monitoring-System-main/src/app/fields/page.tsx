import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateFieldStatus } from "@/lib/status";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  ChevronRight,
  MapPin,
  Calendar
} from "lucide-react";
import Link from "next/link";

import FieldSearch from "@/components/FieldSearch";

export default async function FieldsPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const { query = "" } = await searchParams;

  const fields = await prisma.field.findMany({
    where: {
      AND: [
        user.role === "ADMIN" ? {} : { 
          OR: [
            { supervisorId: user.id },
            { assistantId: user.id }
          ]
        },
        query ? {
          OR: [
            { name: { contains: query } },
            { cropType: { contains: query } }
          ]
        } : {}
      ]
    },
    include: {
      updates: {
        orderBy: { createdAt: "desc" },
      },
      supervisor: true,
      assistant: true
    },
  });

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>All Fields</h1>
          <p style={{ color: 'var(--text-muted)' }}>Monitor and manage agricultural progress across all locations.</p>
        </div>

        <div className="page-actions">
          <FieldSearch />
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap table-fields">
        <table>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Field Info</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Crop & Stage</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Personnel</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}></th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => {
              const status = calculateFieldStatus(field as any);
              return (
                <tr key={field.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--primary-soft)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <Link href={`/fields/${field.id}`} style={{ fontWeight: 600, display: 'block' }}>{field.name}</Link>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Planted: {new Date(field.plantingDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <p style={{ fontWeight: 500 }}>{field.cropType}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{field.stage}</p>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <span className={`badge badge-${status.toLowerCase().replace(' ', '-')}`}>
                      {status}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', width: '25px' }}>SV</span>
                           <span style={{ fontSize: '0.875rem' }}>{field.supervisor?.name || 'Unassigned'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', width: '25px' }}>AS</span>
                           <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{field.assistant?.name || 'No assistant'}</span>
                        </div>
                     </div>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                    <Link href={`/fields/${field.id}`} className="btn" style={{ padding: '0.5rem', background: 'none' }}>
                      <ChevronRight size={20} color="var(--text-muted)" />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {fields.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No fields found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
