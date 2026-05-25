const toneMap = {
  Open: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  'In Progress': 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  Resolved: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
  Closed: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  High: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
  Medium: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200',
  Low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
};

export default function TicketBadge({ value }) {
  return <span className={`badge ${toneMap[value] || toneMap.Closed}`}>{value}</span>;
}
