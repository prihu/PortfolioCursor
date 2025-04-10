const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  const adminEmail = 'admin@example.com'
  const adminPassword = 'password123' // Use environment variable in production!

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
  console.log(`Hashed password generated.`)

  // Upsert the admin user
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: hashedPassword,
    },
  })
  console.log(`Created/found user: ${user.email}`)

  // Upsert the default 'home' page
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Home Page',
      isPublished: true,
    },
  });
  console.log(`Created/found page: ${homePage.title} (slug: ${homePage.slug})`);

  // Upsert a default HeroComponent for the home page
  const hero = await prisma.heroComponent.upsert({
    where: { pageId_order: { pageId: homePage.id, order: 1 } }, // Assuming order=1, requires @@unique([pageId, order]) or use id
    // If no unique constraint on pageId_order, use findFirst + create/update or just create
    // Let's assume we just create one if it doesn't exist based on a simpler check or just always create/overwrite for seed.
    // Simpler approach for seed: Find or create based on pageId. If multiple exist, this might need refinement.

    // Let's find first, then create if needed (more robust seed)
    update: {
      // Define fields to update if found (optional, could be empty)
      headline: 'Priyank Garg',
      subheadline: 'Product Manager | Building Innovative Solutions',
      summary: 'Passionate about creating user-centric products that solve real-world problems. Experienced in leading cross-functional teams from ideation to launch.',
      imageUrl: '/placeholder-hero.jpg', // Corrected path
      ctaLabel: 'Get In Touch',
      ctaLink: '#contact',
      resumeLinkLabel: 'View My Resume',
      order: 1, // Ensure order is set
    },
    create: {
      pageId: homePage.id,
      order: 1,
      headline: 'Priyank Garg',
      subheadline: 'Product Manager | Building Innovative Solutions',
      summary: 'Passionate about creating user-centric products that solve real-world problems. Experienced in leading cross-functional teams from ideation to launch.',
      imageUrl: '/placeholder-hero.jpg', // Corrected path
      ctaLabel: 'Get In Touch',
      ctaLink: '#contact',
      resumeLinkLabel: 'View My Resume',
    },
  });
  console.log(`Upserted HeroComponent for pageId: ${homePage.id}`);

  // Upsert default ExperienceComponents for the home page
  // Experience 1
  await prisma.experienceComponent.upsert({
    // Use a combination that's unique or create a specific find/create logic
    // Using jobTitle and company might work for seeds if they are distinct enough
    where: {
      pageId_jobTitle_company_unique: { // Needs @@unique([pageId, jobTitle, company]) in schema
        pageId: homePage.id,
        jobTitle: 'Product Manager',
        company: 'Tech Solutions Inc.'
      }
    },
    update: { // Update fields if needed
      location: 'San Francisco, CA',
      startDate: new Date('2022-01-15'),
      endDate: null, // Current job
      description: 'Led product strategy and roadmap for the flagship SaaS product. Increased user engagement by 25% through new feature launches.',
      order: 10,
    },
    create: {
      pageId: homePage.id,
      order: 10,
      jobTitle: 'Product Manager',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: new Date('2022-01-15'),
      endDate: null, // Current job
      description: 'Led product strategy and roadmap for the flagship SaaS product. Increased user engagement by 25% through new feature launches.',
    },
  });
  console.log(`Upserted ExperienceComponent 1 for pageId: ${homePage.id}`);

  // Experience 2
  await prisma.experienceComponent.upsert({
    where: {
      pageId_jobTitle_company_unique: { // Needs @@unique([pageId, jobTitle, company]) in schema
        pageId: homePage.id,
        jobTitle: 'Associate Product Manager',
        company: 'Web Innovations LLC'
      }
    },
    update: {
      location: 'Remote',
      startDate: new Date('2020-06-01'),
      endDate: new Date('2021-12-31'),
      description: 'Supported product development lifecycle, conducted market research, and analyzed user feedback.',
      order: 20,
    },
    create: {
      pageId: homePage.id,
      order: 20,
      jobTitle: 'Associate Product Manager',
      company: 'Web Innovations LLC',
      location: 'Remote',
      startDate: new Date('2020-06-01'),
      endDate: new Date('2021-12-31'),
      description: 'Supported product development lifecycle, conducted market research, and analyzed user feedback.',
    },
  });
  console.log(`Upserted ExperienceComponent 2 for pageId: ${homePage.id}`);

  // --- Seed Education --- 
  await prisma.educationComponent.upsert({
    where: { 
        pageId_institution_degree_unique: {
            pageId: homePage.id,
            institution: 'University of Example',
            degree: 'M.S. in Computer Science'
        }
     },
    update: {},
    create: {
      pageId: homePage.id,
      order: 10,
      institution: 'University of Example',
      degree: 'M.S. in Computer Science',
      startDate: new Date('2018-09-01'),
      endDate: new Date('2020-05-15'),
      description: 'Focused on Human-Computer Interaction and Software Engineering.'
    }
  });
  console.log(`Upserted EducationComponent 1 for pageId: ${homePage.id}`);

  // --- Seed Skills --- 
  // Category 1: Frontend
  const frontendCategory = await prisma.skillCategory.upsert({
      where: { name: 'Frontend Development' },
      update: { order: 10 },
      create: { name: 'Frontend Development', order: 10 }
  });
  console.log(`Upserted Skill Category: ${frontendCategory.name}`);

  // Skills for Frontend
  const frontendSkills = ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Next.js', 'Tailwind CSS'];
  for (const [index, skillName] of frontendSkills.entries()) {
      await prisma.skill.upsert({
          where: { skillCategoryId_name_unique: { skillCategoryId: frontendCategory.id, name: skillName } },
          update: { order: (index + 1) * 10 },
          create: { name: skillName, order: (index + 1) * 10, skillCategoryId: frontendCategory.id }
      });
  }
  console.log(`Upserted Skills for ${frontendCategory.name}`);

  // Category 2: Backend
  const backendCategory = await prisma.skillCategory.upsert({
      where: { name: 'Backend Development' },
      update: { order: 20 },
      create: { name: 'Backend Development', order: 20 }
  });
    console.log(`Upserted Skill Category: ${backendCategory.name}`);

    // Skills for Backend
    const backendSkills = ['Node.js', 'Prisma', 'PostgreSQL', 'REST APIs', 'Authentication'];
    for (const [index, skillName] of backendSkills.entries()) {
        await prisma.skill.upsert({
            where: { skillCategoryId_name_unique: { skillCategoryId: backendCategory.id, name: skillName } },
            update: { order: (index + 1) * 10 },
            create: { name: skillName, order: (index + 1) * 10, skillCategoryId: backendCategory.id }
        });
    }
    console.log(`Upserted Skills for ${backendCategory.name}`);

    // Category 3: Tools & Concepts
    const toolsCategory = await prisma.skillCategory.upsert({
        where: { name: 'Tools & Concepts' },
        update: { order: 30 },
        create: { name: 'Tools & Concepts', order: 30 }
    });
    console.log(`Upserted Skill Category: ${toolsCategory.name}`);

    // Skills for Tools
    const toolsSkills = ['Git', 'Docker', 'Agile Methodologies', 'Product Management', 'Jira'];
     for (const [index, skillName] of toolsSkills.entries()) {
        await prisma.skill.upsert({
            where: { skillCategoryId_name_unique: { skillCategoryId: toolsCategory.id, name: skillName } },
            update: { order: (index + 1) * 10 },
            create: { name: skillName, order: (index + 1) * 10, skillCategoryId: toolsCategory.id }
        });
    }
     console.log(`Upserted Skills for ${toolsCategory.name}`);

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 