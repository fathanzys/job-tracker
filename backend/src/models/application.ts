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
