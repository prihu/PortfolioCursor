'use client'

import React, { useState, FormEvent, useEffect, useCallback, Suspense } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { HeroComponent, ExperienceComponent, EducationComponent, SkillCategory, Skill, Page as PageType } from '@prisma/client';

// Type for the fetched page data (for the dropdown)
interface PageSelectItem {
  id: string;
  title: string;
  slug: string;
}

// Define a type for the API response from /api/pages/[slug]
// Includes nested components based on Prisma schema
interface FullPageData extends PageType {
  heroComponents: HeroComponent[];
  experienceComponents: ExperienceComponent[];
  educationComponents: EducationComponent[];
  // Skills are fetched separately
}

// Type for Skill Category with potential skills (for admin display)
interface SkillCategoryAdmin extends SkillCategory {
    skills?: Skill[]; // Skills might be loaded separately
}

// Remove hardcoded ID
// const DEFAULT_PAGE_ID = "...";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // --- Page Selection State ---
  const [pages, setPages] = useState<PageSelectItem[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>('');
  const [pagesLoading, setPagesLoading] = useState(true);
  const [pagesError, setPagesError] = useState<string | null>(null);

  // --- Hero Form State ---
  const [heroData, setHeroData] = useState<HeroComponent | null>(null);
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubheadline, setHeroSubheadline] = useState('');
  const [heroSummary, setHeroSummary] = useState('');
  const [heroCtaLabel, setHeroCtaLabel] = useState('');
  const [heroCtaLink, setHeroCtaLink] = useState('');
  const [heroResumeLinkLabel, setHeroResumeLinkLabel] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroIsLoading, setHeroIsLoading] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);
  const [heroSuccess, setHeroSuccess] = useState<string | null>(null);

  // --- Hero Image Upload State ---
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  // --- Experience State ---
  const [experiences, setExperiences] = useState<ExperienceComponent[]>([]); // State for existing experiences
  const [expListLoading, setExpListLoading] = useState(false); // Loading state for the list
  const [expListError, setExpListError] = useState<string | null>(null); // Error state for the list
  // Form state (remain the same)
  const [expOrder, setExpOrder] = useState(10);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [expIsLoading, setExpIsLoading] = useState(false); // For form submission
  const [expError, setExpError] = useState<string | null>(null); // For form submission
  const [expSuccess, setExpSuccess] = useState<string | null>(null); // For form submission

  // --- State for Editing/Deleting Experiences ---
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null); // Track which experience is being edited
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track which experience is being deleted (show confirmation/loading)
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // --- Education State ---
  const [educationEntries, setEducationEntries] = useState<EducationComponent[]>([]);
  const [eduListLoading, setEduListLoading] = useState(false);
  const [eduListError, setEduListError] = useState<string | null>(null);
  // Add form, edit, delete states for Education similar to Experience...
  // TODO: Implement Education state management

  // --- Skills State ---
  const [skillCategories, setSkillCategories] = useState<SkillCategoryAdmin[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryOrder, setCategoryOrder] = useState(10);
  const [categoryIsLoading, setCategoryIsLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categorySuccess, setCategorySuccess] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [categoryDeleteError, setCategoryDeleteError] = useState<string | null>(null);
  // Add state for Skills within categories later...
  // TODO: Implement Skill state management

  // --- Effects ---
  // Session protection
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=/admin');
    }
  }, [status, router]);

  // Fetch pages
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchPages = async () => {
        setPagesLoading(true); setPagesError(null);
        try {
          const response = await fetch('/api/pages');
          if (!response.ok) throw new Error(`Failed: ${response.statusText}`);
          const data: PageSelectItem[] = await response.json();
          setPages(data);
          if (data.length > 0) {
            const homePage = data.find(p => p.slug === 'home') || data[0];
            setSelectedPageId(homePage.id);
            setSelectedPageSlug(homePage.slug);
          } else { setPagesError("No pages found."); }
        } catch (err: any) { setPagesError(err.message || 'Error loading pages.'); }
        finally { setPagesLoading(false); }
      };
      fetchPages();
    }
  }, [status]);

  // Fetch existing Hero, Experience, AND Education data when selectedPageSlug changes
  // Fetch Skill Categories separately as they are global
  const fetchPageComponentsData = useCallback(async () => {
    if (!selectedPageSlug || status !== 'authenticated') return;

    // Reset states
    setHeroIsLoading(true); setHeroError(null); setHeroData(null);
    setExpListLoading(true); setExpListError(null); setExperiences([]); // Reset experience list

    try {
      const response = await fetch(`/api/pages/${selectedPageSlug}`);
      if (!response.ok) {
        // Handle 404 or other errors
        const errorMsg = `API Error (${response.status}): ${response.statusText}`;
        setHeroError(errorMsg); setExpListError(errorMsg);
        return;
      }
      const pageData: FullPageData = await response.json();

      // Process Hero Data
      const currentHero = pageData.heroComponents?.[0];
      setHeroData(currentHero || null);
      if (currentHero) {
        setHeroHeadline(currentHero.headline || '');
        setHeroSubheadline(currentHero.subheadline || '');
        setHeroSummary(currentHero.summary || '');
        setHeroCtaLabel(currentHero.ctaLabel || '');
        setHeroCtaLink(currentHero.ctaLink || '');
        setHeroResumeLinkLabel(currentHero.resumeLinkLabel || '');
        setHeroImageUrl(currentHero.imageUrl || '');
      } else {
        setHeroHeadline(''); setHeroSubheadline(''); setHeroSummary('');
        setHeroCtaLabel(''); setHeroCtaLink(''); setHeroResumeLinkLabel('');
        setHeroImageUrl('');
        setHeroError('No existing Hero component found for this page. Saving will create one.');
      }

      // Process Experience Data
      setExperiences(pageData.experienceComponents || []);
      if (!pageData.experienceComponents || pageData.experienceComponents.length === 0) {
        // Optional: Set a message if no experiences found, distinct from an error
        // setExpListError('No existing experience entries found for this page.');
      }

    } catch (err: any) {
      const errorMsg = err.message || 'Error loading page components data.';
      setHeroError(errorMsg); setExpListError(errorMsg);
      console.error("Fetch Components Error:", err);
    } finally {
      setHeroIsLoading(false);
      setExpListLoading(false);
    }
  }, [selectedPageSlug, status]);

  // Trigger fetchPageComponentsData when selectedPageSlug changes
  useEffect(() => {
    fetchPageComponentsData();
  }, [fetchPageComponentsData]);

  // --- Handlers ---
  const handleHeroSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPageId || !heroData?.id) {
      setHeroError("Cannot update: Page not selected or existing Hero data not loaded.");
      return;
    }

    setHeroIsLoading(true); setHeroError(null); setHeroSuccess(null);

    const updatedHeroPayload = {
      headline: heroHeadline,
      subheadline: heroSubheadline,
      summary: heroSummary,
      ctaLabel: heroCtaLabel,
      ctaLink: heroCtaLink,
      resumeLinkLabel: heroResumeLinkLabel,
      imageUrl: heroImageUrl,
    };

    try {
      const response = await fetch(`/api/hero/${heroData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHeroPayload),
      });
      const result = await response.json();
      if (!response.ok) {
        setHeroError(result.message || result.error || `API Error: ${response.statusText}`);
      } else {
        setHeroSuccess('Hero component updated successfully!');
        setHeroData(result);
      }
    } catch (err: any) {
      setHeroError(err.message || 'Submission failed.');
      console.error(err);
    } finally { setHeroIsLoading(false); }
  };

  const handleExperienceSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPageId) { setExpError("Page not selected."); return; }

    const method = editingExperienceId ? 'PUT' : 'POST';
    const url = editingExperienceId ? `/api/experience/${editingExperienceId}` : '/api/experience';

    setExpIsLoading(true); setExpError(null); setExpSuccess(null);

    // Validation (basic)
    if (!jobTitle || !startDate) {
        setExpError("Job Title and Start Date are required.");
        setExpIsLoading(false);
        return;
    }

    try {
      const payload = {
        jobTitle,
        company,
        location,
        // Ensure dates are sent in a format the backend expects (e.g., ISO string or YYYY-MM-DD)
        // Backend zod schema uses z.coerce.date, so string should be fine
        startDate: startDate || null,
        endDate: endDate || null,
        description,
        order: expOrder,
        // Only include pageId when creating (POST)
        ...(method === 'POST' && { pageId: selectedPageId }),
      };

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Improved error handling: Use backend error message if available
        const backendError = result.message || (result.errors ? JSON.stringify(result.errors) : `API Error: ${response.statusText}`);
        setExpError(backendError);
        console.error(`${method === 'PUT' ? 'Update' : 'Add'} Experience Error:`, result);
      } else {
        setExpSuccess(`Experience ${editingExperienceId ? 'updated' : 'added'} successfully!`);
        handleCancelEdit(); // Reset form and editing state
        fetchPageComponentsData(); // Refresh list
         // Clear success message after a delay
         setTimeout(() => setExpSuccess(null), 5000);
      }
    } catch (err: any) {
      setExpError(err.message || 'Submission failed.');
      console.error(`${method === 'PUT' ? 'Update' : 'Add'} Experience Exception:`, err);
    }
    finally { setExpIsLoading(false); }
  };

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageId = event.target.value;
    const selectedPage = pages.find(p => p.id === newPageId);
    setSelectedPageId(newPageId);
    setSelectedPageSlug(selectedPage?.slug || '');
  };

  // --- Handlers for Edit/Delete ---
  const handleEditClick = (exp: ExperienceComponent) => {
    setEditingExperienceId(exp.id);
    setJobTitle(exp.jobTitle);
    setCompany(exp.company || '');
    setLocation(exp.location || '');
    // Format dates for input type="date" (YYYY-MM-DD)
    setStartDate(exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '');
    setEndDate(exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '');
    setDescription(exp.description || '');
    setExpOrder(exp.order);
    setExpError(null); // Clear any previous form errors
    setExpSuccess(null); // Clear any previous success messages
    // Optionally scroll to the form
    document.getElementById('experienceForm')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExperienceId(null);
    // Reset form fields
    setJobTitle(''); setCompany(''); setLocation('');
    setStartDate(''); setEndDate(''); setDescription('');
    setExpOrder(prev => experiences.length > 0 ? Math.max(...experiences.map(e => e.order)) + 10 : 10); // Reset order
    setExpError(null);
    setExpSuccess(null);
  };

  const handleDeleteClick = async (expId: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return;
    }
    setIsDeleting(expId);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      const response = await fetch(`/api/experience/${expId}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to delete experience');
      }
      setDeleteSuccess('Experience deleted successfully.');
      // Refetch experiences to update the list
      fetchPageComponentsData();
    } catch (err: any) {
      setDeleteError(err.message || 'Error deleting experience.');
      console.error("Delete Experience Error:", err);
    } finally {
      setIsDeleting(null);
      // Clear success/error message after a delay
      setTimeout(() => {
        setDeleteSuccess(null);
        setDeleteError(null);
      }, 5000);
    }
  };

  // Add this handler for image file changes
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploadingImage(true);
      setImageUploadError(null);

      const formData = new FormData();
      formData.append('file', file);

      try {
          const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
          });

          const result = await response.json();

          if (!response.ok) {
              throw new Error(result.message || result.error || 'Image upload failed');
          }

          // Update the heroImageUrl state with the URL from the API response
          setHeroImageUrl(result.secure_url);
          setImageUploadError(null); // Clear previous errors on success

      } catch (err: any) {
          console.error("Image Upload Error:", err);
          setImageUploadError(err.message || 'Upload failed. Please try again.');
          // Optionally clear the heroImageUrl state on error?
          // setHeroImageUrl('');
      } finally {
          setIsUploadingImage(false);
      }
  };

  // --- Render Logic ---
  if (status === 'loading') { return <div className="p-6">Loading session...</div>; }

  if (status === 'authenticated') {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Admin Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="button-secondary"
          >
            Logout
          </button>
        </div>
        <p className="dark:text-gray-300">Welcome, {session.user?.name || session.user?.email}!</p>

        {/* Page Selector */}
        <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Select Page to Edit</h2>
          {pagesLoading && <p>Loading pages...</p>}
          {pagesError && <p className="text-red-500 dark:text-red-400">Error: {pagesError}</p>}
          {!pagesLoading && !pagesError && (
            <div>
              <label htmlFor="pageIdSelect" className="label">Editing Page:</label>
              <select id="pageIdSelect" value={selectedPageId} onChange={handlePageChange} required className="mt-1 input-field w-full">
                {!pages.length && <option value="" disabled>No pages available</option>}
                {pages.length === 0 && pagesError && <option value="" disabled>Error loading pages</option>}
                {pages.map((page) => (<option key={page.id} value={page.id}>{page.title} ({page.slug})</option>))}
              </select>
            </div>
          )}
        </section>

        {/* Hero Form */}
        <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Hero Component</h2>
          {!selectedPageId ? <p className="text-gray-500 italic">Select a page above to manage its Hero component.</p> : (
            <form onSubmit={handleHeroSubmit} className="space-y-4">
              <div><label htmlFor="heroHeadline" className="label">Headline:</label><input id="heroHeadline" type="text" value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} disabled={heroIsLoading} className="mt-1 input-field" /></div>
              <div><label htmlFor="heroSubheadline" className="label">Sub-headline:</label><input id="heroSubheadline" type="text" value={heroSubheadline} onChange={(e) => setHeroSubheadline(e.target.value)} disabled={heroIsLoading} className="mt-1 input-field" /></div>
              <div><label htmlFor="heroSummary" className="label">Summary:</label><textarea id="heroSummary" value={heroSummary} onChange={(e) => setHeroSummary(e.target.value)} disabled={heroIsLoading} rows={3} className="mt-1 input-field"></textarea></div>
              <div><label htmlFor="heroCtaLabel" className="label">CTA Label:</label><input id="heroCtaLabel" type="text" value={heroCtaLabel} onChange={(e) => setHeroCtaLabel(e.target.value)} disabled={heroIsLoading} className="mt-1 input-field" /></div>
              <div><label htmlFor="heroCtaLink" className="label">CTA Link:</label><input id="heroCtaLink" type="text" value={heroCtaLink} onChange={(e) => setHeroCtaLink(e.target.value)} disabled={heroIsLoading} className="mt-1 input-field" /></div>
              <div><label htmlFor="heroResumeLinkLabel" className="label">Resume Link Label:</label><input id="heroResumeLinkLabel" type="text" value={heroResumeLinkLabel} onChange={(e) => setHeroResumeLinkLabel(e.target.value)} disabled={heroIsLoading} className="mt-1 input-field" /></div>

              {/* Image Upload Input */}
               <div>
                  <label htmlFor="heroImageUpload" className="form-label">Hero Image:</label>
                  <input
                      id="heroImageUpload"
                      type="file"
                      accept="image/*" // Accept common image types
                      onChange={handleImageChange}
                      disabled={isUploadingImage || heroIsLoading}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900 file:text-primary dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-800 disabled:opacity-50"
                  />
                  {isUploadingImage && <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Uploading image...</p>}
                  {imageUploadError && <p className="form-error mt-1">Upload Error: {imageUploadError}</p>}
                  {/* Display current image URL and preview */}
                  {heroImageUrl && (
                    <div className="mt-2">
                       <p className="text-xs text-gray-500 dark:text-gray-400 break-all">Current Image URL: {heroImageUrl}</p>
                       <img src={heroImageUrl} alt="Hero Preview" className="mt-2 rounded max-h-40 object-cover border border-gray-300 dark:border-gray-600"/>
                    </div>
                  )}
              </div>

              {heroError && <p className="form-error">Error: {heroError}</p>}
              {heroSuccess && <p className="form-success">{heroSuccess}</p>}
              <button type="submit" disabled={heroIsLoading || !selectedPageId || !heroData} className="w-full button-primary">
                {heroIsLoading ? 'Saving...' : 'Update Hero Component'}
              </button>
            </form>
          )}
        </section>

        {/* Experience Section */}
        <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md space-y-6">
          {/* Existing Experiences List */}
          <div>
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Existing Experiences</h3>
            {expListLoading && <p>Loading experiences...</p>}
            {expListError && <p className="form-error">Error: {expListError}</p>}
            {!expListLoading && !expListError && experiences.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 italic">No existing experience entries for this page.</p>
            )}
            {!expListLoading && !expListError && experiences.length > 0 && (
              <ul className="space-y-3">
                {experiences
                  .sort((a, b) => a.order - b.order) // Sort experiences by order
                  .map((exp) => (
                    <li key={exp.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded flex justify-between items-start">
                      <div>
                        <p className="font-medium dark:text-white">{exp.order}. {exp.jobTitle} at {exp.company}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {exp.location ? `${exp.location} | ` : ''}
                          {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                        </p>
                        {exp.description && <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">{exp.description}</p>}
                        {/* Display delete status for this item */}
                        {isDeleting === exp.id && <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Deleting...</p>}
                        {deleteError && isDeleting === exp.id && <p className="form-error mt-1">{deleteError}</p>}
                        {/* We might not need specific success message here if list refreshes */}
                      </div>
                      <div className="flex space-x-2 flex-shrink-0 ml-4">
                        <button
                          onClick={() => handleEditClick(exp)}
                          disabled={!!editingExperienceId || !!isDeleting} // Disable if editing another or deleting
                          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(exp.id)}
                          disabled={isDeleting === exp.id || !!editingExperienceId} // Disable if deleting this one or editing any
                          className={`text-sm ${isDeleting === exp.id ? 'text-gray-500' : 'text-red-600 hover:text-red-800'} disabled:opacity-50 disabled:cursor-not-allowed dark:text-red-400 dark:hover:text-red-300`}
                        >
                          {isDeleting === exp.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Add/Edit Experience Form - Adding id for scrollIntoView */}
          <div id="experienceForm">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">{editingExperienceId ? 'Edit Experience' : 'Add New Experience'}</h3>
            {!selectedPageId ? <p className="text-gray-500 italic">Select a page above.</p> : (
              <form onSubmit={handleExperienceSubmit} className="space-y-4">
                <div><label htmlFor="jobTitle" className="label">Job Title:</label><input id="jobTitle" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required disabled={expIsLoading} className="mt-1 input-field" /></div>
                <div><label htmlFor="company" className="label">Company:</label><input id="company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} required disabled={expIsLoading} className="mt-1 input-field" /></div>
                <div><label htmlFor="location" className="label">Location:</label><input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} disabled={expIsLoading} className="mt-1 input-field" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label htmlFor="startDate" className="label">Start Date:</label><input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required disabled={expIsLoading} className="mt-1 input-field" /></div>
                  <div><label htmlFor="endDate" className="label">End Date (Current if blank):</label><input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={expIsLoading} className="mt-1 input-field" /></div>
                </div>
                <div><label htmlFor="description" className="label">Description:</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} disabled={expIsLoading} className="mt-1 input-field"></textarea></div>
                <div><label htmlFor="expOrder" className="label">Order:</label><input id="expOrder" type="number" value={expOrder} onChange={(e) => setExpOrder(parseInt(e.target.value) || 0)} disabled={expIsLoading} className="mt-1 input-field" /></div>

                {expError && <p className="form-error">Error: {expError}</p>}
                {expSuccess && <p className="form-success">{expSuccess}</p>}
                <div className="flex space-x-3">
                  <button type="submit" disabled={expIsLoading || !selectedPageId} className="flex-grow button-primary">
                    {expIsLoading ? (editingExperienceId ? 'Saving...' : 'Adding...') : (editingExperienceId ? 'Save Changes' : 'Add Experience')}
                  </button>
                  {editingExperienceId && (
                    <button type="button" onClick={handleCancelEdit} disabled={expIsLoading} className="button-secondary">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>

      </div> // End container
    );
  }

  return null; // Fallback for unauthenticated or other statuses
}

// Add helper styles to globals.css if not already present:
/*
@layer components {
  .input-field { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white; }
  .button-primary { @apply flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 dark:focus:ring-offset-gray-800; }
  .button-secondary { @apply py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600; }
  .label { @apply block text-sm font-medium text-gray-700 dark:text-gray-300; }
  .form-error { @apply text-sm text-red-500 dark:text-red-400; }
  .form-success { @apply text-sm text-green-500 dark:text-green-400; }
}
*/

// --- REVIEW BLOCK START ---
// Requesting review for the Admin Page update adding the Experience form and separating state.
// Focus areas: State separation (Hero vs Exp), handler separation, form structure for Experience, date inputs, conditional rendering based on page selection, UI feedback separation.
// Reviewers: Frontend Developer, SDE-III (Backend), Principal Architect, QA Engineer, Security SME
// --- REVIEW BLOCK END --- 