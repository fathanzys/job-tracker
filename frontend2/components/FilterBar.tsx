'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { STATUSES, JOB_TYPES, REFERRALS } from '@/lib/types';

export default function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const [search, setSearch] = useState(searchParams.get('search') ?? '');

    const update = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) params.set(key, value);
            else params.delete(key);
            startTransition(() => {
                router.push(`/applications?${params.toString()}`);
            });
        },
        [router, searchParams]
    );

    const inputClassName = "px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm appearance-none";

    return (
        <div className="flex gap-3 flex-wrap items-center mt-6 mb-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Search company or program..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        update('search', e.target.value);
                    }}
                    className={`${inputClassName} pl-10 w-full`}
                />
            </div>

            {/* Status filter */}
            <select
                defaultValue={searchParams.get('status') ?? ''}
                onChange={e => update('status', e.target.value)}
                className={`${inputClassName} pr-8 cursor-pointer`}
            >
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Job type filter */}
            <select
                defaultValue={searchParams.get('job_type') ?? ''}
                onChange={e => update('job_type', e.target.value)}
                className={`${inputClassName} pr-8 cursor-pointer`}
            >
                <option value="">All Types</option>
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* Referral filter */}
            <select
                defaultValue={searchParams.get('referral') ?? ''}
                onChange={e => update('referral', e.target.value)}
                className={`${inputClassName} pr-8 cursor-pointer`}
            >
                <option value="">All Sources</option>
                {REFERRALS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            {/* Clear */}
            {(searchParams.toString()) && (
                <button
                    onClick={() => {
                        setSearch('');
                        router.push('/applications');
                    }}
                    className="px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 font-medium text-sm hover:bg-blue-100 transition-colors shadow-sm cursor-pointer"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
}
