"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const RoleRedirect = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata.role;
      if (role === 'admin' && pathname !== '/admin') {
        router.push('/admin');
      }
    }
  }, [isLoaded, user, router, pathname]);

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return null;
};

export default RoleRedirect;