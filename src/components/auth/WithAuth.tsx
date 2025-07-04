'use client'
// withAuth.js
import { useAuth } from '@payloadcms/ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (Component) => {
    return function WithAuth(props) {
        const { user } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!user) {
                router.push('/admin/login');
            }
        }, [user, router]);

        if (!user) {
            return null; // O un componente de carga
        }

        return <Component {...props} />;
    };
};

export default withAuth;