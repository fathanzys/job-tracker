import { getApplications } from '@/lib/api';
import { Application } from '@/lib/types';
import ApplicationTable from '@/components/ApplicationTable';
import FilterBar from '@/components/FilterBar';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ status?: string; job_type?: string; referral?: string; search?: string }>;
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    let applications: Application[] = [];

    try {
        applications = await getApplications({
            status: params.status,
            job_type: params.job_type,
            referral: params.referral,
            search: params.search,
        });
    } catch {
        applications = [];
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Applications
                    </h1>
                    <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {applications.length} record{applications.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <Link href="/applications/new" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                }}>
                    + Add New
                </Link>
            </div>

            {/* Filters */}
            <div style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem',
            }}>
                <Suspense fallback={null}>
                    <FilterBar />
                </Suspense>
            </div>

            {/* Table */}
            <div style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
            }}>
                <ApplicationTable applications={applications} />
            </div>
        </div>
    );
}
