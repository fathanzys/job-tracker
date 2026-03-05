import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { Application, Stats } from '@/lib/types';

export interface GetApplicationsParams {
    status?: string;
    job_type?: string;
    referral?: string;
    search?: string;
}

export async function getApplicationsFromDB(params: GetApplicationsParams = {}): Promise<Application[]> {
    let query = 'SELECT * FROM applications WHERE 1=1';
    const queryParams: any[] = [];

    if (params.status) { query += ' AND status = ?'; queryParams.push(params.status); }
    if (params.job_type) { query += ' AND job_type = ?'; queryParams.push(params.job_type); }
    if (params.referral) { query += ' AND referral = ?'; queryParams.push(params.referral); }
    if (params.search) {
        query += ' AND (company_name LIKE ? OR program LIKE ?)';
        queryParams.push(`%${params.search}%`, `%${params.search}%`);
    }

    query += ' ORDER BY id DESC';
    const [rows] = await pool.execute<RowDataPacket[]>(query, queryParams);
    return rows as Application[];
}

export async function getApplicationByIdFromDB(id: number): Promise<Application | null> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM applications WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] as Application : null;
}

export async function getStatsFromDB(): Promise<Stats> {
    const [statusRows] = await pool.execute<RowDataPacket[]>('SELECT status, COUNT(*) as count FROM applications GROUP BY status');
    const [jobTypeRows] = await pool.execute<RowDataPacket[]>('SELECT job_type, COUNT(*) as count FROM applications GROUP BY job_type');
    const [referralRows] = await pool.execute<RowDataPacket[]>('SELECT referral, COUNT(*) as count FROM applications GROUP BY referral');
    const [totalRows] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM applications');

    const total = totalRows[0].total;
    let onProcess = 0, rejected = 0, offering = 0, waiting = 0;

    for (const row of statusRows) {
        const count = Number(row.count);
        switch (row.status) {
            case 'Rejected': case 'Not Proceed': rejected += count; break;
            case 'Offering': offering += count; break;
            case 'Waiting': case 'Submitted': waiting += count; break;
            default: onProcess += count; break;
        }
    }

    return {
        byStatus: statusRows as any,
        byJobType: jobTypeRows as any,
        byReferral: referralRows as any,
        summary: { total, onProcess, rejected, offering, waiting }
    };
}
