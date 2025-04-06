import React from 'react'

const Experience = () => {
  const experiences = [
    {
      company: 'IndusInd Bank',
      role: 'DVP Product – Consumer Banking',
      period: 'August 2024 – Present',
      location: 'Gurgaon, India',
      achievements: [
        'Onboarded a new dialer to increase coverage and contactability rate by 30%',
        'Implemented CRM changes to drive ANR growth by 10%',
      ],
    },
    {
      company: 'CreditVidya (acquired by CRED)',
      role: 'Product Manager, Customer Experience and Platform',
      period: 'January 2021 – August 2024',
      location: 'Hyderabad, India',
      achievements: [
        'Defined customer service product strategy and roadmap for 4 quarters',
        'Built a configurable, embeddable helpdesk widget → 15% increase in tickets/prospect',
        'Conducted A/B testing on widget design → 25% higher clicks/prospect',
        'Led user feedback loop to improve functionality → 7% increase in CSAT in 6 months',
        'Introduced bilingual IVR (Hindi/English) → 33% call deflection ratio',
        'Developed "Top-up" and "Closed loan" products → retained users and generated 20% of monthly transaction volume',
        'Created retargeting product for bounced users → 10% increase in monthly transaction volumes',
        'Improved credit score generation/user by 7% through bug fixes and backend enhancements',
        'Launched AI-enabled smart upload → 10% more users successfully uploaded documents',
        'Managed customer experience and partner enablement for BNPL → $5M/month in transaction volume',
        'Conceived partner enablement SaaS MVP for loan tracking, reporting & access control → used by 15+ partners',
      ],
    },
    {
      company: 'NeoGrowth Credit',
      role: 'Associate Product Manager, Analytics and Platform',
      period: 'May 2018 – January 2021',
      location: 'Mumbai, India',
      achievements: [
        'Deployed "NeoScore" bank statement analysis engine → reduced underwriting time from 30 mins to 5 mins',
        'Interviewed 150+ merchants across 5 cities to create personas and present insights to leadership',
        'Co-developed "NeoExpress" for small-ticket loans → captured 50% of monthly transaction volume in 3 months',
        'Improved "Alliance Portal" (B2B web app) and "NG Sales App" (Android) → added features like bulk upload, digital forms, and onboarding flows for 20+ partners and 200+ sales agents',
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