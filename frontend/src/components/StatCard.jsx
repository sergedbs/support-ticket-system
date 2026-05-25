export default function StatCard({ label, value, tone = 'default' }) {
  const tones = {
    default: 'border-slate-200 dark:border-slate-800',
    high: 'border-danger/40 bg-red-50 dark:bg-red-950/30',
    active: 'border-brand/40 bg-blue-50 dark:bg-blue-950/30',
    done: 'border-success/40 bg-green-50 dark:bg-green-950/30',
  };

  return (
    <div className={`rounded-lg border p-4 ${tones[tone]}`}>
      <p className="muted text-sm">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
