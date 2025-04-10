import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user if it doesn't exist
  const adminEmail = 'admin@example.com'
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10), // Change this in production
      role: 'ADMIN',
    },
  })
  console.log('Admin user created:', admin.id)

  // Create home page if it doesn't exist
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Home Page',
      isPublished: true,
      aboutContent: 'This is a portfolio website built with Next.js, Prisma, and Tailwind CSS.'
    },
  })
  console.log('Home page created:', homePage.id)

  // Add a hero component to the home page
  const hero = await prisma.heroComponent.upsert({
    where: {
      pageId_order: {
        pageId: homePage.id,
        order: 0,
      },
    },
    update: {},
    create: {
      pageId: homePage.id,
      order: 0,
      headline: 'Hello, I\'m John Doe',
      subheadline: 'Full Stack Developer',
      summary: 'I build beautiful, functional websites and applications with modern technologies.',
      ctaLabel: 'Contact Me',
      ctaLink: '#contact',
      resumeLinkLabel: 'View Resume',
      imageUrl: '/placeholder-profile.jpg',
    },
  })
  console.log('Hero component created:', hero.id)

  // Add experience entries
  const experience1 = await prisma.experienceComponent.upsert({
    where: {
      pageId_jobTitle_company_unique: {
        pageId: homePage.id,
        jobTitle: 'Senior Developer',
        company: 'Tech Corp',
      },
    },
    update: {},
    create: {
      pageId: homePage.id,
      order: 0,
      jobTitle: 'Senior Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: new Date('2020-01-01'),
      endDate: null, // Current job
      description: 'Leading development of web applications using React, Node.js, and GraphQL.',
    },
  })
  console.log('Experience 1 created:', experience1.id)

  const experience2 = await prisma.experienceComponent.upsert({
    where: {
      pageId_jobTitle_company_unique: {
        pageId: homePage.id,
        jobTitle: 'Full Stack Developer',
        company: 'StartupXYZ',
      },
    },
    update: {},
    create: {
      pageId: homePage.id,
      order: 1,
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      startDate: new Date('2018-03-01'),
      endDate: new Date('2019-12-31'),
      description: 'Built and maintained multiple web applications using React and Node.js.',
    },
  })
  console.log('Experience 2 created:', experience2.id)

  // Add education entries
  const education1 = await prisma.educationComponent.upsert({
    where: {
      pageId_institution_degree_unique: {
        pageId: homePage.id,
        institution: 'Stanford University',
        degree: 'Masters in Computer Science',
      },
    },
    update: {},
    create: {
      pageId: homePage.id,
      order: 0,
      institution: 'Stanford University',
      degree: 'Masters in Computer Science',
      startDate: new Date('2016-09-01'),
      endDate: new Date('2018-06-30'),
      description: 'Specialized in Artificial Intelligence and Machine Learning.',
    },
  })
  console.log('Education 1 created:', education1.id)

  // Add skill categories and skills
  const frontendCategory = await prisma.skillCategory.upsert({
    where: { name: 'Frontend' },
    update: {},
    create: {
      name: 'Frontend',
      order: 0,
    },
  })
  console.log('Frontend category created:', frontendCategory.id)

  const backendCategory = await prisma.skillCategory.upsert({
    where: { name: 'Backend' },
    update: {},
    create: {
      name: 'Backend',
      order: 1,
    },
  })
  console.log('Backend category created:', backendCategory.id)

  // Add skills
  const frontendSkills = [
    { name: 'React', order: 0 },
    { name: 'Next.js', order: 1 },
    { name: 'Tailwind CSS', order: 2 },
    { name: 'TypeScript', order: 3 },
  ]

  const backendSkills = [
    { name: 'Node.js', order: 0 },
    { name: 'Express', order: 1 },
    { name: 'Prisma', order: 2 },
    { name: 'PostgreSQL', order: 3 },
  ]

  // Create frontend skills
  for (const skill of frontendSkills) {
    await prisma.skill.upsert({
      where: {
        skillCategoryId_name_unique: {
          skillCategoryId: frontendCategory.id,
          name: skill.name,
        },
      },
      update: {},
      create: {
        skillCategoryId: frontendCategory.id,
        name: skill.name,
        order: skill.order,
      },
    })
    console.log(`Skill created: ${skill.name}`)
  }

  // Create backend skills
  for (const skill of backendSkills) {
    await prisma.skill.upsert({
      where: {
        skillCategoryId_name_unique: {
          skillCategoryId: backendCategory.id,
          name: skill.name,
        },
      },
      update: {},
      create: {
        skillCategoryId: backendCategory.id,
        name: skill.name,
        order: skill.order,
      },
    })
    console.log(`Skill created: ${skill.name}`)
  }

  console.log('Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  }) 