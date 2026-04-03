'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AdminPageWrapperProps {
  children: React.ReactNode;
}

export function AdminPageWrapper({ children }: AdminPageWrapperProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in') === 'true';
    
    if (!loggedIn) {
      router.push('/admin/login');
    } else {
      setIsAuthorized(true);
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400 mx-auto" />
          <p className="mt-2 text-neutral-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
