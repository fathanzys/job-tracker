'use client';

import React from 'react';

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    gradient: string;
}

export default function StatCard({ label, value, icon, color, gradient }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 group relative">
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-slate-500">
                    {label}
                </div>
                <div
                    className="w-10 h-10 rounded-md flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${color}15`, color: color }}
                >
                    {icon}
                </div>
            </div>
            <div>
                <div className="text-3xl font-bold text-slate-900 leading-none">
                    {value}
                </div>
            </div>
        </div>
    );
}
