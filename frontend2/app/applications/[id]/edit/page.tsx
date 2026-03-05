import { getApplicationByIdFromDB } from '@/lib/queries';
import ApplicationForm from '@/components/ApplicationForm';
import { ApplicationFormData } from '@/lib/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditApplicationPage({ params }: PageProps) {
    const { id } = await params;
    const numId = parseInt(id, 10);

    let app;
    try {
        app = await getApplicationByIdFromDB(numId);
        if (!app) notFound();
    } catch {
        notFound();
    }
    if (!app) notFound();

    const initialData: ApplicationFormData = {
        company_name: app.company_name,
        program: app.program,
        job_url: app.job_url ?? '',
        job_type: app.job_type,
        referral: app.referral,
        apply_date: app.apply_date ? app.apply_date.split('T')[0] : '',
        status: app.status,
        notes: app.notes ?? '',
    };

    return (
        <div>
            <div style={{ marginBottom: '1.75rem' }}>
                <Link href="/applications" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.75rem', display: 'inline-block' }}>
                    ← Back to Applications
                </Link>
                <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Edit Application
                </h1>
                <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {app.company_name} — {app.program}
                </p>
            </div>

            <div style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: 800,
            }}>
                <ApplicationForm initialData={initialData} editId={numId} />
            </div>
        </div>
    );
}
