#!/usr/bin/env node

/**
 * Script to update career resources with fresh content
 * This can be run manually or scheduled as a cron job
 */

const https = require('https')
const http = require('http')
const { PrismaClient } = require('@prisma/client')

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-key'

// Fresh career resources data
const freshResources = [
  {
    title: 'Latest Tech Trends - TechCrunch',
    content: 'Stay updated with the latest technology trends, startup news, and industry insights that can impact your career decisions.',
    type: 'article',
    category: 'career_advice',
    author: 'TechCrunch',
    url: 'https://techcrunch.com/',
    tags: JSON.stringify(['tech trends', 'industry news', 'career insights', 'techcrunch'])
  },
  {
    title: 'Developer News - Hacker News',
    content: 'Community-driven news and discussions about programming, technology, and startup culture.',
    type: 'article',
    category: 'technical_skills',
    author: 'Hacker News',
    url: 'https://news.ycombinator.com/',
    tags: JSON.stringify(['developer news', 'programming', 'technology', 'community'])
  },
  {
    title: 'Job Market Report - LinkedIn Economic Graph',
    content: 'Quarterly insights into job market trends, skill demands, and career opportunities across industries.',
    type: 'article',
    category: 'career_advice',
    author: 'LinkedIn',
    url: 'https://economicgraph.linkedin.com/research',
    tags: JSON.stringify(['job market', 'trends', 'linkedin', 'economic insights'])
  },
  {
    title: 'Free Programming Courses - edX',
    content: 'Access free courses from top universities and institutions covering various programming languages and technologies.',
    type: 'course',
    category: 'technical_skills',
    author: 'edX',
    url: 'https://www.edx.org/learn/computer-programming',
    tags: JSON.stringify(['free courses', 'programming', 'university', 'edx'])
  },
  {
    title: 'AI and Machine Learning - Towards Data Science',
    content: 'Latest articles and insights on artificial intelligence, machine learning, and data science careers.',
    type: 'article',
    category: 'technical_skills',
    author: 'Towards Data Science',
    url: 'https://towardsdatascience.com/',
    tags: JSON.stringify(['AI', 'machine learning', 'data science', 'towards data science'])
  },
  {
    title: 'Behavioral Interview Questions - The Muse',
    content: 'Comprehensive guide to behavioral interview questions with sample answers and preparation strategies.',
    type: 'article',
    category: 'interview_tips',
    author: 'The Muse',
    url: 'https://www.themuse.com/advice/30-behavioral-interview-questions-you-should-be-ready-to-answer',
    tags: JSON.stringify(['behavioral interview', 'preparation', 'questions', 'the muse'])
  }
]

async function updateCareerResourcesViaAPI() {
  try {
    console.log('🔄 Starting career resources update via API...')
    
    const url = new URL(`${API_URL}/api/career-resources/update`)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': CRON_SECRET
      }
    }

    const client = url.protocol === 'https:' ? https : http
    
    const req = client.request(url, options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          if (response.success) {
            console.log('✅ Career resources updated successfully via API!')
            console.log(`📊 Updated ${response.count} resources`)
            console.log(`⏰ Timestamp: ${response.timestamp}`)
          } else {
            console.error('❌ Failed to update career resources:', response.error)
            process.exit(1)
          }
        } catch (error) {
          console.error('❌ Error parsing response:', error)
          process.exit(1)
        }
      })
    })

    req.on('error', (error) => {
      console.error('❌ API request failed, trying direct database update...')
      updateCareerResourcesDirectly()
    })
    
    req.end()
  } catch (error) {
    console.error('❌ Error updating career resources via API:', error)
    console.log('🔄 Falling back to direct database update...')
    updateCareerResourcesDirectly()
  }
}

async function updateCareerResourcesDirectly() {
  try {
    console.log('🔄 Starting direct database update...')
    
    const prisma = new PrismaClient()
    
    // Mark old resources as inactive
    await prisma.careerResource.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })
    
    // Add new resources
    for (const resourceData of freshResources) {
      await prisma.careerResource.create({
        data: resourceData
      })
    }
    
    console.log('✅ Career resources updated successfully via direct database update!')
    console.log(`📊 Updated ${freshResources.length} resources`)
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error updating career resources directly:', error)
    process.exit(1)
  }
}

// Try API first, fallback to direct database update
updateCareerResourcesViaAPI()
