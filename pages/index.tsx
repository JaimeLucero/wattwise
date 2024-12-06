// app/page.tsx or pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Change this import

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home')
  }, [router]);

  return null;
}