import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const { id } = params;
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM applications WHERE id = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Error fetching application:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const { id } = params;
        const body = await request.json();
        const { company_name, program, job_url, job_type, referral, apply_date, status, notes } = body;

        const query = `
            UPDATE applications 
            SET company_name = ?, program = ?, job_url = ?, job_type = ?, 
                referral = ?, apply_date = ?, status = ?, notes = ?
            WHERE id = ?
        `;
        const queryParams = [
            company_name, program, job_url || null, job_type,
            referral, apply_date || null, status, notes || null, id
        ];

        const [result] = await pool.execute<any>(query, queryParams);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Application updated successfully' });
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const { id } = params;
        const [result] = await pool.execute<any>('DELETE FROM applications WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
