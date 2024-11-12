'use client';

import { usePathname } from 'next/navigation';
import { SignedIn } from '@clerk/nextjs';
import Header from '../components/Header';

const ConditionalHeader = () => {
  const pathname = usePathname();

  const showHeader = pathname !== '/sign-in' && pathname !== '/sign-up';

  return (
    <>
      {showHeader && (
        <SignedIn>
          <Header />
        </SignedIn>
      )}
    </>
  );
};

export default ConditionalHeader;