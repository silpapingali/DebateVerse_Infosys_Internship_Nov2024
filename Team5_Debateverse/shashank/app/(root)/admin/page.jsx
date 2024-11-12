import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const AdminHome = async () => {
  const user = await currentUser();

  if (!user || user.publicMetadata?.role !== 'admin') {
    redirect('/');
    return null;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center">Welcome to Admin Home</h1>
    </div>
  );
};

export default AdminHome;