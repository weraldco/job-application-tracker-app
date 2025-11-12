# Job Application Tracker

A comprehensive job application tracking application built with Next.js, TypeScript, and Prisma. This application helps job seekers organize, monitor, and analyze their job search activities.

## Features

### 🎯 Core Features
- **Job Application Tracker**: Centralized list of job applications with filtering and search
- **AI-Powered Job Summarizer**: Automatically extract key information from job postings
- **Analytics Dashboard**: Visual insights into job search performance
- **Reminders & Notifications**: Stay on top of follow-ups and deadlines
- **Status Management**: Track applications through different stages

### 🔧 Technical Features
- **Authentication**: Secure login with NextAuth.js (Google, GitHub, Credentials)
- **Database**: SQLite with Prisma ORM
- **UI Components**: Modern, responsive design with Tailwind CSS
- **Real-time Updates**: Instant UI updates for better user experience
- **Mobile Responsive**: Works seamlessly on all devices

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd job-application-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
OPENAI_API_KEY="your-openai-api-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Job Applications

1. **Manual Entry**: Click "Add Job" to manually enter job details
2. **AI Summarizer**: Click "AI Summarize" to automatically extract information from job postings

### Tracking Applications

- **Status Updates**: Change application status using the dropdown on each job card
- **Detailed View**: Click on any job card to see full details
- **Events**: Add interview dates, follow-ups, and other important events
- **Reminders**: Set reminders for follow-ups and deadlines

### Analytics

- **Overview Metrics**: View total applications, interview rate, offer rate
- **Status Distribution**: Pie chart showing application status breakdown
- **Timeline**: Bar chart showing applications over time

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── jobs/          # Job CRUD operations
│   │   └── ai/            # AI summarization
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── job-tracker.tsx   # Main job tracking component
│   ├── analytics-dashboard.tsx
│   └── ...
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
└── hooks/                # Custom React hooks
```

## Database Schema

The application uses the following main entities:

- **User**: User accounts and authentication
- **Job**: Job applications with details
- **JobEvent**: Timeline events for each job
- **Reminder**: Follow-up reminders and notifications
- **Attachment**: File attachments for jobs

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs for authenticated user
- `POST /api/jobs` - Create new job application
- `GET /api/jobs/[id]` - Get specific job
- `PATCH /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

### AI
- `POST /api/ai/summarize-job` - Summarize job posting

### Authentication
- `GET /api/auth/[...nextauth]` - NextAuth.js endpoints

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: SQLite, Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **AI**: OpenAI API (for job summarization)
- **Icons**: Lucide React

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Demo

For demo purposes, you can sign in with:
- Email: `demo@example.com`
- Password: `demo123`

Or use OAuth providers (Google/GitHub) if configured.

## Future Enhancements

- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with job boards (LinkedIn, Indeed)
- [ ] Resume version tracking
- [ ] Interview preparation tools
- [ ] Salary negotiation tracker