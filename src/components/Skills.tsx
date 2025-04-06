import React from 'react'

const Skills = () => {
  const skillCategories = [
    {
      title: 'Product Management',
      skills: [
        'Product Strategy',
        'Product Development',
        'User Research',
        'Market Analysis',
        'Product Analytics',
        'A/B Testing',
        'Roadmap Planning',
        'Stakeholder Management',
      ],
    },
    {
      title: 'Technical Skills',
      skills: [
        'SQL',
        'Python',
        'Data Analysis',
        'API Design',
        'Agile/Scrum',
        'JIRA',
        'Git',
        'AWS',
      ],
    },
    {
      title: 'Leadership',
      skills: [
        'Team Management',
        'Cross-functional Leadership',
        'Project Management',
        'Strategic Planning',
        'Communication',
        'Problem Solving',
        'Decision Making',
        'Mentoring',
      ],
    },
  ]

  return (
    <section id="skills" className="section-padding">
      <h2 className="heading-2 text-center mb-12">Skills & Expertise</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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