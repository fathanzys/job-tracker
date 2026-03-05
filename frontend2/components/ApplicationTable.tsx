'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Application } from '@/lib/types';
import StatusBadge from './StatusBadge';
import JobTypeBadge from './JobTypeBadge';
import { deleteApplication } from '@/lib/api';

interface ApplicationTableProps {
    applications: Application[];
}

export default function ApplicationTable({ applications }: ApplicationTableProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'desc' });

    const sortedApplications = [...applications].sort((a, b) => {
        if (!sortConfig) return 0;

        const aValue = a[sortConfig.key as keyof Application];
        const bValue = b[sortConfig.key as keyof Application];

        if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDelete = async (id: number, company: string) => {
        if (!confirm(`Delete application to ${company}?`)) return;
        setDeletingId(id);
        try {
            await deleteApplication(id);
            router.refresh();
        } catch {
            alert('Failed to delete application.');
        } finally {
            setDeletingId(null);
        }
    };

    if (applications.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 mt-4 shadow-sm">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 ring-1 ring-slate-100">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>
                    </div>
                </div>
                <p className="text-slate-600 font-medium text-lg">No applications found.</p>
                <p className="text-slate-500 mt-1 mb-6 text-sm">Start tracking your job hunt today!</p>
                <Link href="/applications/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm shadow-sm">
                    Add your first one
                    <span aria-hidden="true">&rarr;</span>
                </Link>
            </div>
        );
    }

    const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Company', key: 'company_name' },
        { label: 'Program', key: 'program' },
        { label: 'Type', key: 'job_type' },
        { label: 'Referral', key: 'referral' },
        { label: 'Apply Date', key: 'apply_date' },
        { label: 'Status', key: 'status' },
        { label: 'Actions', key: null }
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-4">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                        <tr>
                            {headers.map((h, i) => (
                                <th
                                    key={i}
                                    className={`px-6 py-4 whitespace-nowrap ${h.key ? 'cursor-pointer hover:bg-slate-100 transition-colors select-none' : ''}`}
                                    onClick={() => h.key && requestSort(h.key)}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {h.label}
                                        {h.key && sortConfig?.key === h.key && (
                                            <svg className={`w-3.5 h-3.5 text-blue-500 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                            </svg>
                                        )}
                                        {h.key && sortConfig?.key !== h.key && (
                                            <svg className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                            </svg>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortedApplications.map((app) => (
                            <tr
                                key={app.id}
                                className="hover:bg-slate-50 transition-colors duration-150 ease-in-out group"
                            >
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                    #{app.id}
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-900">
                                    {app.job_url ? (
                                        <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline decoration-blue-200 underline-offset-4 flex items-center gap-1">
                                            {app.company_name}
                                            <span className="text-slate-400 group-hover:text-blue-500 text-[10px] transition-colors">↗</span>
                                        </a>
                                    ) : app.company_name}
                                </td>
                                <td className="px-6 py-4 text-slate-600 max-w-[200px]">
                                    <span title={app.program} className="truncate block">
                                        {app.program}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <JobTypeBadge type={app.job_type} />
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-medium">
                                    {app.referral}
                                </td>
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                    {app.apply_date ? new Date(app.apply_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={app.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Link href={`/applications/${app.id}/edit`} className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-green-50 border border-green-200/60 text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors text-xs font-semibold shadow-sm">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(app.id, app.company_name)}
                                            disabled={deletingId === app.id}
                                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-red-50 border border-red-200/60 text-red-700 hover:bg-red-100 hover:text-red-800 transition-colors text-xs font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {deletingId === app.id ? '...' : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
