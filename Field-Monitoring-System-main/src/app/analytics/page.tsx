import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  BarChart, 
  PieChart, 
  TrendingUp, 
  Users, 
  Sprout,
  Activity,
  ArrowUpRight,
  Target
} from "lucide-react";
import { calculateFieldStatus } from "@/lib/status";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any).role !== "ADMIN") return null;

  const fields = await prisma.field.findMany({
    include: { updates: true, supervisor: true, assistant: true }
  });

  const agents = await prisma.user.findMany({
    where: { role: "AGENT" },
    include: { supervisorFields: true, assistantFields: true }
  });

  // Calculate Aggregates
  const stats = fields.reduce((acc, field) => {
    const status = calculateFieldStatus(field as any);
    acc.status[status] = (acc.status[status] || 0) + 1;
    acc.crops[field.cropType] = (acc.crops[field.cropType] || 0) + 1;
    return acc;
  }, { 
    status: {} as Record<string, number>, 
    crops: {} as Record<string, number> 
  });

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Platform Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Operational intelligence and workforce performance metrics.</p>
      </div>

      {/* Top Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
             <div style={{ padding: '0.75rem', background: 'var(--primary-soft)', borderRadius: '12px', color: 'var(--primary)' }}>
               <Target size={24} />
             </div>
             <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
               <TrendingUp size={14} style={{ marginRight: '4px' }} />
               Active
             </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Overall Efficiency</p>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>84.2%</h3>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
             <div style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '12px', color: '#d97706' }}>
               <Users size={24} />
             </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Agents</p>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>{agents.length}</h3>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
             <div style={{ padding: '0.75rem', background: '#e0f2fe', borderRadius: '12px', color: '#0284c7' }}>
               <Activity size={24} />
             </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Monthly Updates</p>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>342</h3>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Status Distribution */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PieChart size={20} color="var(--primary)" />
            Field Status Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             {Object.entries(stats.status).map(([label, count]) => (
               <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 500 }}>{label}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} Fields</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${(count / fields.length) * 100}%`, 
                      background: label === 'Active' ? 'var(--primary)' : label === 'At Risk' ? '#ef4444' : '#f59e0b' 
                    }} />
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Crop Diversification */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sprout size={20} color="var(--primary)" />
            Crop Diversification
          </h3>
          <div className="form-grid-2" style={{ gap: '1rem' }}>
             {Object.entries(stats.crops).map(([crop, count]) => (
               <div key={crop} style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{crop}</p>
                 <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{count}</p>
               </div>
             ))}
          </div>
        </div>

        {/* Agent Workload */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
           <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BarChart size={20} color="var(--primary)" />
            Workload Distribution by Agent
          </h3>
          <div className="table-wrap table-analytics">
            <table>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem 0', fontSize: '0.875rem' }}>Agent</th>
                  <th style={{ padding: '1rem 0', fontSize: '0.875rem' }}>Assigned Agent (Primary)</th>
                  <th style={{ padding: '1rem 0', fontSize: '0.875rem' }}>Extra Agent (Assistant)</th>
                  <th style={{ padding: '1rem 0', fontSize: '0.875rem' }}>Capacity</th>
                </tr>
              </thead>
              <tbody>
                {agents.map(agent => (
                  <tr key={agent.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 600 }}>{agent.name}</td>
                    <td style={{ padding: '1rem 0' }}>{agent.supervisorFields.length} fields</td>
                    <td style={{ padding: '1rem 0' }}>{agent.assistantFields.length} fields</td>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ width: '100px', height: '6px', background: 'var(--bg-main)', borderRadius: '3px' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${Math.min((agent.supervisorFields.length + agent.assistantFields.length) * 10, 100)}%`,
                          background: 'var(--primary)',
                          borderRadius: '3px'
                        }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
