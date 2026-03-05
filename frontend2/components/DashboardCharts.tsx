'use client';

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';

const CHART_COLORS = ['#4f8ef7', '#8b5cf6', '#14b8a6', '#f97316', '#22c55e', '#ef4444', '#eab308', '#94a3b8'];

export default function DashboardCharts({ byStatus, byJobType }: { byStatus: any[], byJobType: any[] }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-6">
            {/* Status bar chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-6 font-inter">
                    Applications by Status
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={byStatus} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="status" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'Inter' }}
                            itemStyle={{ color: '#3b82f6', fontWeight: 600 }}
                            cursor={{ fill: '#f1f5f9' }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Job type pie chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-6 font-inter">
                    Applications by Type
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Pie data={byJobType} dataKey="count" nameKey="job_type" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}>
                            {byJobType.map((_, i) => (
                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'Inter' }}
                        />
                        <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-slate-600 text-sm font-medium">{String(value)}</span>} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
