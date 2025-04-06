import React from 'react'

const Contact = () => {
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/gargpriyank/',
      icon: '🔗',
    },
    {
      name: 'Email',
      url: 'mailto:your.email@example.com',
      icon: '✉️',
    },
  ]

  return (
    <section id="contact" className="section-padding bg-gray-50 dark:bg-gray-900">
      <h2 className="heading-2 text-center mb-12">Get in Touch</h2>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="paragraph mb-6">
            I'm always open to discussing product management opportunities or sharing insights about the industry.
          </p>
          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <form className="space-y-6 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact 