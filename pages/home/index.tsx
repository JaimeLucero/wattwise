import { NextPage } from 'next';
import Head from 'next/head';
import styles from './index.module.css';
import Header from '@components/header/Header';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home | My Next.js App</title>
        <meta name="description" content="Welcome to my Next.js app home page." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <Header />
        <header className={styles.header}>
          <h1>Welcome to My Next.js App</h1>
          <p>Start building amazing apps with Next.js and TypeScript!</p>
        </header>
        <section className={styles.content}>
          <h2>Features</h2>
          <ul>
            <li>🚀 Fast rendering</li>
            <li>🎨 SEO-friendly</li>
            <li>🔒 Secure and scalable</li>
          </ul>
        </section>
        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} My Next.js App. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
};

export default Home;
