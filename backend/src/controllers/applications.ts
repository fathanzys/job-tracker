import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, job_type, referral, search } = req.query;
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
        res.json(rows);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM applications WHERE id = ?', [id]);

        if (rows.length === 0) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        const { company_name, program, job_url, job_type, referral, apply_date, status, notes } = req.body;

        const query = `
      INSERT INTO applications 
      (company_name, program, job_url, job_type, referral, apply_date, status, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const params = [
            company_name, program, job_url || null, job_type || 'Intern',
            referral || 'Other', apply_date || null, status || 'Submitted', notes || null
        ];

        const [result] = await pool.execute<ResultSetHeader>(query, params);

        res.status(201).json({ id: result.insertId, message: 'Application created successfully' });
    } catch (error) {
        console.error('Error creating application:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { company_name, program, job_url, job_type, referral, apply_date, status, notes } = req.body;

        const query = `
      UPDATE applications 
      SET company_name = ?, program = ?, job_url = ?, job_type = ?, 
          referral = ?, apply_date = ?, status = ?, notes = ?
      WHERE id = ?
    `;
        const params = [
            company_name, program, job_url || null, job_type,
            referral, apply_date || null, status, notes || null, id
        ];

        const [result] = await pool.execute<ResultSetHeader>(query, params);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }

        res.json({ message: 'Application updated successfully' });
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [result] = await pool.execute<ResultSetHeader>('DELETE FROM applications WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }

        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
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

        res.json({
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
