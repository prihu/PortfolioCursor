"use client";

import React, { useState } from 'react';

// Define types for form data and state
interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string | null;
}

// Define props type
interface ContactProps {
  title?: string;
  introText?: string;
  contactLinks?: {
    _key?: string;
    name?: string;
    url?: string;
  }[];
  resumeUrl?: string | null; // Pass the fetched resume URL
}

const Contact: React.FC<ContactProps> = ({
  title = 'Get in Touch',
  introText,
  contactLinks = [],
  resumeUrl
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    message: null,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({}); // For field-specific errors

  // Basic email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateField = (name: keyof FormData, value: string): string | null => {
    switch (name) {
      case 'name':
        return value.trim() ? null : 'Name is required.';
      case 'email':
        if (!value.trim()) return 'Email is required.';
        return emailRegex.test(value) ? null : 'Please enter a valid email address.';
      case 'message':
        return value.trim() ? null : 'Message is required.';
      default:
        return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: keyof FormData; value: string };
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    // Optionally, validate on change after initial submit attempt or blur
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: keyof FormData; value: string };
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error || undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;
    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ status: 'idle', message: null }); // Reset state on new submit
    setErrors({}); // Clear previous errors

    if (!validateForm()) {
      setFormState({ status: 'error', message: 'Please fix the errors in the form.' });
      return; // Don't submit if validation fails
    }

    setFormState({ status: 'loading', message: null });

    // --- TODO: Replace with actual API call ---
    try {
      // Example: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Submitting:', formData);
      // Assume success for now
      setFormState({ status: 'success', message: 'Your message has been sent successfully!' });
      setFormData({ name: '', email: '', message: '' }); // Clear form on success
      setErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      setFormState({ status: 'error', message: 'An error occurred. Please try again later.' });
    }
    // --- End TODO ---
  };

  // Prepare links to display, potentially adding resume if URL exists
  const displayLinks = [...contactLinks];
  if (resumeUrl) {
    // Check if resume link already exists from CMS to avoid duplicates
    const hasResumeLink = displayLinks.some(link => link.name?.toLowerCase() === 'resume');
    if (!hasResumeLink) {
      displayLinks.push({
        _key: 'resume-link', // Static key for this added link
        name: 'Resume',
        url: resumeUrl
      });
    }
  }

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
        <div className="max-w-2xl mx-auto">
          {/* Form Status Message Area */}
          {formState.message && (
            <div
              role="alert"
              aria-live="assertive" // Announce changes assertively
              className={`mb-4 p-4 rounded-md text-sm ${formState.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''
                } ${formState.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''
                }`}
            >
              {formState.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur} // Validate on blur
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                required
                aria-required="true"
                aria-invalid={!!errors.name} // Indicate invalid state for screen readers
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur} // Validate on blur
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                required
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              // Removed pattern attribute, using JS validation instead for better feedback control
              />
              {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.email}</p>}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur} // Validate on blur
                rows={4}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                required
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && <p id="message-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
              disabled={formState.status === 'loading'} // Disable button while loading
              aria-live="polite" // Announce changes related to submission status
            >
              {formState.status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact; 