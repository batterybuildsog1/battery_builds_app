'use client';

import { signIn } from 'next-auth/react';

export default function SignIn() {
  const handleSignIn = async () => {
    try {
      await signIn('github', { callbackUrl: '/manual-j', redirect: true });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full p-8 bg-white rounded-lg shadow-lg'>
        <h2 className='text-center text-3xl font-extrabold text-gray-900'>
          Sign in to your account
        </h2>
        <button
          onClick={handleSignIn}
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}