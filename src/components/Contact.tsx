import React from 'react'

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
    <section id="contact" className="section-padding bg-gray-50 dark:bg-gray-900">
      <h2 className="heading-2 text-center mb-12">{title}</h2>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="paragraph mb-6">
            {introText || "I'm always open to discussing opportunities or connecting. Feel free to reach out!"}
          </p>
          {displayLinks.length > 0 && (
            <div className="flex justify-center gap-4 flex-wrap">
              {displayLinks.map((link) => (
                <a
                  key={link._key || link.name}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
                >
                  {/* Icon logic can be added here based on link.name if desired */}
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* You can keep or remove the form. If kept, it needs a backend endpoint to submit to. */}
        {/* For now, we focus on displaying fetched contact info */}
        {/* <form className="space-y-6 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"> */}
        {/* ... form fields ... */}
        {/* </form> */}
      </div>
    </section>
  )
}

export default Contact 