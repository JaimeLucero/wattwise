import { NextPage } from 'next';
import Head from 'next/head';
import './index.module.css';
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home | My Next.js App</title>
        <meta name="description" content="Welcome to my Next.js app home page." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className='main'>
        <header className='header'>
          <h1>Welcome to My Next.js App</h1>
          <p>Start building amazing apps with Next.js and TypeScript!</p>
        </header>
        <section className='content'>
          <h2>Features</h2>
          <ul>
            <li>🚀 Fast rendering</li>
            <li>🎨 SEO-friendly</li>
            <li>🔒 Secure and scalable</li>
          </ul>
        </section>
        <footer className='footer'>
          <p>&copy; {new Date().getFullYear()} My Next.js App. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
};

export default Home;
