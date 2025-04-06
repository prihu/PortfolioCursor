import React from 'react'

const Education = () => {
  const educationDetails = [
    {
      institution: 'Institute of Management Technology (IMT), Ghaziabad',
      degree: 'MBA, Finance',
      period: 'Graduated: March 2018',
    },
    {
      institution: 'Birla Institute of Technology and Science (BITS), Pilani – Goa Campus',
      degree: 'Bachelor of Engineering, Electronics and Instrumentation',
      period: 'Graduated: December 2014',
    },
  ]

  return (
    // Make sure the section has the id="education" for the link to work
    <section id="education" className="section-padding bg-gray-50 dark:bg-gray-900">
      <h2 className="heading-2 text-center mb-12">Education</h2>
      <div className="max-w-3xl mx-auto space-y-8">
        {educationDetails.map((edu, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-primary mb-2">{edu.institution}</h3>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{edu.degree}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{edu.period}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Education 