import { NextPage } from 'next';
import styles from '@styles/Home.module.css'; 
import Header from '@components/header/Header';

const Home: NextPage = () => {
  return (
    <main className={styles.main}>
        <Header />
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
  );
};

export default Home;
