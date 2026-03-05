import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const job_type = searchParams.get('job_type');
        const referral = searchParams.get('referral');
        const search = searchParams.get('search');

        let query = 'SELECT * FROM applications WHERE 1=1';
        const params: any[] = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        if (job_type) {
            query += ' AND job_type = ?';
            params.push(job_type);
        }
        if (referral) {
            query += ' AND referral = ?';
            params.push(referral);
        }
        if (search) {
            query += ' AND (company_name LIKE ? OR program LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY id DESC';

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { company_name, program, job_url, job_type, referral, apply_date, status, notes } = body;

        const query = `
            INSERT INTO applications 
            (company_name, program, job_url, job_type, referral, apply_date, status, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            company_name, program, job_url || null, job_type || 'Intern',
            referral || 'Other', apply_date || null, status || 'Submitted', notes || null
        ];

        const [result] = await pool.execute<any>(query, params);
        return NextResponse.json({ id: result.insertId, message: 'Application created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating application:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
