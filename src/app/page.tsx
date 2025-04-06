import React from 'react'
import Image from 'next/image'
import Header from '../components/Header'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import Contact from '../components/Contact'
import Education from '../components/Education'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28">
        {/* Hero Section */}
        <section className="section-padding flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            <h1 className="heading-1">
              Hi, I'm Priyank Garg
              <span className="block text-primary">Product Manager</span>
            </h1>
            <p className="paragraph">
              Product Manager with over 6 years of experience launching, managing, and building B2C and B2B technology products across domains including Customer Service, Identity Verification, AI Decisioning, Data Platforms, Buy Now Pay Later (BNPL), and Partner & Sales Enablement.
            </p>
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              Proven ability to drive significant growth, including 1000x transaction volume growth over 3 years and achieving 30% more transaction volumes through AI-assisted underwriting.
            </p>
            <div className="flex gap-4">
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
              >
                Contact Me
              </a>
              <a
                href="/Priyank_Garg_Resume_Sep24.pdf"
                target="_blank"
                className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                View Resume
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Priyank Garg"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 text-center mb-8">About Me</h2>
            <div className="space-y-6">
              <p className="paragraph">
                With over six years dedicated to product management, I specialize in developing and scaling B2C and B2B technology products. My experience spans diverse domains such as Customer Service platforms, Identity Verification systems, AI-driven Decisioning engines, Data Platforms, Buy Now Pay Later (BNPL) solutions, and Partner & Sales Enablement tools.
              </p>
              <p className="paragraph">
                Throughout my career at organizations like IndusInd Bank, CreditVidya (acquired by CRED), and NeoGrowth Credit, I've focused on delivering impactful results. Key achievements include driving a 1000x growth in transaction volume over three years at CreditVidya and boosting transaction volumes by 30% using AI-assisted underwriting techniques.
              </p>
              <p className="paragraph">
                I have a proven track record in defining product strategy, leading cross-functional teams, and enhancing customer experience through innovative features like configurable helpdesk widgets, bilingual IVR systems, and AI-enabled document processing. I thrive on translating user needs and market opportunities into successful product launches and iterations.
              </p>
            </div>
          </div>
        </section>

        <Experience />
        <Education />
        <Skills />
        <Contact />
      </main>
    </>
  )
}
