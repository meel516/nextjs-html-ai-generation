'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const res = await signIn('credentials', {
      redirect: false,
      email: form.get('email'),
      password: form.get('password'),
      name: form.get('name'),
      action: 'register',
    });

    if (res?.ok) {
      router.push('/');
    } else {
      setError('Failed to register. Email may already exist.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Sign Up</h2>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full px-4 py-2 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Sign Up
        </button>
        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
