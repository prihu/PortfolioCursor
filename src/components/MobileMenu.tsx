// src/components/MobileMenu.tsx
"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define types matching Header
interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  sessionStatus: 'loading' | 'authenticated' | 'unauthenticated';
  onClose: () => void; // Function to close the menu
  onSignOut: () => void; // Function to sign out
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onKeyDown: (e: React.KeyboardEvent, callback: () => void) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navItems,
  sessionStatus,
  onClose,
  onSignOut,
  onNavClick,
  onKeyDown,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside (logic moved from Header)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div
      ref={menuRef}
      id="mobile-menu"
      className={`absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
      aria-hidden={!isOpen}
    >
      <ul className="flex flex-col px-4 py-2 space-y-2" role="menu">
        {navItems.map((item) => (
          <li key={item.label} role="none">
            <Link
              href={item.href}
              onClick={(e) => { onNavClick(e, item.href); onClose(); }}
              onKeyDown={(e) => onKeyDown(e, () => { router.push(item.href); onClose(); })}
              className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 focus:outline-none focus:text-primary dark:focus:text-blue-400 rounded"
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
            >
              {item.label}
            </Link>
          </li>
        ))}
        {/* Auth Links - Mobile */}
        {sessionStatus === 'authenticated' ? (
          <li role="none">
            <button
              onClick={() => { onSignOut(); onClose(); }}
              onKeyDown={(e) => onKeyDown(e, () => { onSignOut(); onClose(); })}
              className="block w-full text-left py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 focus:outline-none focus:text-primary dark:focus:text-blue-400 rounded"
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
            >
              Logout
            </button>
          </li>
        ) : (
          <li role="none">
            <Link
              href="/admin"
              onClick={onClose}
              onKeyDown={(e) => onKeyDown(e, () => { router.push('/admin'); onClose(); })}
              className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 focus:outline-none focus:text-primary dark:focus:text-blue-400 rounded"
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
            >
              Admin Login
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MobileMenu;
