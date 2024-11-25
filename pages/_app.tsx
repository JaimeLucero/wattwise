// _app.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/global.css'; // Import global styles

function MyApp({ Component, pageProps }: any) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page when the app loads
    if (router.pathname === '/') {
      router.push('/home');  // Change '/home' to your desired home page path
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
