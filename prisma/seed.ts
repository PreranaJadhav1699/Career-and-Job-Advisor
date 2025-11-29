import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper function to generate recent dates
const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// Helper function to extract key role keywords from job title
const extractRoleKeywords = (title: string): string => {
  // Remove common prefixes and extract main role
  const keywords = title
    .replace(/^(Senior|Junior|Lead|Principal|Staff|Associate)\s+/i, '')
    .replace(/\s*-\s*.*$/, '') // Remove everything after dash
    .replace(/\s*,\s*.*$/, '') // Remove everything after comma
    .trim()
  
  // Map specific roles to more general search terms
  const roleMap: { [key: string]: string } = {
    'Software Engineer': 'Software Engineer',
    'Software Development Engineer': 'Software Engineer',
    'Full Stack Developer': 'Full Stack Developer',
    'Full Stack Engineer': 'Full Stack Developer',
    'Frontend Engineer': 'Frontend Developer',
    'Frontend Developer': 'Frontend Developer',
    'Backend Engineer': 'Backend Developer',
    'Backend Developer': 'Backend Developer',
    'Data Scientist': 'Data Scientist',
    'Machine Learning Engineer': 'Machine Learning Engineer',
    'ML Engineer': 'Machine Learning Engineer',
    'Product Manager': 'Product Manager',
    'Product Designer': 'Product Designer',
    'UX Designer': 'UX Designer',
    'DevOps Engineer': 'DevOps Engineer',
    'Site Reliability Engineer': 'SRE',
    'Security Engineer': 'Security Engineer',
    'iOS Engineer': 'iOS Developer',
    'iOS Developer': 'iOS Developer',
    'Android Engineer': 'Android Developer',
    'Android Developer': 'Android Developer',
    'React Native Developer': 'React Native Developer',
    'Mobile Engineer': 'Mobile Developer',
    'Data Engineer': 'Data Engineer',
    'Cloud Engineer': 'Cloud Engineer',
    'Platform Engineer': 'Platform Engineer',
    'QA Engineer': 'QA Engineer',
    'Solutions Architect': 'Solutions Architect',
    'Technical Writer': 'Technical Writer',
    'Engineering Manager': 'Engineering Manager',
    'Research Scientist': 'Research Scientist',
    'Computer Vision Engineer': 'Computer Vision',
    'Blockchain Engineer': 'Blockchain Developer',
    'Game Developer': 'Game Developer',
    'Embedded Systems Engineer': 'Embedded Systems',
    'Quantitative Analyst': 'Quantitative Analyst',
    'Cybersecurity Engineer': 'Cybersecurity',
    'Applied Scientist': 'Applied Scientist',
    'Technical Program Manager': 'Program Manager'
  }
  
  // Try to find a mapped role, otherwise use the cleaned keyword
  for (const [key, value] of Object.entries(roleMap)) {
    if (keywords.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  
  return keywords || 'Software Engineer'
}

// Helper function to generate LinkedIn job search URL for specific job
const getLinkedInJobUrl = (title: string, company: string, location?: string) => {
  // Extract simplified role keywords for better matching
  const roleKeywords = extractRoleKeywords(title)
  // Search by company and role - this will find jobs at the company matching the role
  const searchQuery = encodeURIComponent(`${company} ${roleKeywords}`)
  const locationParam = location ? `&location=${encodeURIComponent(location)}` : ''
  // Use 30 days time period to show more results (instead of 1 day)
  return `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}${locationParam}&f_TPR=r2592000`
}

// Helper function to generate Indeed job search URL for specific job
const getIndeedJobUrl = (title: string, company: string, location?: string) => {
  const searchQuery = encodeURIComponent(`${title} ${company}`)
  const locationParam = location ? `&l=${encodeURIComponent(location)}` : ''
  return `https://www.indeed.com/jobs?q=${searchQuery}${locationParam}&fromage=1`
}

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  })

  console.log('✅ Created demo user')

  // Create demo profile
  await prisma.profile.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      title: 'Senior Software Engineer',
      summary: 'Experienced software engineer with expertise in full-stack development, cloud technologies, and team leadership.',
      experience: 5,
      location: 'San Francisco, CA',
      phone: '+1 (555) 123-4567',
      linkedin: 'https://linkedin.com/in/demouser',
      github: 'https://github.com/demouser',
      careerGoals: 'Looking to advance to a technical leadership role in a growing company.',
      skills: JSON.stringify([
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes',
        'PostgreSQL', 'MongoDB', 'Git', 'Agile', 'Team Leadership', 'Project Management'
      ]),
      education: JSON.stringify([
        {
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of California, Berkeley',
          year: '2018',
          gpa: '3.8'
        }
      ]),
      workHistory: JSON.stringify([
        {
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          startDate: '2021-01',
          endDate: 'Present',
          description: 'Led development of microservices architecture and mentored junior developers.'
        },
        {
          title: 'Software Engineer',
          company: 'StartupXYZ',
          startDate: '2019-06',
          endDate: '2020-12',
          description: 'Developed full-stack web applications using React and Node.js.'
        }
      ])
    },
  })

  console.log('✅ Created demo profile')

  // Comprehensive job listings (100+ jobs)
  const sampleJobs = [
    // Software Engineering Roles (Recent - Last 7 days)
    {
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Join Google as a Senior Software Engineer and work on cutting-edge technologies that impact billions of users worldwide. You\'ll be part of a team that builds scalable systems and innovative products.',
      requirements: 'Bachelor\'s degree in Computer Science or related field, 5+ years of software development experience, proficiency in one or more programming languages (Java, C++, Python, Go), experience with distributed systems.',
      salary: '$180,000 - $250,000',
      remote: true,
      postedAt: daysAgo(1),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Senior Software Engineer', 'Google', 'Mountain View, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Full Stack Developer',
      company: 'Meta',
      location: 'Menlo Park, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Build the next generation of social experiences at Meta. Work on React, React Native, and other cutting-edge frontend technologies to create engaging user interfaces.',
      requirements: '3+ years of full-stack development experience, expertise in JavaScript, React, Node.js, and modern web technologies, experience with mobile development preferred.',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(1),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Full Stack Developer', 'Meta', 'Menlo Park, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Frontend Engineer',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Create beautiful and intuitive user experiences for millions of travelers and hosts worldwide. Work with React, TypeScript, and modern frontend technologies.',
      requirements: '4+ years frontend experience, expert in React, TypeScript, CSS, experience with design systems and accessibility.',
      salary: '$160,000 - $210,000',
      remote: true,
      postedAt: daysAgo(2),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Frontend Engineer', 'Airbnb', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Backend Engineer',
      company: 'Stripe',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Build the financial infrastructure for the internet. Work on Stripe\'s payment processing systems and APIs that power millions of businesses worldwide.',
      requirements: '3+ years of backend development experience, proficiency in Ruby, Python, or Go, experience with distributed systems and APIs, strong problem-solving skills.',
      salary: '$160,000 - $210,000',
      remote: true,
      postedAt: daysAgo(2),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Backend Engineer', 'Stripe', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Software Development Engineer',
      company: 'Amazon',
      location: 'Seattle, WA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Join Amazon\'s engineering team and help build the future of e-commerce and cloud computing. Work on AWS services, Alexa, or other innovative products.',
      requirements: 'Bachelor\'s degree in Computer Science, 3+ years of software development experience, strong problem-solving skills, experience with distributed systems.',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(3),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Software Development Engineer', 'Amazon', 'Seattle, WA'),
      source: 'LinkedIn'
    },
    {
      title: 'Software Engineer II',
      company: 'Microsoft',
      location: 'Redmond, WA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Work on Microsoft\'s Azure cloud platform and develop features that empower organizations worldwide.',
      requirements: '2-5 years software development experience, proficiency in C#, .NET, Azure, strong CS fundamentals.',
      salary: '$130,000 - $180,000',
      remote: true,
      postedAt: daysAgo(3),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Software Engineer II', 'Microsoft', 'Redmond, WA'),
      source: 'LinkedIn'
    },
    {
      title: 'Software Engineer',
      company: 'Apple',
      location: 'Cupertino, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Join Apple and work on products that millions of people use every day. Build innovative features for iOS, macOS, watchOS, or tvOS.',
      requirements: 'BS in Computer Science, 3+ years experience, strong programming skills in Swift, Objective-C, or C++.',
      salary: '$150,000 - $200,000',
      remote: false,
      postedAt: daysAgo(4),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Software Engineer', 'Apple', 'Cupertino, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Full Stack Software Engineer',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Help Netflix deliver entertainment to millions of members worldwide. Work on streaming technology, content discovery, and personalization.',
      requirements: '5+ years full-stack experience, expertise in Java, Node.js, React, microservices architecture.',
      salary: '$170,000 - $230,000',
      remote: true,
      postedAt: daysAgo(4),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Full Stack Software Engineer', 'Netflix', 'Los Gatos, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Software Engineer, Infrastructure',
      company: 'Uber',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Build and scale the infrastructure that powers Uber\'s global platform. Work on distributed systems, microservices, and cloud technologies.',
      requirements: '4+ years experience, expertise in Go, Python, or Java, strong systems design skills, experience with Kubernetes and Docker.',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(5),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Software Engineer, Infrastructure', 'Uber', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Software Engineer',
      company: 'LinkedIn',
      location: 'Sunnyvale, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Join LinkedIn\'s engineering team to build features that connect professionals worldwide. Work on scalable systems that power the world\'s largest professional network.',
      requirements: 'Bachelor\'s degree in Computer Science, 2+ years of software development experience, proficiency in Java, Python, or JavaScript.',
      salary: '$130,000 - $180,000',
      remote: true,
      postedAt: daysAgo(5),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Software Engineer', 'LinkedIn', 'Sunnyvale, CA'),
      source: 'LinkedIn'
    },

    // Data Science & ML (Last 7-14 days)
    {
      title: 'Data Scientist',
      company: 'Spotify',
      location: 'New York, NY',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Use data to shape the future of music streaming. Work on personalization, recommendations, and analytics that impact millions of users.',
      requirements: 'Master\'s or PhD in quantitative field, 3+ years experience, expertise in Python, R, SQL, machine learning, A/B testing.',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(6),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Data Scientist', 'Spotify', 'New York, NY'),
      source: 'LinkedIn'
    },
    {
      title: 'Machine Learning Engineer',
      company: 'Tesla',
      location: 'Palo Alto, CA',
      type: 'Full-time',
      industry: 'Automotive',
      description: 'Work on Tesla\'s Autopilot and AI systems. Develop machine learning models for autonomous driving and other cutting-edge applications.',
      requirements: 'Master\'s or PhD in Computer Science, 3+ years of ML experience, expertise in Python, TensorFlow, PyTorch, computer vision.',
      salary: '$180,000 - $250,000',
      remote: false,
      postedAt: daysAgo(7),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Machine Learning Engineer', 'Tesla', 'Palo Alto, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Senior Data Scientist',
      company: 'Twitter',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Drive insights from billions of tweets and user interactions. Work on ML models, recommendation systems, and product analytics.',
      requirements: 'PhD or Master\'s in Statistics/CS, 5+ years experience, expert in Python, SQL, machine learning, causal inference.',
      salary: '$160,000 - $220,000',
      remote: true,
      postedAt: daysAgo(8),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Senior Data Scientist', 'Twitter', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Machine Learning Scientist',
      company: 'OpenAI',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Research and develop cutting-edge AI systems. Work on large language models, reinforcement learning, and AGI safety.',
      requirements: 'PhD in CS/ML/Math, strong publication record, expertise in deep learning, PyTorch, transformers.',
      salary: '$200,000 - $300,000',
      remote: true,
      postedAt: daysAgo(9),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Machine Learning Scientist', 'OpenAI', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Data Engineer',
      company: 'Snowflake',
      location: 'San Mateo, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Build data pipelines and infrastructure for the Data Cloud. Work with big data technologies and cloud platforms.',
      requirements: '3+ years data engineering, proficiency in SQL, Python, Spark, Airflow, experience with AWS/Azure/GCP.',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(10),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Data Engineer', 'Snowflake', 'San Mateo, CA'),
      source: 'LinkedIn'
    },

    // Product & Design (Last 7-14 days)
    {
      title: 'Product Manager',
      company: 'Salesforce',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Lead product strategy for Salesforce\'s CRM platform. Work with engineering, design, and sales teams to deliver products that empower businesses.',
      requirements: '5+ years product management, technical background, strong analytical skills, experience with B2B SaaS.',
      salary: '$160,000 - $220,000',
      remote: true,
      postedAt: daysAgo(6),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Product Manager', 'Salesforce', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Senior Product Designer',
      company: 'Figma',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Design the future of design tools. Create intuitive user experiences for Figma\'s collaborative design platform.',
      requirements: '5+ years product design experience, strong portfolio, expertise in Figma, prototyping, design systems.',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(7),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Senior Product Designer', 'Figma', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'UX Designer',
      company: 'Adobe',
      location: 'San Jose, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Design user experiences for Adobe\'s Creative Cloud suite. Work on tools used by millions of creative professionals worldwide.',
      requirements: '3+ years UX design, strong portfolio, proficiency in design tools, user research experience.',
      salary: '$130,000 - $180,000',
      remote: true,
      postedAt: daysAgo(8),
      isActive: true,
      externalUrl: getLinkedInJobUrl('UX Designer', 'Adobe', 'San Jose, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Technical Product Manager',
      company: 'Atlassian',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Drive product development for Jira, Confluence, or other Atlassian products. Work with distributed engineering teams.',
      requirements: '4+ years product management, technical background, experience with developer tools, Agile methodology.',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(9),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Technical Product Manager', 'Atlassian', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Product Manager, AI',
      company: 'Notion',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Lead AI product development at Notion. Integrate AI capabilities into the collaborative workspace platform.',
      requirements: '5+ years PM experience, understanding of AI/ML, strong technical background, startup experience preferred.',
      salary: '$170,000 - $230,000',
      remote: true,
      postedAt: daysAgo(10),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Product Manager, AI', 'Notion', 'San Francisco, CA'),
      source: 'LinkedIn'
    },

    // DevOps & Infrastructure (Last 14-21 days)
    {
      title: 'DevOps Engineer',
      company: 'GitLab',
      location: 'Remote',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Build and maintain CI/CD infrastructure for GitLab\'s platform. Work on Kubernetes, Docker, and cloud technologies.',
      requirements: '3+ years DevOps experience, expertise in Kubernetes, Docker, GitLab CI, cloud platforms (AWS/GCP/Azure).',
      salary: '$130,000 - $180,000',
      remote: true,
      postedAt: daysAgo(14),
      isActive: true,
      externalUrl: getLinkedInJobUrl('DevOps Engineer', 'GitLab', 'Remote'),
      source: 'LinkedIn'
    },
    {
      title: 'Site Reliability Engineer',
      company: 'Datadog',
      location: 'New York, NY',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Ensure reliability and performance of Datadog\'s monitoring platform. Work on distributed systems and cloud infrastructure.',
      requirements: '4+ years SRE/DevOps experience, strong Linux skills, experience with monitoring, Python/Go programming.',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(15),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Site Reliability Engineer', 'Datadog', 'New York, NY'),
      source: 'LinkedIn'
    },
    {
      title: 'Cloud Engineer',
      company: 'HashiCorp',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Work on cloud infrastructure products like Terraform, Vault, and Consul. Help companies manage their cloud infrastructure.',
      requirements: '3+ years cloud engineering, expertise in AWS/Azure/GCP, Terraform, infrastructure as code.',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(16),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Cloud Engineer', 'HashiCorp', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Platform Engineer',
      company: 'Twilio',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Build platform infrastructure for Twilio\'s communication APIs. Work on scalable systems serving billions of API requests.',
      requirements: '4+ years platform engineering, experience with microservices, Kubernetes, cloud platforms, strong coding skills.',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(17),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Platform Engineer', 'Twilio', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Security Engineer',
      company: 'Cloudflare',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Protect the internet. Work on security systems that defend millions of websites from attacks.',
      requirements: '3+ years security engineering, expertise in network security, cryptography, threat detection.',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(18),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Security Engineer', 'Cloudflare', 'San Francisco, CA'),
      source: 'LinkedIn'
    },

    // Mobile Development (Last 14-21 days)
    {
      title: 'iOS Engineer',
      company: 'Instagram',
      location: 'Menlo Park, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Build features for Instagram\'s iOS app used by billions of people worldwide. Work on Swift, camera features, and performance optimization.',
      requirements: '3+ years iOS development, expert in Swift, UIKit, experience with camera/video features, strong CS fundamentals.',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(14),
      isActive: true,
      externalUrl: getLinkedInJobUrl('iOS Engineer', 'Instagram', 'Menlo Park, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Android Engineer',
      company: 'Snapchat',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Develop innovative mobile experiences for Snapchat. Work on Android, Kotlin, AR features, and camera technology.',
      requirements: '4+ years Android development, expertise in Kotlin, Java, Android SDK, experience with AR/camera features preferred.',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(15),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Android Engineer', 'Snapchat', 'Los Angeles, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'React Native Developer',
      company: 'Discord',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Build cross-platform mobile features for Discord\'s communication platform. Work on React Native, real-time messaging, voice/video.',
      requirements: '3+ years React Native experience, strong JavaScript/TypeScript skills, mobile performance optimization.',
      salary: '$130,000 - $180,000',
      remote: true,
      postedAt: daysAgo(16),
      isActive: true,
      externalUrl: getLinkedInJobUrl('React Native Developer', 'Discord', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Mobile Engineer',
      company: 'DoorDash',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Build mobile apps for DoorDash\'s delivery platform. Work on iOS, Android, or cross-platform development.',
      requirements: '3+ years mobile development, iOS (Swift) or Android (Kotlin) expertise, experience with maps and location services.',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(17),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Mobile Engineer', 'DoorDash', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'iOS Developer',
      company: 'Duolingo',
      location: 'Pittsburgh, PA',
      type: 'Full-time',
      industry: 'Education Technology',
      description: 'Create engaging learning experiences in Duolingo\'s iOS app. Work on gamification, animations, and educational features.',
      requirements: '3+ years iOS development, Swift expertise, passion for education, experience with animations and UI/UX.',
      salary: '$120,000 - $170,000',
      remote: true,
      postedAt: daysAgo(18),
      isActive: true,
      externalUrl: getLinkedInJobUrl('iOS Developer', 'Duolingo', 'Pittsburgh, PA'),
      source: 'LinkedIn'
    },

    // Additional roles across industries (Last 21-30 days)
    {
      title: 'Backend Software Engineer',
      company: 'Shopify',
      location: 'Ottawa, ON',
      type: 'Full-time',
      industry: 'E-commerce',
      description: 'Build scalable backend systems for Shopify\'s e-commerce platform. Work with Ruby, Rails, and distributed systems.',
      requirements: '3+ years backend experience, proficiency in Ruby on Rails, experience with high-scale systems.',
      salary: '$110,000 - $160,000',
      remote: true,
      postedAt: daysAgo(21),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Backend Software Engineer', 'Shopify', 'Ottawa, ON'),
      source: 'LinkedIn'
    },
    {
      title: 'Software Engineer, Search',
      company: 'DuckDuckGo',
      location: 'Remote',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Help build the best privacy-focused search engine. Work on search algorithms, ranking, and backend systems.',
      requirements: '4+ years software engineering, experience with search/IR, strong programming skills, passion for privacy.',
      salary: '$130,000 - $180,000',
      remote: true,
      postedAt: daysAgo(22),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Software Engineer, Search', 'DuckDuckGo', 'Remote'),
      source: 'LinkedIn'
    },
    {
      title: 'Full Stack Engineer',
      company: 'Zapier',
      location: 'Remote',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Build automation platform that connects 5000+ apps. Work on integrations, workflows, and user experience.',
      requirements: '3+ years full-stack experience, Python, JavaScript, React, API development experience.',
      salary: '$120,000 - $170,000',
      remote: true,
      postedAt: daysAgo(23),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Full Stack Engineer', 'Zapier', 'Remote'),
      source: 'LinkedIn'
    },
    {
      title: 'Software Engineer',
      company: 'Slack',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Build features for Slack\'s team collaboration platform. Work on real-time messaging, integrations, and enterprise features.',
      requirements: '3+ years software engineering, experience with distributed systems, strong coding skills in Java, Go, or Python.',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(24),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Software Engineer', 'Slack', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Data Analyst',
      company: 'Lyft',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Transportation',
      description: 'Analyze data to improve Lyft\'s ride-sharing platform. Work on business intelligence, metrics, and product analytics.',
      requirements: '2+ years data analysis, proficiency in SQL, Python, data visualization tools, strong statistical skills.',
      salary: '$100,000 - $140,000',
      remote: true,
      postedAt: daysAgo(25),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Data Analyst', 'Lyft', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Frontend Developer',
      company: 'Canva',
      location: 'Sydney, Australia',
      type: 'Full-time',
      industry: 'Design Software',
      description: 'Build intuitive design tools for Canva\'s graphic design platform. Work with React, TypeScript, and WebGL.',
      requirements: '3+ years frontend development, expert in React, TypeScript, experience with canvas/graphics programming preferred.',
      salary: '$90,000 - $130,000 AUD',
      remote: true,
      postedAt: daysAgo(26),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Frontend Developer', 'Canva', 'Sydney, Australia'),
      source: 'LinkedIn'
    },
    {
      title: 'Software Engineer, Infrastructure',
      company: 'Square',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Fintech',
      description: 'Build infrastructure for Square\'s payment platform. Work on distributed systems, microservices, and cloud technologies.',
      requirements: '4+ years infrastructure engineering, expertise in distributed systems, Kubernetes, cloud platforms.',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(27),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Software Engineer, Infrastructure', 'Square', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'QA Engineer',
      company: 'Zoom',
      location: 'San Jose, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Ensure quality of Zoom\'s video conferencing platform. Develop test automation and quality processes.',
      requirements: '3+ years QA experience, test automation expertise, experience with Selenium, API testing.',
      salary: '$110,000 - $150,000',
      remote: true,
      postedAt: daysAgo(28),
      isActive: true,
      externalUrl: getLinkedInJobUrl('QA Engineer', 'Zoom', 'San Jose, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Technical Writer',
      company: 'MongoDB',
      location: 'Remote',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Create technical documentation for MongoDB database products. Write guides, tutorials, and API documentation.',
      requirements: '3+ years technical writing, strong understanding of databases, experience with developer documentation.',
      salary: '$90,000 - $130,000',
      remote: true,
      postedAt: daysAgo(29),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Technical Writer', 'MongoDB', 'Remote'),
      source: 'LinkedIn'
    },
    {
      title: 'Solutions Architect',
      company: 'Databricks',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Help enterprises adopt Databricks\' data and AI platform. Provide technical guidance and solution design.',
      requirements: '5+ years in solutions architecture, expertise in big data, Spark, cloud platforms, strong communication skills.',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(30),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Solutions Architect', 'Databricks', 'San Francisco, CA'),
      source: 'LinkedIn'
    },

    // ADDITIONAL 80+ JOBS - Posted in last 7 days for freshness
    // TODAY'S NEW JOBS (Posted within last 24 hours)
    {
      title: 'Senior Full Stack Engineer',
      company: 'Stripe',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Fintech',
      description: 'Build the future of online payments at Stripe. Work on core payment infrastructure serving millions of businesses worldwide.',
      requirements: '5+ years full-stack experience, expert in React, Node.js, TypeScript, distributed systems, payment systems knowledge',
      salary: '$170,000 - $240,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Senior Full Stack Engineer', 'Stripe', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Product Manager - AI Platform',
      company: 'OpenAI',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Artificial Intelligence',
      description: 'Shape the future of AI products. Lead development of next-generation AI applications that empower developers and businesses.',
      requirements: '5+ years PM experience, technical background in AI/ML, experience with developer products, strong analytical skills',
      salary: '$200,000 - $300,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Product Manager - AI Platform', 'OpenAI', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'DevOps Engineer',
      company: 'Cloudflare',
      location: 'Austin, TX',
      type: 'Full-time',
      industry: 'Cloud Infrastructure',
      description: 'Build and scale infrastructure that powers 20% of the internet. Work with cutting-edge networking and security technology.',
      requirements: '4+ years DevOps, expert in Kubernetes, Terraform, CI/CD pipelines, strong Linux and networking skills',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('DevOps Engineer', 'Cloudflare', 'Austin, TX'),
      source: 'LinkedIn'
    },
    {
      title: 'Frontend Engineer - React',
      company: 'Vercel',
      location: 'Remote',
      type: 'Full-time',
      industry: 'Developer Tools',
      description: 'Build the platform that powers Next.js and modern web development. Shape developer experience for millions of developers.',
      requirements: '3+ years React, TypeScript, Next.js, passion for performance and developer experience, open source contributions',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Frontend Engineer - React', 'Vercel', 'Remote'),
      source: 'LinkedIn'
    },
    {
      title: 'Machine Learning Engineer',
      company: 'Anthropic',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'AI Research',
      description: 'Research and develop safe, beneficial AI systems. Work on frontier AI models and AI safety research.',
      requirements: 'PhD or Master in CS/ML, strong publication record, PyTorch/JAX expertise, research experience in NLP or RL',
      salary: '$200,000 - $300,000',
      remote: false,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Machine Learning Engineer', 'Anthropic', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Senior iOS Developer',
      company: 'Robinhood',
      location: 'Menlo Park, CA',
      type: 'Full-time',
      industry: 'Fintech',
      description: 'Build mobile trading experiences for millions of investors. Create intuitive, fast, and reliable iOS applications for financial markets.',
      requirements: '5+ years iOS development, expert in Swift, SwiftUI, strong CS fundamentals, fintech experience preferred',
      salary: '$160,000 - $220,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Senior iOS Developer', 'Robinhood', 'Menlo Park, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Data Scientist - Product Analytics',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Travel Technology',
      description: 'Use data to improve travel experiences for millions of hosts and guests. Build models and insights that drive product decisions.',
      requirements: 'Master/PhD in quantitative field, 4+ years experience, Python, SQL, ML frameworks, A/B testing expertise',
      salary: '$155,000 - $210,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Data Scientist - Product Analytics', 'Airbnb', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Backend Engineer - Platform',
      company: 'Discord',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Social Technology',
      description: 'Build scalable backend systems for 150+ million monthly active users. Work on real-time messaging and voice infrastructure.',
      requirements: '3+ years backend development, Python/Go/Rust, distributed systems, database and cache optimization expertise',
      salary: '$145,000 - $195,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Backend Engineer - Platform', 'Discord', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Security Engineer - Cloud',
      company: 'Wiz',
      location: 'New York, NY',
      type: 'Full-time',
      industry: 'Cybersecurity',
      description: 'Protect cloud infrastructure for Fortune 500 companies. Build cutting-edge cloud security products and services.',
      requirements: '3+ years security engineering, deep knowledge of AWS/Azure/GCP security, threat modeling, penetration testing',
      salary: '$150,000 - $210,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Security Engineer - Cloud', 'Wiz', 'New York, NY'),
      source: 'LinkedIn'
    },
    {
      title: 'Full Stack Developer',
      company: 'Notion',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Productivity Software',
      description: 'Build the all-in-one workspace trusted by millions of users. Create features that help individuals and teams collaborate better.',
      requirements: '3+ years full-stack, React, Node.js, TypeScript, databases, strong product sense and design skills',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Full Stack Developer', 'Notion', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Staff Software Engineer',
      company: 'Plaid',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Fintech',
      description: 'Build financial data infrastructure connecting apps to banks. Lead technical initiatives across the platform.',
      requirements: '8+ years experience, expert in distributed systems, API design, mentorship skills, fintech domain knowledge',
      salary: '$200,000 - $280,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Staff Software Engineer', 'Plaid', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Principal Engineer - Infrastructure',
      company: 'Roblox',
      location: 'San Mateo, CA',
      type: 'Full-time',
      industry: 'Gaming',
      description: 'Build infrastructure for the metaverse. Scale systems supporting millions of concurrent users and game creators.',
      requirements: '10+ years experience, deep expertise in distributed systems, capacity planning, technical leadership',
      salary: '$250,000 - $350,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Principal Engineer - Infrastructure', 'Roblox', 'San Mateo, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Engineering Manager - Web Platform',
      company: 'Figma',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Design Tools',
      description: 'Lead a team building the collaborative design platform used by millions. Mentor engineers and drive technical strategy.',
      requirements: '5+ years engineering + 2+ years management, strong technical background in web technologies, leadership skills',
      salary: '$180,000 - $250,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Engineering Manager - Web Platform', 'Figma', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Site Reliability Engineer',
      company: 'Coinbase',
      location: 'Remote',
      type: 'Full-time',
      industry: 'Cryptocurrency',
      description: 'Ensure reliability and performance of crypto trading platform. Build monitoring, automation, and incident response systems.',
      requirements: '4+ years SRE/DevOps, Kubernetes, observability tools, incident management, financial systems experience preferred',
      salary: '$150,000 - $210,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Site Reliability Engineer', 'Coinbase', 'Remote'),
      source: 'LinkedIn'
    },
    {
      title: 'Android Engineer',
      company: 'Instacart',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'E-commerce',
      description: 'Build Android app for grocery delivery serving millions. Work on real-time tracking, payments, and shopping features.',
      requirements: '4+ years Android development, Kotlin expertise, Jetpack Compose, strong UX sense, e-commerce experience',
      salary: '$145,000 - $200,000',
      remote: true,
      postedAt: daysAgo(0),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Android Engineer', 'Instacart', 'San Francisco, CA'),
      source: 'LinkedIn'
    },

    // YESTERDAY'S JOBS
    {
      title: 'Software Engineer - Infrastructure',
      company: 'Datadog',
      location: 'New York, NY',
      type: 'Full-time',
      industry: 'Monitoring',
      description: 'Build the monitoring and observability platform trusted by thousands of companies. Work on data pipelines processing trillions of events.',
      requirements: '3+ years software engineering, Go/Java/Python, distributed systems, time-series databases',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(1),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Software Engineer - Infrastructure', 'Datadog', 'New York, NY'),
      source: 'LinkedIn'
    },
    {
      title: 'UX Designer - Product',
      company: 'Figma',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Design Tools',
      description: 'Design the future of collaborative design tools. Create intuitive experiences for designers and product teams.',
      requirements: '4+ years UX design, strong portfolio, Figma expertise, experience designing design tools, systems thinking',
      salary: '$130,000 - $180,000',
      remote: true,
      postedAt: daysAgo(1),
      isActive: true,
      externalUrl: getLinkedInJobUrl('UX Designer - Product', 'Figma', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Research Scientist - Robotics',
      company: 'Boston Dynamics',
      location: 'Waltham, MA',
      type: 'Full-time',
      industry: 'Robotics',
      description: 'Advance the state of the art in robotics. Work on perception, planning, and control for legged and wheeled robots.',
      requirements: 'PhD in Robotics/CS/EE, publication record, experience with ROS, motion planning, real robot deployment',
      salary: '$160,000 - $220,000',
      remote: false,
      postedAt: daysAgo(1),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Research Scientist - Robotics', 'Boston Dynamics', 'Waltham, MA'),
      source: 'LinkedIn'
    },
    {
      title: 'Computer Vision Engineer',
      company: 'Tesla',
      location: 'Palo Alto, CA',
      type: 'Full-time',
      industry: 'Automotive',
      description: 'Develop computer vision systems for autonomous driving. Work on perception, object detection, and 3D reconstruction.',
      requirements: '3+ years computer vision, deep learning (PyTorch/TensorFlow), C++, real-time systems, autonomous vehicles experience',
      salary: '$150,000 - $210,000',
      remote: false,
      postedAt: daysAgo(1),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Computer Vision Engineer', 'Tesla', 'Palo Alto, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Blockchain Engineer',
      company: 'a16z Crypto',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Cryptocurrency',
      description: 'Build decentralized applications and protocols. Work on smart contracts, layer 2 solutions, and Web3 infrastructure.',
      requirements: '3+ years blockchain development, Solidity/Rust, experience with Ethereum/Solana, cryptography knowledge',
      salary: '$160,000 - $240,000',
      remote: true,
      postedAt: daysAgo(1),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Blockchain Engineer', 'a16z Crypto', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Growth Engineer',
      company: 'Dropbox',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Cloud Storage',
      description: 'Drive user acquisition and activation through data-driven experiments. Build growth features and optimize funnels.',
      requirements: '3+ years full-stack, strong product sense, A/B testing expertise, analytics, Python/JavaScript',
      salary: '$135,000 - $185,000',
      remote: true,
      postedAt: daysAgo(1),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Growth Engineer', 'Dropbox', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Technical Writer - Developer Docs',
      company: 'Twilio',
      location: 'Remote',
      type: 'Full-time',
      industry: 'Communications',
      description: 'Create world-class documentation for developer APIs. Help millions of developers integrate Twilio services.',
      requirements: '3+ years technical writing, software engineering background, API documentation, excellent communication',
      salary: '$100,000 - $140,000',
      remote: true,
      postedAt: daysAgo(1),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Technical Writer - Developer Docs', 'Twilio', 'Remote'),
      source: 'LinkedIn'
    },

    // 2-3 DAYS AGO
    {
      title: 'Solutions Architect',
      company: 'MongoDB',
      location: 'New York, NY',
      type: 'Full-time',
      industry: 'Database',
      description: 'Help enterprises adopt MongoDB. Design database architectures and provide technical guidance to customers.',
      requirements: '5+ years solutions architecture, database expertise, cloud platforms, excellent communication and presentation skills',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(2),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Solutions Architect', 'MongoDB', 'New York, NY'),
      source: 'LinkedIn'
    },
    {
      title: 'Game Developer - Unity',
      company: 'Niantic',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Gaming',
      description: 'Build AR games like Pokémon GO. Create engaging gameplay and real-world experiences using location technology.',
      requirements: '4+ years game development, Unity expertise, C#, AR/VR experience, passion for gaming and real-world exploration',
      salary: '$130,000 - $180,000',
      remote: true,
      postedAt: daysAgo(2),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Game Developer - Unity', 'Niantic', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Embedded Systems Engineer',
      company: 'Rivian',
      location: 'Irvine, CA',
      type: 'Full-time',
      industry: 'Automotive',
      description: 'Develop embedded systems for electric vehicles. Work on vehicle controls, infotainment, and battery management.',
      requirements: '4+ years embedded C/C++, RTOS, CAN bus, automotive standards (ISO 26262), hardware-software integration',
      salary: '$130,000 - $180,000',
      remote: false,
      postedAt: daysAgo(2),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Embedded Systems Engineer', 'Rivian', 'Irvine, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Quantitative Analyst',
      company: 'Jane Street',
      location: 'New York, NY',
      type: 'Full-time',
      industry: 'Finance',
      description: 'Apply quantitative methods to trading strategies. Work on market microstructure, risk management, and alpha research.',
      requirements: 'Master/PhD in quantitative field, strong programming (OCaml/Python), statistics/ML knowledge, finance interest',
      salary: '$200,000 - $400,000',
      remote: false,
      postedAt: daysAgo(2),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Quantitative Analyst', 'Jane Street', 'New York, NY'),
      source: 'LinkedIn'
    },
    {
      title: 'Data Engineer - Analytics',
      company: 'Spotify',
      location: 'New York, NY',
      type: 'Full-time',
      industry: 'Music Streaming',
      description: 'Build data pipelines for music recommendations. Process and analyze billions of streaming events to improve user experience.',
      requirements: '3+ years data engineering, Spark/Airflow, SQL, Python/Scala, experience with streaming data and large datasets',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(2),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Data Engineer - Analytics', 'Spotify', 'New York, NY'),
      source: 'LinkedIn'
    },

    // 3-4 DAYS AGO
    {
      title: 'Product Designer',
      company: 'Linear',
      location: 'Remote',
      type: 'Full-time',
      industry: 'Productivity Software',
      description: 'Design the project management tool beloved by high-performing teams. Create polished, intuitive interfaces.',
      requirements: '4+ years product design, strong portfolio, Figma expert, experience with B2B SaaS, attention to detail',
      salary: '$120,000 - $170,000',
      remote: true,
      postedAt: daysAgo(3),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Product Designer', 'Linear', 'Remote'),
      source: 'LinkedIn'
    },
    {
      title: 'ML Research Engineer',
      company: 'Hugging Face',
      location: 'Remote',
      type: 'Full-time',
      industry: 'AI/ML',
      description: 'Advance open-source AI. Work on transformers, LLMs, and democratizing machine learning for everyone.',
      requirements: 'MS/PhD in ML/CS, strong publication record, PyTorch/TensorFlow, NLP expertise, open source contributions',
      salary: '$150,000 - $220,000',
      remote: true,
      postedAt: daysAgo(3),
      isActive: true,
      externalUrl: getLinkedInJobUrl('ML Research Engineer', 'Hugging Face', 'Remote'),
      source: 'LinkedIn'
    },
    {
      title: 'Cloud Engineer - AWS',
      company: 'HashiCorp',
      location: 'Remote',
      type: 'Full-time',
      industry: 'Cloud Infrastructure',
      description: 'Build multi-cloud infrastructure tools. Work on Terraform, Vault, and cloud automation products.',
      requirements: '4+ years cloud engineering, AWS/Azure/GCP, infrastructure as code, Go programming, distributed systems',
      salary: '$140,000 - $190,000',
      remote: true,
      postedAt: daysAgo(3),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Cloud Engineer - AWS', 'HashiCorp', 'Remote'),
      source: 'LinkedIn'
    },
    {
      title: 'Frontend Engineer - Design Systems',
      company: 'GitHub',
      location: 'Remote',
      type: 'Full-time',
      industry: 'Developer Tools',
      description: 'Build and maintain GitHub\'s design system. Create reusable components used by millions of developers.',
      requirements: '4+ years frontend, React/TypeScript, design systems experience, accessibility expertise, component library development',
      salary: '$135,000 - $185,000',
      remote: true,
      postedAt: daysAgo(3),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Frontend Engineer - Design Systems', 'GitHub', 'Remote'),
      source: 'LinkedIn'
    },

    // 4-5 DAYS AGO
    {
      title: 'Staff Data Scientist',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      type: 'Full-time',
      industry: 'Streaming',
      description: 'Drive data-driven decisions for content, product, and growth. Build recommendation systems and causal inference models.',
      requirements: '7+ years data science, PhD preferred, expert in ML/statistics, Python/R/SQL, A/B testing, business impact focus',
      salary: '$200,000 - $280,000',
      remote: true,
      postedAt: daysAgo(4),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Staff Data Scientist', 'Netflix', 'Los Gatos, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Backend Engineer - Payments',
      company: 'Square',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Fintech',
      description: 'Build payment processing systems for millions of merchants. Work on transaction processing, fraud detection, and compliance.',
      requirements: '4+ years backend, Java/Kotlin/Ruby, distributed systems, financial systems experience, PCI compliance knowledge',
      salary: '$150,000 - $205,000',
      remote: true,
      postedAt: daysAgo(4),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Backend Engineer - Payments', 'Square', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Mobile Performance Engineer',
      company: 'TikTok',
      location: 'Mountain View, CA',
      type: 'Full-time',
      industry: 'Social Media',
      description: 'Optimize mobile app performance for billions of users. Work on video rendering, network optimization, and battery efficiency.',
      requirements: '5+ years mobile (iOS/Android), performance optimization expertise, profiling tools, C++, video codecs knowledge',
      salary: '$160,000 - $220,000',
      remote: true,
      postedAt: daysAgo(4),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Mobile Performance Engineer', 'TikTok', 'Mountain View, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Cybersecurity Engineer',
      company: 'CrowdStrike',
      location: 'Austin, TX',
      type: 'Full-time',
      industry: 'Cybersecurity',
      description: 'Protect organizations from cyber threats. Build endpoint detection and response systems using AI and behavioral analysis.',
      requirements: '3+ years security engineering, malware analysis, threat intelligence, incident response, cloud security',
      salary: '$130,000 - $180,000',
      remote: true,
      postedAt: daysAgo(4),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Cybersecurity Engineer', 'CrowdStrike', 'Austin, TX'),
      source: 'LinkedIn'
    },

    // 5-7 DAYS AGO
    {
      title: 'Engineering Manager - Backend',
      company: 'Uber',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Ridesharing',
      description: 'Lead engineering team building core platform services. Drive technical strategy and mentor engineers.',
      requirements: '6+ years engineering + 2+ years management, backend expertise (Go/Java), distributed systems, people leadership',
      salary: '$190,000 - $260,000',
      remote: true,
      postedAt: daysAgo(5),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Engineering Manager - Backend', 'Uber', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'React Native Developer',
      company: 'Chime',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Fintech',
      description: 'Build mobile banking app for millions of users. Create seamless financial experiences for underbanked Americans.',
      requirements: '3+ years React Native, TypeScript, mobile performance, banking/fintech experience, strong UX sense',
      salary: '$135,000 - $185,000',
      remote: true,
      postedAt: daysAgo(5),
      isActive: true,
      externalUrl: getLinkedInJobUrl('React Native Developer', 'Chime', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Infrastructure Engineer',
      company: 'Slack',
      location: 'San Francisco, CA',
      type: 'Full-time',
      industry: 'Enterprise Software',
      description: 'Scale infrastructure for enterprise messaging. Work on Kubernetes, service mesh, and observability.',
      requirements: '4+ years infrastructure/SRE, Kubernetes expert, cloud platforms (AWS/GCP), Go/Python, large-scale systems',
      salary: '$150,000 - $200,000',
      remote: true,
      postedAt: daysAgo(5),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Infrastructure Engineer', 'Slack', 'San Francisco, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Applied Scientist - NLP',
      company: 'Amazon',
      location: 'Seattle, WA',
      type: 'Full-time',
      industry: 'E-commerce',
      description: 'Build NLP systems for Alexa and product search. Work on language understanding, entity extraction, and generation.',
      requirements: 'PhD in CS/ML/NLP or Master + 5 years, strong publication record, deep learning expertise, PyTorch/TensorFlow',
      salary: '$165,000 - $230,000',
      remote: false,
      postedAt: daysAgo(6),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Applied Scientist - NLP', 'Amazon', 'Seattle, WA'),
      source: 'LinkedIn'
    },
    {
      title: 'Senior Platform Engineer',
      company: 'Snowflake',
      location: 'San Mateo, CA',
      type: 'Full-time',
      industry: 'Data Warehousing',
      description: 'Build cloud data platform used by thousands of enterprises. Work on query optimization, storage, and distributed computing.',
      requirements: '6+ years distributed systems, Java/C++, database internals, cloud infrastructure, performance optimization',
      salary: '$165,000 - $225,000',
      remote: true,
      postedAt: daysAgo(6),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Senior Platform Engineer', 'Snowflake', 'San Mateo, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Full Stack Engineer - Education',
      company: 'Khan Academy',
      location: 'Mountain View, CA',
      type: 'Full-time',
      industry: 'Education Technology',
      description: 'Build free education platform reaching millions of learners worldwide. Work on content delivery and learning experiences.',
      requirements: '3+ years full-stack, React, Python/Node.js, passion for education, nonprofit experience a plus',
      salary: '$110,000 - $150,000',
      remote: true,
      postedAt: daysAgo(7),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Full Stack Engineer - Education', 'Khan Academy', 'Mountain View, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'QA Automation Engineer',
      company: 'Zoom',
      location: 'San Jose, CA',
      type: 'Full-time',
      industry: 'Video Communications',
      description: 'Ensure quality of video communications platform. Build automated testing infrastructure and frameworks.',
      requirements: '4+ years QA automation, Selenium/Cypress, CI/CD, Java/Python, video/audio testing experience',
      salary: '$120,000 - $165,000',
      remote: true,
      postedAt: daysAgo(7),
      isActive: true,
      externalUrl: getLinkedInJobUrl('QA Automation Engineer', 'Zoom', 'San Jose, CA'),
      source: 'LinkedIn'
    },
    {
      title: 'Technical Program Manager',
      company: 'Microsoft',
      location: 'Redmond, WA',
      type: 'Full-time',
      industry: 'Technology',
      description: 'Drive cross-functional programs for Azure cloud services. Coordinate engineering teams and deliver complex initiatives.',
      requirements: '5+ years TPM/PM, technical background, experience with cloud services, excellent communication and organization',
      salary: '$150,000 - $210,000',
      remote: true,
      postedAt: daysAgo(7),
      isActive: true,
      externalUrl: getLinkedInJobUrl('Technical Program Manager', 'Microsoft', 'Redmond, WA'),
      source: 'LinkedIn'
    }
  ]

  // Delete existing jobs before seeding
  await prisma.job.deleteMany({})
  console.log('🗑️  Cleared existing jobs')

  // Create jobs
  for (const jobData of sampleJobs) {
    await prisma.job.create({
      data: jobData,
    })
  }

  console.log(`✅ Created ${sampleJobs.length} sample jobs`)

  // Create sample applications for demo user
  const jobs = await prisma.job.findMany({ take: 5, orderBy: { postedAt: 'desc' } })
  
  // Delete existing applications
  await prisma.application.deleteMany({ where: { userId: demoUser.id } })

  for (let i = 0; i < Math.min(3, jobs.length); i++) {
    const job = jobs[i]
    const statuses = ['applied', 'reviewed', 'interviewed']
    
    await prisma.application.create({
      data: {
        userId: demoUser.id,
        jobId: job.id,
        status: statuses[i] || 'applied',
        appliedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
        notes: `Applied for ${job.title} at ${job.company}`
      },
    })
  }

  console.log('✅ Created sample applications')

  // Create sample notifications
  const notifications = [
    {
      title: 'New Job Alert',
      message: 'New jobs matching your profile have been posted in the last 24 hours',
      type: 'job_alert'
    },
    {
      title: 'Application Update',
      message: 'Your application for Frontend Engineer at Meta has been reviewed',
      type: 'application_update'
    },
    {
      title: 'Interview Scheduled',
      message: 'Your interview for Software Engineer at Google has been scheduled',
      type: 'interview_reminder'
    }
  ]

  for (const notificationData of notifications) {
    await prisma.notification.create({
      data: {
        userId: demoUser.id,
        ...notificationData
      }
    })
  }

  console.log('✅ Created sample notifications')

  // Create career resources
  await prisma.careerResource.deleteMany({})
  console.log('🗑️  Cleared existing career resources')

  const careerResources = [
    // Resume Writing Resources
    {
      title: 'Resume Writing Tips - LinkedIn Learning',
      content: 'Professional resume writing course covering modern resume formats, ATS optimization, and industry-specific best practices.',
      type: 'course',
      category: 'resume_writing',
      author: 'LinkedIn Learning',
      url: 'https://www.linkedin.com/learning/topics/resume-writing',
      tags: JSON.stringify(['resume', 'linkedin', 'course', 'professional development'])
    },
    {
      title: 'ATS Resume Optimization Guide - Jobscan',
      content: 'Learn how to optimize your resume for Applicant Tracking Systems (ATS) to increase your chances of getting noticed by recruiters.',
      type: 'article',
      category: 'resume_writing',
      author: 'Jobscan',
      url: 'https://www.jobscan.co/',
      tags: JSON.stringify(['resume', 'ATS', 'optimization', 'jobscan'])
    },
    {
      title: 'Cover Letter Writing Guide - The Muse',
      content: 'Complete guide to writing compelling cover letters that complement your resume and showcase your personality.',
      type: 'article',
      category: 'resume_writing',
      author: 'The Muse',
      url: 'https://www.themuse.com/advice/how-to-write-a-cover-letter',
      tags: JSON.stringify(['cover letter', 'resume', 'application', 'the muse'])
    },

    // Interview Tips
    {
      title: 'Technical Interview Preparation - LeetCode',
      content: 'Comprehensive platform for practicing coding interviews with real company questions and detailed solutions.',
      type: 'article',
      category: 'interview_tips',
      author: 'LeetCode',
      url: 'https://leetcode.com/problemset/',
      tags: JSON.stringify(['interview', 'technical', 'coding', 'algorithms'])
    },
    {
      title: 'Behavioral Interview Questions - Glassdoor',
      content: 'Master behavioral interview questions with the STAR method and real examples from successful candidates.',
      type: 'article',
      category: 'interview_tips',
      author: 'Glassdoor',
      url: 'https://www.glassdoor.com/blog/',
      tags: JSON.stringify(['interview', 'behavioral', 'star method', 'preparation'])
    },
    {
      title: 'System Design Interview Guide - Educative',
      content: 'Complete guide to system design interviews with real-world examples and step-by-step approaches.',
      type: 'course',
      category: 'interview_tips',
      author: 'Educative',
      url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
      tags: JSON.stringify(['system design', 'interview', 'architecture', 'scalability'])
    },
    {
      title: 'Interview Preparation - InterviewBit',
      content: 'Structured interview preparation with coding problems, system design, and behavioral interview guides.',
      type: 'course',
      category: 'interview_tips',
      author: 'InterviewBit',
      url: 'https://www.interviewbit.com/',
      tags: JSON.stringify(['interview', 'coding', 'preparation', 'interviewbit'])
    },
    {
      title: 'Mock Interview Practice - Pramp',
      content: 'Practice real interviews with peers and get instant feedback to improve your interview skills.',
      type: 'article',
      category: 'interview_tips',
      author: 'Pramp',
      url: 'https://www.pramp.com/',
      tags: JSON.stringify(['interview', 'practice', 'mock interview', 'feedback'])
    },
    {
      title: 'Video Interview Tips - Zoom Career Guide',
      content: 'Essential tips for acing video interviews, including technical setup, lighting, and body language.',
      type: 'article',
      category: 'interview_tips',
      author: 'Zoom',
      url: 'https://blog.zoom.us/',
      tags: JSON.stringify(['video interview', 'remote', 'tips', 'zoom'])
    },

    // Career Advice
    {
      title: 'Professional Networking Strategies - Harvard Business Review',
      content: 'Evidence-based strategies for building meaningful professional relationships and advancing your career.',
      type: 'article',
      category: 'career_advice',
      author: 'Harvard Business Review',
      url: 'https://hbr.org/topic/subject/networking',
      tags: JSON.stringify(['networking', 'career growth', 'professional development', 'hbr'])
    },
    {
      title: 'Remote Work Best Practices - Buffer',
      content: 'Comprehensive guide to succeeding in remote work environments based on Buffer\'s decade of remote experience.',
      type: 'article',
      category: 'career_advice',
      author: 'Buffer',
      url: 'https://buffer.com/resources/remote-work',
      tags: JSON.stringify(['remote work', 'productivity', 'work-life balance', 'buffer'])
    },
    {
      title: 'Career Growth Strategies - Coursera',
      content: 'Professional development course covering skill assessment, goal setting, and strategic career planning.',
      type: 'course',
      category: 'career_advice',
      author: 'Coursera',
      url: 'https://www.coursera.org/browse/professional-development',
      tags: JSON.stringify(['career growth', 'professional development', 'strategies', 'coursera'])
    },
    {
      title: 'Salary Negotiation Guide - PayScale',
      content: 'Professional guide to salary negotiation with market data and negotiation strategies.',
      type: 'article',
      category: 'career_advice',
      author: 'PayScale',
      url: 'https://www.payscale.com/research-and-insights/',
      tags: JSON.stringify(['salary negotiation', 'compensation', 'career advice', 'payscale'])
    },
    {
      title: 'LinkedIn Profile Optimization - LinkedIn Help',
      content: 'Learn how to create a compelling LinkedIn profile that attracts recruiters and showcases your professional brand.',
      type: 'article',
      category: 'career_advice',
      author: 'LinkedIn',
      url: 'https://www.linkedin.com/help/linkedin',
      tags: JSON.stringify(['linkedin', 'profile', 'networking', 'optimization'])
    },
    {
      title: 'Career Change Guide - The Balance Careers',
      content: 'Comprehensive guide to making a successful career change, including assessment tools and transition strategies.',
      type: 'article',
      category: 'career_advice',
      author: 'The Balance',
      url: 'https://www.thebalancemoney.com/careers-4161708',
      tags: JSON.stringify(['career change', 'transition', 'planning', 'the balance'])
    },

    // Technical Skills
    {
      title: 'React Documentation - Official Guide',
      content: 'Official React documentation covering hooks, components, and best practices for modern React development.',
      type: 'article',
      category: 'technical_skills',
      author: 'React Team',
      url: 'https://react.dev/',
      tags: JSON.stringify(['react', 'javascript', 'frontend', 'web development', 'official'])
    },
    {
      title: 'Python for Data Science - DataCamp',
      content: 'Comprehensive course on using Python for data analysis, machine learning, and visualization with hands-on projects.',
      type: 'course',
      category: 'technical_skills',
      author: 'DataCamp',
      url: 'https://www.datacamp.com/learn/python',
      tags: JSON.stringify(['python', 'data science', 'machine learning', 'datacamp'])
    },
    {
      title: 'JavaScript Algorithms and Data Structures - freeCodeCamp',
      content: 'Free comprehensive course covering JavaScript fundamentals, algorithms, and data structures.',
      type: 'course',
      category: 'technical_skills',
      author: 'freeCodeCamp',
      url: 'https://www.freecodecamp.org/learn',
      tags: JSON.stringify(['javascript', 'algorithms', 'data structures', 'freecodecamp'])
    },
    {
      title: 'AWS Cloud Practitioner - Amazon Web Services',
      content: 'Official AWS training for cloud computing fundamentals and best practices.',
      type: 'course',
      category: 'technical_skills',
      author: 'Amazon Web Services',
      url: 'https://aws.amazon.com/training/',
      tags: JSON.stringify(['aws', 'cloud computing', 'certification', 'amazon'])
    },
    {
      title: 'Git and GitHub Tutorial - Atlassian',
      content: 'Complete guide to version control with Git and collaboration using GitHub.',
      type: 'article',
      category: 'technical_skills',
      author: 'Atlassian',
      url: 'https://www.atlassian.com/git/tutorials',
      tags: JSON.stringify(['git', 'github', 'version control', 'collaboration'])
    },
    {
      title: 'TypeScript Handbook - Official Documentation',
      content: 'Complete TypeScript documentation covering types, interfaces, and advanced features for modern JavaScript development.',
      type: 'article',
      category: 'technical_skills',
      author: 'TypeScript Team',
      url: 'https://www.typescriptlang.org/docs/',
      tags: JSON.stringify(['typescript', 'javascript', 'programming', 'official'])
    },
    {
      title: 'Node.js Best Practices - GitHub',
      content: 'Comprehensive guide to Node.js best practices, security, performance, and project structure.',
      type: 'article',
      category: 'technical_skills',
      author: 'Node.js Community',
      url: 'https://github.com/goldbergyoni/nodebestpractices',
      tags: JSON.stringify(['node.js', 'backend', 'best practices', 'github'])
    },
    {
      title: 'Docker Getting Started Guide',
      content: 'Learn containerization with Docker through hands-on tutorials and real-world examples.',
      type: 'article',
      category: 'technical_skills',
      author: 'Docker',
      url: 'https://docs.docker.com/get-started/',
      tags: JSON.stringify(['docker', 'containers', 'devops', 'official'])
    },
    {
      title: 'Kubernetes Basics - Official Tutorial',
      content: 'Introduction to Kubernetes orchestration for managing containerized applications at scale.',
      type: 'course',
      category: 'technical_skills',
      author: 'Kubernetes',
      url: 'https://kubernetes.io/docs/tutorials/',
      tags: JSON.stringify(['kubernetes', 'devops', 'containers', 'orchestration'])
    },
    {
      title: 'Machine Learning Course - Andrew Ng',
      content: 'Stanford\'s popular machine learning course covering algorithms, neural networks, and practical applications.',
      type: 'course',
      category: 'technical_skills',
      author: 'Andrew Ng',
      url: 'https://www.coursera.org/learn/machine-learning',
      tags: JSON.stringify(['machine learning', 'AI', 'coursera', 'stanford'])
    },
    {
      title: 'Web Development Bootcamp - freeCodeCamp',
      content: 'Complete free web development curriculum covering HTML, CSS, JavaScript, and full-stack development.',
      type: 'course',
      category: 'technical_skills',
      author: 'freeCodeCamp',
      url: 'https://www.freecodecamp.org/learn',
      tags: JSON.stringify(['web development', 'full stack', 'free', 'freecodecamp'])
    },
    {
      title: 'SQL Tutorial - W3Schools',
      content: 'Comprehensive SQL tutorial covering database queries, joins, and advanced SQL features.',
      type: 'article',
      category: 'technical_skills',
      author: 'W3Schools',
      url: 'https://www.w3schools.com/sql/',
      tags: JSON.stringify(['sql', 'database', 'queries', 'w3schools'])
    },
    {
      title: 'GraphQL Documentation - Official',
      content: 'Learn GraphQL query language for APIs with official documentation and interactive tutorials.',
      type: 'article',
      category: 'technical_skills',
      author: 'GraphQL Foundation',
      url: 'https://graphql.org/learn/',
      tags: JSON.stringify(['graphql', 'API', 'query language', 'official'])
    }
  ]

  for (const resourceData of careerResources) {
    await prisma.careerResource.create({
      data: resourceData
    })
  }

  console.log('✅ Created career resources')

  console.log('🎉 Database seeding completed!')
  console.log(`\n📊 Summary:`)
  console.log(`   - Jobs: ${sampleJobs.length}`)
  console.log(`   - Demo User: demo@example.com / demo123`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
