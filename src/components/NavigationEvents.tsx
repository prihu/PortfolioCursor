'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // Import nprogress styles

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.configure({ showSpinner: false }); // Optional: Hide the spinner

    // Start progress bar on mount (initial load)
    NProgress.start();

    // Complete progress bar when component unmounts or route changes
    return () => {
      NProgress.done();
    };
  }, []); // Run only once on mount and unmount

  useEffect(() => {
    // Start progress on path change
    NProgress.start();
    // Use setTimeout to ensure done() is called after the new page is rendered
    const timer = setTimeout(() => NProgress.done(), 500); // Adjust delay as needed
    return () => clearTimeout(timer); // Cleanup timer on unmount or next change
  }, [pathname, searchParams])

  return null // This component doesn't render anything
} 