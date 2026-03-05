'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApplicationFormData, JOB_TYPES, REFERRALS, STATUSES } from '@/lib/types';
import { createApplication, updateApplication } from '@/lib/api';

interface ApplicationFormProps {
    initialData?: ApplicationFormData;
    editId?: number;
}

const defaultData: ApplicationFormData = {
    company_name: '',
    program: '',
    job_url: '',
    job_type: 'Intern',
    referral: 'Other',
    apply_date: '',
    status: 'Submitted',
    notes: '',
};

export default function ApplicationForm({ initialData, editId }: ApplicationFormProps) {
    const router = useRouter();
    const [form, setForm] = useState<ApplicationFormData>(initialData ?? defaultData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (editId) {
                await updateApplication(editId, form);
            } else {
                await createApplication(form);
            }
            router.push('/applications');
            router.refresh();
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fieldClassName = "w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm";
    const labelClassName = "block text-slate-700 text-sm font-semibold mb-1.5";

    const field = (label: string, name: keyof ApplicationFormData, type = 'text', placeholder = '') => (
        <div>
            <label className={labelClassName}>{label}</label>
            <input
                type={type}
                name={name}
                value={form[name] as string ?? ''}
                onChange={handleChange}
                placeholder={placeholder}
                className={fieldClassName}
            />
        </div>
    );

    const selectField = (label: string, name: keyof ApplicationFormData, options: string[]) => (
        <div>
            <label className={labelClassName}>{label}</label>
            <select
                name={name}
                value={form[name] as string}
                onChange={handleChange}
                className={fieldClassName}
            >
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {field('Company Name *', 'company_name', 'text', 'e.g. Google')}
                {field('Program / Position *', 'program', 'text', 'e.g. Software Engineer Intern')}
                {field('Job URL', 'job_url', 'url', 'https://...')}
                {field('Apply Date', 'apply_date', 'date')}
                {selectField('Job Type', 'job_type', JOB_TYPES)}
                {selectField('Referral Source', 'referral', REFERRALS)}
                {selectField('Status', 'status', STATUSES)}

                <div className="md:col-span-2">
                    <label className={labelClassName}>Notes</label>
                    <textarea
                        name="notes"
                        value={form.notes ?? ''}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Any additional notes..."
                        className={`${fieldClassName} resize-y`}
                    />
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium flex items-start gap-2.5">
                    <span className="text-red-500 mt-0.5 shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </span>
                    <p>{error}</p>
                </div>
            )}

            <div className="mt-8 flex gap-3 justify-end pt-6 border-t border-slate-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg border border-transparent bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : editId ? 'Update Application' : 'Add Application'}
                </button>
            </div>
        </form>
    );
}
