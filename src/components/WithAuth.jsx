'use client'
// withAuth.js
import { useAuth } from '@payloadcms/ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (Component) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      
      if (!user) {
        return router.push('/admin/login');
      }
    
    }, [user])
    
    return <Component/>
    

 
};

export default withAuth;