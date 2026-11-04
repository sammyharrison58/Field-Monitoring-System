"use client";

export default function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string, text: string }> = {
    ACTIVE: { bg: '#dcfce7', text: '#166534' },
    SUSPENDED: { bg: '#fee2e2', text: '#991b1b' },
    PENDING: { bg: '#fef9c3', text: '#854d0e' }
  };

  const { bg, text } = styles[status] || styles.PENDING;

  return (
    <div style={{ 
      display: 'inline-flex', 
      padding: '0.25rem 0.75rem', 
      borderRadius: '99px', 
      fontSize: '0.75rem', 
      fontWeight: 600,
      background: bg,
      color: text
    }}>
      {status}
    </div>
  );
}
