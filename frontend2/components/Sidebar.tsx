'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    {
        label: 'Dashboard',
        href: '/',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        label: 'Applications',
        href: '/applications',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
        ),
    },
    {
        label: 'Add Application',
        href: '/applications/new',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
        ),
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:static md:w-64 md:min-h-screen md:border-t-0 md:border-r flex md:flex-col py-2 md:py-6 shrink-0 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:pb-0">
            {/* Logo */}
            <div className="hidden md:block px-6 pb-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-700/50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-slate-900 font-bold text-base leading-none tracking-tight">
                            Job Tracker
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 md:px-3 flex flex-row md:flex-col justify-around md:justify-start gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 md:px-3.5 py-2 md:py-2.5 rounded-lg text-[10px] md:text-sm transition-all duration-200 ${isActive
                                ? 'text-blue-700 md:bg-blue-50/50 font-semibold'
                                : 'text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <span className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}>
                                {item.icon}
                            </span>
                            <span className="truncate">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="hidden md:block px-6 pt-4 border-t border-slate-100 mt-4">
                <p className="text-slate-400 text-[11px] flex items-center gap-1.5 font-medium uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    System Online
                </p>
            </div>
        </aside>
    );
}
