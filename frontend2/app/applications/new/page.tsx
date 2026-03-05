import ApplicationForm from '@/components/ApplicationForm';
import Link from 'next/link';

export default function NewApplicationPage() {
    return (
        <div>
            <div style={{ marginBottom: '1.75rem' }}>
                <Link href="/applications" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.75rem', display: 'inline-block' }}>
                    ← Back to Applications
                </Link>
                <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Add New Application
                </h1>
                <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Record a new job application.
                </p>
            </div>

            <div style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: 800,
            }}>
                <ApplicationForm />
            </div>
        </div>
    );
}
