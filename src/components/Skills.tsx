import React from 'react'
import type { SkillCategory, Skill } from '@prisma/client' // Use Prisma types

// Define type for category including nested skills
interface SkillCategoryWithSkills extends SkillCategory {
  skills: Skill[];
}

// Define props type
interface SkillsProps {
  title?: string;
  categories: SkillCategoryWithSkills[]; // Use the extended Prisma type
}

const Skills: React.FC<SkillsProps> = ({
  title = 'Skills & Expertise',
  categories = [] // Use updated prop name
}) => {

  if (!categories || categories.length === 0) { // Use updated prop name
    return (
      <section id="skills" className="section-padding">
        <h2 className="heading-2 text-center mb-12">{title}</h2>
        <p className="text-center text-gray-600 dark:text-gray-400">Skills details coming soon...</p>
      </section>
    )
  }

  return (
    <section id="skills" className="section-padding" aria-labelledby="skills-heading">
      <h2 id="skills-heading" className="heading-2 text-center mb-12">{title}</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map((category) => ( // Use updated prop name
          <li
            key={category.id} // Use Prisma id
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-primary mb-4">{category.name}</h3>
            {category.skills && category.skills.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {category.skills.map((skill) => ( // Iterate over nested skills
                  <li
                    key={skill.id} // Use Prisma id
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Skills 