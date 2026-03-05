import { getStats, getApplications } from '@/lib/api';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import JobTypeBadge from '@/components/JobTypeBadge';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let stats;
  let recentApps;

  try {
    [stats, recentApps] = await Promise.all([
      getStats(),
      getApplications(),
    ]);
  } catch {
    return (
      <div className="text-center py-20 px-4">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 ring-1 ring-red-100 shadow-sm">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <p className="text-slate-600 font-medium text-lg mb-4">Could not connect to backend. Make sure it is running on port <strong className="text-slate-900">3001</strong>.</p>
        <code className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md text-sm ring-1 ring-blue-100">cd backend && npm run dev</code>
      </div>
    );
  }

  const { summary, byStatus, byJobType } = stats;
  const recent = recentApps.slice(0, 8);

  const statCards = [
    { label: 'Total Applied', value: summary.total, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, color: '#3b82f6', gradient: '' },
    { label: 'In Progress', value: summary.onProcess, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>, color: '#0ea5e9', gradient: '' },
    { label: 'Offerings', value: summary.offering, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: '#10b981', gradient: '' },
    { label: 'Rejected', value: summary.rejected, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: '#ef4444', gradient: '' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 m-0">
          Dashboard
        </h1>
        <p className="mt-1.5 text-slate-500 text-sm">
          Your job application overview — updated in real time.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts byStatus={byStatus} byJobType={byJobType} />

      {/* Recent Applications */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-slate-900 m-0">
            Recent Applications
          </h2>
          <Link href="/applications" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
            View all &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                {['ID', 'Company', 'Program', 'Type', 'Status'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((app: any) => (
                <tr key={app.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-xs">#{app.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {app.job_url ? (
                      <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline decoration-blue-200 underline-offset-4 flex items-center gap-1 group">
                        {app.company_name}
                        <span className="text-slate-400 group-hover:text-blue-500 text-[10px] transition-colors">↗</span>
                      </a>
                    ) : app.company_name}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">{app.program}</td>
                  <td className="py-3 px-4"><JobTypeBadge type={app.job_type} /></td>
                  <td className="py-3 px-4"><StatusBadge status={app.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
