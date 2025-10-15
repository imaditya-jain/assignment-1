"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [show, setShow] = useState(false);
    const pathname = usePathname();
    const { user, isAuthenticated, loading, error } = useAppSelector(state => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShow(true);
        }
    }, []);

    useEffect(() => {
        if (pathname === "/account/login") {
            if (isAuthenticated && user && !loading && !error) {
                if (user?.role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/");
                }
            }
        }
    }, [pathname, isAuthenticated, user, loading, error, router]);

    if (!show) {
        return null;
    }

    return (
        <main className="font-sans">
            <section className='min-h-screen flex items-center justify-center' style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                <div className="w-full max-w-[30rem] px-4 md:px-0 mx-auto">
                    <div className='mt-6'>
                        <h1 className='font-bold uppercase text-[22px] md:text-[28px] text-center mb-2'>Welcome</h1>
                    </div>
                    <div className='w-full bg-white p-6 rounded-lg my-6 shadow-md flex flex-col'>
                        {children}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Layout;