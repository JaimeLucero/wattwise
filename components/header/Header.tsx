import React from 'react';
import Link from 'next/link'; // Next.js link component for navigation
import styles from './Header.module.css';

const Header: React.FC = () => {
    return (
      <header className={styles.header}>
        <img src="Watt-Wise.svg" alt="Logo" width="50" height="50" style={{ paddingLeft: '20px' }}/>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/home" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/contact" className={styles.navLink}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  };  

export default Header;
