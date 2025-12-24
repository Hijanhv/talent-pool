'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/events');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neo-pink via-neo-white to-neo-purple">
      <div className="text-center">
        <h1 className="text-4xl font-black text-neo-black uppercase mb-4">TalentPool</h1>
        <p className="text-neo-black font-bold">Redirecting to Events...</p>
      </div>
    </div>
  );
}
