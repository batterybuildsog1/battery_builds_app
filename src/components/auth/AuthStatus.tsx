'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  if (session) {
    return (
      <div className='flex items-center gap-4'>
        <span>Signed in as {session.user?.email}</span>
        <button 
          onClick={() => signOut()} 
          className='px-4 py-2 bg-red-600 text-white rounded-md'
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn('github')} 
      className='px-4 py-2 bg-indigo-600 text-white rounded-md'
    >
      Sign in
    </button>
  );
}
