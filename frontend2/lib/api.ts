import { Application, ApplicationFormData, Stats } from './types';

const BASE_URL = '/api';

export interface GetApplicationsParams {
    status?: string;
    job_type?: string;
    referral?: string;
    search?: string;
}

export async function getApplications(params: GetApplicationsParams = {}): Promise<Application[]> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.job_type) query.set('job_type', params.job_type);
    if (params.referral) query.set('referral', params.referral);
    if (params.search) query.set('search', params.search);

    const res = await fetch(`${BASE_URL}/applications?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
}

export async function getApplicationById(id: number): Promise<Application> {
    const res = await fetch(`${BASE_URL}/applications/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch application');
    return res.json();
}

export async function createApplication(data: ApplicationFormData): Promise<{ id: number; message: string }> {
    const res = await fetch(`${BASE_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create application');
    return res.json();
}

export async function updateApplication(id: number, data: ApplicationFormData): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update application');
    return res.json();
}

export async function deleteApplication(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/applications/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete application');
}

export async function getStats(): Promise<Stats> {
    const res = await fetch(`${BASE_URL}/stats`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
}
