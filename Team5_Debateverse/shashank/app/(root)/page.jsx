import React from 'react'
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';


const Page = async () => {
    const clerkUser = await currentUser();
    if(!clerkUser) {
        redirect('/sign-in');
        return null;
    }
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center">Welcome to User Home</h1>
    </div>
  );
}

export default Page