import React from 'react'

const Skills = () => {
  const skillCategories = [
    {
      title: 'Product Management',
      skills: [
        'Product Strategy & Roadmapping',
        'B2C & B2B Product Management',
        'Customer Experience (CX)',
        'User Research & Feedback Loops',
        'A/B Testing & Optimization',
        'AI Decisioning & Underwriting',
        'Data Platforms & Analytics',
        'Buy Now Pay Later (BNPL)',
        'Partner & Sales Enablement',
        'SaaS Product Development',
        'Agile Methodologies',
      ],
    },
    {
      title: 'Tools & Technical',
      skills: [
        // Product & Data Tools from Resume
        'JIRA',
        'Posthog',
        'Amplitude',
        'Figma',
        'Notion',
        'Whimsical',
        'Confluence',
        'Excel',
        // Technical Skills from Resume
        'SQL',
      ],
    },
    {
      title: 'Key Domains',
      skills: [
        'Customer Service Technology',
        'Identity Verification',
        'FinTech',
        'Consumer Banking',
        'Credit & Lending',
        'Analytics Platforms',
      ],
    },
  ]

  return (
    <section id="skills" className="section-padding">
      <h2 className="heading-2 text-center mb-12">Skills & Expertise</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-primary mb-4">{category.title}</h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills 