import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileMenu from '../MobileMenu';
import '@testing-library/jest-dom';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/',
}));

describe('MobileMenu Component', () => {
  // Define test props
  const mockProps = {
    isOpen: true,
    navItems: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/#about' },
      { label: 'Experience', href: '/#experience' },
    ],
    sessionStatus: 'unauthenticated',
    onClose: jest.fn(),
    onSignOut: jest.fn(),
    onNavClick: jest.fn(),
    onKeyDown: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<MobileMenu {...mockProps} />);
    
    // Check if menu items are visible
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    
    // Check if admin login link is visible when unauthenticated
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

  it('is not visible when closed', () => {
    render(<MobileMenu {...mockProps} isOpen={false} />);
    
    // Menu items should have tabIndex -1 when closed
    const menuItems = screen.getAllByRole('menuitem', { hidden: true });
    menuItems.forEach(item => {
      expect(item).toHaveAttribute('tabIndex', '-1');
    });
    
    // Menu should have closed styling - need to target the containing div, not the ul
    const mobileMenuDiv = document.getElementById('mobile-menu');
    expect(mobileMenuDiv?.className).toContain('max-h-0');
    expect(mobileMenuDiv?.className).toContain('opacity-0');
  });

  it('shows logout button when authenticated', () => {
    render(<MobileMenu {...mockProps} sessionStatus="authenticated" />);
    
    // Check if logout button is visible
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Admin Login')).not.toBeInTheDocument();
  });

  it('calls onNavClick when a nav item is clicked', () => {
    render(<MobileMenu {...mockProps} />);
    
    // Click on a nav item
    fireEvent.click(screen.getByText('About'));
    
    // Check if onNavClick and onClose were called
    expect(mockProps.onNavClick).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('calls onSignOut when logout button is clicked', () => {
    render(<MobileMenu {...mockProps} sessionStatus="authenticated" />);
    
    // Click on logout button
    fireEvent.click(screen.getByText('Logout'));
    
    // Check if onSignOut and onClose were called
    expect(mockProps.onSignOut).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('handles keyboard navigation', () => {
    render(<MobileMenu {...mockProps} />);
    
    // Press Enter on a nav item
    fireEvent.keyDown(screen.getByText('About'), { key: 'Enter' });
    
    // Check if onKeyDown was called
    expect(mockProps.onKeyDown).toHaveBeenCalled();
  });

  it('closes when clicking outside the menu', () => {
    // Create a mock event
    const mockEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    
    // Setup document mousedown event
    render(<MobileMenu {...mockProps} />);
    
    // Simulate clicking outside by dispatching event on document
    document.dispatchEvent(mockEvent);
    
    // Check if onClose was called
    expect(mockProps.onClose).toHaveBeenCalled();
  });
}); 