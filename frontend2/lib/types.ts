export type JobType = 'Intern' | 'Fulltime' | 'Contract' | 'MT' | 'Freelance';

export type Referral = 'LinkedIn' | 'Jobstreet' | 'Job Fair' | 'Deals' | 'Friends' | 'Other';

export type ApplicationStatus =
    | 'Submitted'
    | 'Emailed Back'
    | 'Assessment'
    | 'HR - Interview'
    | 'User - Interview'
    | 'LGD'
    | 'Presentation'
    | 'Offering'
    | 'Rejected'
    | 'Not Proceed'
    | 'Waiting';

export interface Application {
    id: number;
    company_name: string;
    program: string;
    job_url?: string;
    job_type: JobType;
    referral: Referral;
    apply_date: string;
    status: ApplicationStatus;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface ApplicationFormData {
    company_name: string;
    program: string;
    job_url?: string;
    job_type: JobType;
    referral: Referral;
    apply_date: string;
    status: ApplicationStatus;
    notes?: string;
}

export interface Stats {
    byStatus: { status: string; count: number }[];
    byJobType: { job_type: string; count: number }[];
    byReferral: { referral: string; count: number }[];
    summary: {
        total: number;
        onProcess: number;
        rejected: number;
        offering: number;
        waiting: number;
    };
}

export const JOB_TYPES: JobType[] = ['Intern', 'Fulltime', 'Contract', 'MT', 'Freelance'];
export const REFERRALS: Referral[] = ['LinkedIn', 'Jobstreet', 'Job Fair', 'Deals', 'Friends', 'Other'];
export const STATUSES: ApplicationStatus[] = [
    'Submitted', 'Emailed Back', 'Assessment', 'HR - Interview',
    'User - Interview', 'LGD', 'Presentation', 'Offering', 'Rejected', 'Not Proceed', 'Waiting',
];
