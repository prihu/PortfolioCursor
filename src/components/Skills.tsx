import React from 'react'

// Define props type
interface SkillsProps {
  title?: string;
  skillCategories?: {
    _key?: string;
    title?: string;
    skills?: string[];
  }[];
}

const Skills: React.FC<SkillsProps> = ({
  title = 'Skills & Expertise',
  skillCategories = []
}) => {

  if (!skillCategories || skillCategories.length === 0) {
    return (
      <section id="skills" className="section-padding">
        <h2 className="heading-2 text-center mb-12">{title}</h2>
        <p className="text-center text-gray-600 dark:text-gray-400">Skills details coming soon...</p>
      </section>
    )
  }

  return (
    <section id="skills" className="section-padding">
      <h2 className="heading-2 text-center mb-12">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {skillCategories.map((category) => (
          <div
            key={category._key || category.title}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-primary mb-4">{category.title || 'Category'}</h3>
            {category.skills && category.skills.length > 0 && (
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
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills 