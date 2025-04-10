import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import Header from '../Header';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}));

describe('Header Component', () => {
  // Helper function to render with SessionProvider
  const renderWithSession = (component: React.ReactElement, sessionData: any = null) => {
    return render(
      <SessionProvider session={sessionData}>
        {component}
      </SessionProvider>
    );
  };

  it('renders the logo/brand name', () => {
    renderWithSession(<Header />);
    // Find by text, adjust text based on actual Header content
    const logoElement = screen.getByText(/PG/i); // Corrected text to PG
    expect(logoElement).toBeInTheDocument();
  });

  it('renders navigation links in the desktop menu', () => {
    renderWithSession(<Header />); // Use helper

    // Find the main navigation landmark
    const nav = screen.getByRole('navigation', { name: /main navigation/i });

    // Query within the navigation landmark for the menu items
    // Use within helper from @testing-library/react
    const { getByRole } = within(nav);

    // Find links/menuitems by their text content and correct role within the nav
    expect(getByRole('link', { name: /Home/i })).toBeInTheDocument(); // Home is a link directly in nav
    expect(getByRole('menuitem', { name: /about/i })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: /experience/i })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: /skills/i })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: /contact/i })).toBeInTheDocument();
    // Check for Admin Login link within the nav
    expect(getByRole('link', { name: /Admin Login/i })).toBeInTheDocument();
  });

  // Add more tests later: e.g., mobile menu toggle, keyboard navigation
}); 