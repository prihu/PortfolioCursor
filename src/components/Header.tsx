"use client";

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import MobileMenu from './MobileMenu';

// Define types
interface NavItem {
  label: string;
  href: string;
}

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: 'About', href: '/#about' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Contact', href: '/#contact' },
  ];

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Function to handle smooth scrolling
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.substring(2);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback if element not found immediately (e.g., different page)
        router.push('/' + href);
      }
    } else {
      // Handle non-hash links normally (e.g., /blog)
      // router.push(href); // Let Link handle this
    }
  };

  // Function to handle keyboard interaction
  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md dark:bg-black/80"
      role="banner"
    >
      <nav
        className="section-padding flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-2xl font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          aria-label="Home"
        >
          PG
        </Link>

        {/* Desktop Navigation */}
        <ul
          className="hidden md:flex items-center space-x-8"
          role="menubar"
        >
          {navItems.map((item) => (
            <li key={item.label} role="none">
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
                role="menuitem"
                tabIndex={0}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
          {/* Auth Links - Desktop */}
          {status === 'authenticated' ? (
            <li>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link href="/admin" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1">
                Admin Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'my-1'}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile Menu - Use the new component */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        navItems={navItems}
        sessionStatus={status}
        onClose={() => setIsMenuOpen(false)}
        onSignOut={() => signOut({ callbackUrl: '/' })}
        onNavClick={handleNavClick}
        onKeyDown={handleKeyDown}
      />

    </header>
  );
};

export default Header; 