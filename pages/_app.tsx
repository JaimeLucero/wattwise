// pages/_app.tsx
import '../styles/global.css'; // Import global styles

function MyApp({ Component, pageProps }: any) {
  return <Component {...pageProps} />;
}

export default MyApp;
