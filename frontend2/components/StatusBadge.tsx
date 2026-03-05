import { ApplicationStatus } from '@/lib/types';

const statusConfig: Record<ApplicationStatus, { styles: string; dot: string }> = {
    'Submitted': { styles: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    'Emailed Back': { styles: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
    'Assessment': { styles: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
    'HR - Interview': { styles: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
    'User - Interview': { styles: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
    'LGD': { styles: 'bg-yellow-50 text-yellow-700 border-yellow-300', dot: 'bg-yellow-500' },
    'Presentation': { styles: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
    'Offering': { styles: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
    'Rejected': { styles: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
    'Not Proceed': { styles: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
    'Waiting': { styles: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
};

const defaultConfig = { styles: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };

interface StatusBadgeProps {
    status: ApplicationStatus | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status as ApplicationStatus] ?? defaultConfig;

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.styles}`}>
            {status}
        </span>
    );
}
