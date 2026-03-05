import { JobType } from '@/lib/types';

const jobTypeConfig: Record<JobType, string> = {
    'Fulltime': 'bg-purple-50 text-purple-700 border-purple-200',
    'Intern': 'bg-blue-50 text-blue-700 border-blue-200',
    'Contract': 'bg-orange-50 text-orange-700 border-orange-200',
    'MT': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Freelance': 'bg-pink-50 text-pink-700 border-pink-200',
};

const defaultConfig = 'bg-slate-50 text-slate-700 border-slate-200';

interface JobTypeBadgeProps {
    type: JobType | string;
}

export default function JobTypeBadge({ type }: JobTypeBadgeProps) {
    const config = jobTypeConfig[type as JobType] ?? defaultConfig;

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config}`}>
            {type}
        </span>
    );
}
