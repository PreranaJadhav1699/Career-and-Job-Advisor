# Career & Job Advisor

Self-hosted, AI-powered career hub built with Next.js, TypeScript, Prisma, and Ollama.  
Track jobs, manage resumes/profiles, schedule interviews, get notifications—and use AI for resume analysis, cover letters, skill-gap insights, and interview prep.

## Features

### Core Functionality

- **Job Search** - Advanced search with filters by title, location, industry, and type
- **Resume Upload** - Upload and manage multiple resume versions
- **Profile Management** - Comprehensive user profiles with career goals
- **Application Tracking** - Track job applications and their statuses
- **Notifications** - Real-time alerts for new job postings and updates
- **Interview Scheduling** - Book and manage interview appointments

### AI-Powered Features (Powered by Ollama)

- **Resume Analysis** - AI feedback on resume optimization
- **Cover Letter Generation** - Personalized cover letters for specific jobs
- **Skill Gap Analysis** - Identify skills needed for target positions
- **Interview Preparation** - AI-generated interview questions and tips
- **Job Matching** - Intelligent job recommendations based on profile

### Career Resources

- Articles and courses for career development
- Industry insights and trends
- Professional development resources

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Authentication**: NextAuth.js
- **AI/LLM**: Ollama with Llama 3.1
- **UI Components**: Headless UI, Heroicons, Framer Motion
- **File Upload**: Multer
- **Form Handling**: React Hook Form with Zod validation

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v18 or higher)
2. **Ollama** installed and running locally
3. **Llama 3.1 model** pulled in Ollama

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd career-job-advisor
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Set up Ollama**

   ```bash
   # Install Ollama (if not already installed)
   # Visit: https://ollama.ai/

   # Pull the Llama 3.1 model
   ollama pull llama3.1:latest

   # Start Ollama server
   ollama serve
   ```
4. **Environment Setup**

   ```bash
   # Copy the example environment file
   cp env.example .env.local

   # Edit .env.local with your configuration
   ```
5. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # (Optional) Seed the database with sample data
   npx prisma db seed
   ```
6. **Start the development server**

   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Ollama
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1:latest"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760
```

## Usage

### Getting Started

1. **Sign Up**: Create a new account or use the demo credentials

   - Email: `demo@example.com`
   - Password: `demo123`
2. **Complete Your Profile**: Add your professional information, skills, and career goals
3. **Upload Resume**: Upload your resume to enable AI-powered features
4. **Search Jobs**: Use the advanced search to find relevant positions
5. **Apply with AI Help**: Use AI features to optimize your applications

### AI Features

#### Resume Analysis

- Upload your resume text and job description
- Get AI feedback on strengths, improvements, and match score
- Receive specific suggestions for optimization

#### Cover Letter Generation

- Provide your resume and job details
- Generate personalized cover letters
- Download and customize as needed

#### Skill Gap Analysis

- List your current skills
- Specify target job and requirements
- Get recommendations for skill development

#### Interview Preparation

- Select a job or enter custom details
- Get common and technical interview questions
- Receive preparation tips and questions to ask

#### Job Matching

- Complete your profile for better matches
- Get AI-powered job recommendations
- See match scores and reasons

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User sign in
- `GET /api/auth/session` - Get current session

### AI Features

- `POST /api/ai/analyze-resume` - Analyze resume against job description
- `POST /api/ai/generate-cover-letter` - Generate cover letter
- `POST /api/ai/skill-gap-analysis` - Analyze skill gaps
- `POST /api/ai/interview-tips` - Generate interview preparation tips

### Jobs

- `GET /api/jobs` - Get job listings with filters
- `GET /api/jobs/[id]` - Get specific job details
- `POST /api/jobs/[id]/apply` - Apply for a job

### Applications

- `GET /api/applications` - Get user applications
- `GET /api/applications/[id]` - Get application details
- `PUT /api/applications/[id]` - Update application status

## Database Schema

The application uses Prisma with the following main entities:

- **User** - User accounts and authentication
- **Profile** - User professional profiles
- **Job** - Job postings and details
- **Application** - Job applications and status
- **Resume** - User resume files
- **Interview** - Interview scheduling and tracking
- **Notification** - User notifications
- **SkillGap** - AI-generated skill gap analyses
- **CareerResource** - Career development resources

## Development

### Project Structure

```
career-job-advisor/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── uploads/              # File uploads directory
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma db push` - Push schema changes to database

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma` and run `npx prisma db push`
2. **API Routes**: Add new routes in `app/api/`
3. **Components**: Create reusable components in `components/`
4. **Pages**: Add new pages in `app/dashboard/`

## Troubleshooting

### Common Issues

1. **Ollama Connection Error**

   - Ensure Ollama is running: `ollama serve`
   - Check if the model is pulled: `ollama list`
   - Verify the base URL in environment variables
2. **Database Issues**

   - Reset database: `npx prisma db push --force-reset`
   - Regenerate client: `npx prisma generate`
3. **File Upload Issues**

   - Ensure uploads directory exists
   - Check file size limits
   - Verify file permissions

### Performance Optimization

- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Cache AI responses when appropriate
- Optimize images and assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
