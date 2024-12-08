import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
    const router = useRouter(); // Hook to get the current route

    const handleLinkClick = (href: string) => {
        if (router.pathname === href) {
            // If the current page is clicked, reload the page
            router.reload();
        }
    };

    const navStyles = {
        display: 'flex',
    };

    const navListStyles = {
        listStyleType: 'none',
        margin: '0',
        padding: '0',
        display: 'flex',
    };

    const navItemStyles = {
        margin: '0 15px',
    };

    const navLinkStyles = {
        color: '#3B3A3A',
        textDecoration: 'none',
        fontSize: '16px',
    };

    const navLinkHoverStyles = {
        textDecoration: 'underline',
    };

    const navLinkActiveStyles = {
        color: '#000000',
    };

    const activeLinkStyles = {
        backgroundColor: '#444',
        color: 'white',
    };

    // Function to check if the link is active (i.e., the current page)
    const isActive = (path: string) => router.pathname === path ? activeLinkStyles : {};

    return (
        <header style={{
            position: 'fixed',
            background: 'linear-gradient(#235789, #FFFBDE)', // Horizontal gradient
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            zIndex: 1000, // Ensure the header stays on top of content
        }}>
            <img src="Watt-Wise.svg" alt="Logo" width="50" height="50" style={{ paddingLeft: '20px' }} />
            <nav style={navStyles}>
                <ul style={navListStyles}>
                    <li style={navItemStyles}>
                        <Link
                            href="/home"
                            passHref
                            style={{ ...navLinkStyles, ...(router.pathname === '/home' ? navLinkActiveStyles : {}) }}
                            onClick={() => handleLinkClick('/home')}
                        >
                            Home
                        </Link>
                    </li>
                    <li style={navItemStyles}>
                        <Link
                            href="/dashboard"
                            passHref
                            style={{ ...navLinkStyles, ...(router.pathname === '/dashboard' ? navLinkActiveStyles : {}) }}
                            onClick={() => handleLinkClick('/dashboard')}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li style={navItemStyles}>
                        <Link
                            href="/about"
                            passHref
                            style={{ ...navLinkStyles, ...(router.pathname === '/about' ? navLinkActiveStyles : {}) }}
                            onClick={() => handleLinkClick('/about')}
                        >
                            About
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
