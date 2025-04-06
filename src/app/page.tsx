import React from 'react'
import Image from 'next/image'
import Header from '../components/Header'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="section-padding flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            <h1 className="heading-1">
              Hi, I'm Priyank Garg
              <span className="block text-primary">Product Manager</span>
            </h1>
            <p className="paragraph">
              Experienced Product Manager with a proven track record at Amazon and other tech companies.
              Passionate about building innovative products that solve real customer problems.
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
                I am a passionate Product Manager with over 5 years of experience in the tech industry. Currently at Amazon,
                I lead product initiatives that impact millions of customers worldwide. My journey in product management
                has been driven by a desire to create innovative solutions that make a real difference in people's lives.
              </p>
              <p className="paragraph">
                Throughout my career at companies like Amazon and Walmart Global Tech, I've developed a strong track record
                of leading cross-functional teams, driving product strategy, and delivering successful products. I combine
                technical knowledge with business acumen to bridge the gap between user needs and business goals.
              </p>
              <p className="paragraph">
                I'm particularly interested in leveraging data and user research to make informed product decisions and
                create exceptional user experiences. When I'm not working on products, I enjoy mentoring aspiring product
                managers and contributing to the product community.
              </p>
            </div>
          </div>
        </section>

        <Experience />
        <Skills />
        <Contact />
      </main>
    </>
  )
}
