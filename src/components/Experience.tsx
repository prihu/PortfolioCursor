import React from 'react'

const Experience = () => {
  const experiences = [
    {
      company: 'Amazon',
      role: 'Product Manager',
      period: 'Aug 2022 - Present',
      location: 'Seattle, WA',
      achievements: [
        'Led the development and launch of a new feature that improved customer experience by 25%',
        'Managed a cross-functional team of 10+ members to deliver projects on time and within budget',
        'Collaborated with stakeholders to define product strategy and roadmap',
      ],
    },
    {
      company: 'Walmart Global Tech',
      role: 'Product Manager',
      period: 'Jul 2021 - Aug 2022',
      location: 'Bentonville, AR',
      achievements: [
        'Spearheaded the development of a new e-commerce platform feature',
        'Increased customer engagement by 30% through data-driven improvements',
        'Led agile development teams and managed product backlog',
      ],
    },
    {
      company: 'Publicis Sapient',
      role: 'Product Manager',
      period: 'Jan 2019 - Jul 2021',
      location: 'India',
      achievements: [
        'Managed end-to-end product development lifecycle for multiple clients',
        'Improved team productivity by implementing agile methodologies',
        'Delivered successful product launches for major retail clients',
      ],
    },
  ]

  return (
    <section id="experience" className="section-padding bg-gray-50 dark:bg-gray-900">
      <h2 className="heading-2 text-center mb-12">Experience</h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary">{exp.company}</h3>
                <p className="text-lg font-semibold">{exp.role}</p>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <p>{exp.period}</p>
                <p>{exp.location}</p>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              {exp.achievements.map((achievement, i) => (
                <li key={i}>{achievement}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Experience 