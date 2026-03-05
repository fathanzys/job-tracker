import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const [statusRows] = await pool.execute<RowDataPacket[]>('SELECT status, COUNT(*) as count FROM applications GROUP BY status');
        const [jobTypeRows] = await pool.execute<RowDataPacket[]>('SELECT job_type, COUNT(*) as count FROM applications GROUP BY job_type');
        const [referralRows] = await pool.execute<RowDataPacket[]>('SELECT referral, COUNT(*) as count FROM applications GROUP BY referral');
        const [totalRows] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM applications');

        const total = totalRows[0].total;

        // Calculate summary statistics
        let onProcess = 0;
        let rejected = 0;
        let offering = 0;
        let waiting = 0;

        for (const row of statusRows) {
            const count = Number(row.count);
            switch (row.status) {
                case 'Rejected':
                case 'Not Proceed':
                    rejected += count;
                    break;
                case 'Offering':
                    offering += count;
                    break;
                case 'Waiting':
                case 'Submitted':
                    waiting += count;
                    break;
                default:
                    // 'Emailed Back', 'Assessment', 'HR - Interview', 'User - Interview', 'LGD', 'Presentation'
                    onProcess += count;
                    break;
            }
        }

        return NextResponse.json({
            byStatus: statusRows,
            byJobType: jobTypeRows,
            byReferral: referralRows,
            summary: {
                total,
                onProcess,
                rejected,
                offering,
                waiting
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
