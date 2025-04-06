import React from 'react'
import Link from 'next/link'

const Header = () => {
  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md dark:bg-black/80">
      <nav className="section-padding flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          PG
        </Link>
        <ul className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <button className="md:hidden">
          <span className="sr-only">Open menu</span>
          {/* Add hamburger menu icon here */}
        </button>
      </nav>
    </header>
  )
}

export default Header 