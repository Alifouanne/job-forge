# 🚀 Job Forge

A modern, full-stack job board application built with Next.js 15, featuring advanced job posting, search capabilities, and seamless user experience.

![Job Forge](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## ✨ Features

### 🔐 Authentication & User Management

- **OAuth Integration**: Seamless login with GitHub and Google
- **User Onboarding**: Guided setup for companies and job seekers
- **Profile Management**: Complete user profiles with avatars and information
- **Role-based Access**: Different experiences for employers and job seekers

### 💼 Job Management

- **Rich Job Posting**: Create detailed job listings with rich text descriptions
- **Company Profiles**: Comprehensive company information with logos and descriptions
- **Job Categories**: Support for full-time, part-time, contract, and internship positions
- **Salary Ranges**: Flexible salary specification with currency formatting
- **Benefits System**: Comprehensive benefits selection and display
- **Location Support**: Global job posting with country-specific locations

### 🔍 Advanced Search & Discovery

- **Smart Filtering**: Filter by job type, location, and other criteria
- **Pagination**: Efficient browsing through large job listings
- **Saved Jobs**: Bookmark interesting positions for later review
- **URL-based Filters**: Shareable and bookmarkable search results

### 💳 Payment & Monetization

- **Stripe Integration**: Secure payment processing for job postings
- **Flexible Pricing**: Multiple listing duration options with tiered pricing
- **Payment Success/Failure Handling**: Complete payment flow management
- **Subscription Management**: Handle recurring payments and billing

### 🎨 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: System-aware theme switching
- **Smooth Animations**: Framer Motion powered transitions and effects
- **Loading States**: Comprehensive loading indicators and skeleton screens
- **Toast Notifications**: Real-time feedback for user actions

### 🛡️ Security & Performance

- **Rate Limiting**: Arcjet-powered protection against abuse
- **Bot Detection**: Intelligent bot filtering and protection
- **Form Validation**: Comprehensive client and server-side validation
- **Performance Optimization**: Code splitting, lazy loading, and caching

### 📧 Communication & Notifications

- **Email System**: Automated notifications and updates using Resend
- **Background Jobs**: Inngest-powered job processing
- **Job Expiration**: Automatic job listing management
- **Real-time Updates**: Live status updates and notifications

### 📁 File Management

- **Image Uploads**: Company logo and profile picture support
- **Resume Uploads**: PDF resume handling for job seekers
- **File Optimization**: Automatic image optimization and compression
- **CDN Integration**: Fast file delivery through UploadThing

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Rich Text Editor**: TipTap
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js
- **Database ORM**: Prisma
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe
- **File Uploads**: UploadThing
- **Background Jobs**: Inngest
- **Security**: Arcjet (rate limiting, bot detection)

### Database & Infrastructure

- **Database**: PostgreSQL (via Prisma)
- **Deployment**: Vercel
- **File Storage**: UploadThing CDN
- **Email**: Resend
- **Monitoring**: Built-in analytics and error tracking

### Development Tools

- **Package Manager**: Bun
- **Code Quality**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Stripe account (for payments)
- GitHub/Google OAuth apps (for authentication)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Alifouanne/job-forge.git
   cd job-forge
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

   # or

   bun install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   Fill in your environment variables:
   \`\`\`env

   # Database

   DATABASE_URL="postgresql://username:password@localhost:5432/jobforge"

   # NextAuth

   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # OAuth Providers

   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Stripe

   STRIPE*SECRET_KEY="sk_test*..."
   STRIPE*WEBHOOK_SECRET="whsec*..."
   NEXT*PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test*..."

   # UploadThing

   UPLOADTHING*TOKEN="sk_live*..."

   # Arcjet

   ARCJET_KEY="your-arcjet-key"

   # App URL

   NEXT_PUBLIC_URL="http://localhost:3000"
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev

   # or

   yarn dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
job-forge/
├── app/ # Next.js App Router pages
│ ├── (main)/ # Main application routes
│ ├── api/ # API routes
│ ├── login/ # Authentication pages
│ ├── onboarding/ # User onboarding flow
│ └── layout.tsx # Root layout
├── components/ # Reusable UI components
│ ├── forms/ # Form components
│ ├── general/ # General utility components
│ ├── ui/ # Shadcn/ui components
│ └── TextEditor/ # Rich text editor components
├── lib/ # Utility functions and configurations
│ ├── actions.ts # Server actions
│ ├── auth.ts # Authentication configuration
│ ├── db.ts # Database configuration
│ └── utils.ts # Utility functions
├── prisma/ # Database schema and migrations
├── public/ # Static assets
└── styles/ # Global styles
\`\`\`

## 🔧 Configuration

### Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts and authentication
- **Company**: Company profiles and information
- **JobSeeker**: Job seeker profiles
- **JobPost**: Job listings and details
- **SavedJobPost**: User's saved/favorite jobs

### Authentication

NextAuth.js is configured with:

- GitHub OAuth provider
- Google OAuth provider
- Database session strategy
- Custom sign-in pages

### Payment Processing

Stripe integration includes:

- One-time payments for job postings
- Webhook handling for payment confirmation
- Multiple pricing tiers for job listing durations

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

1. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`
2. Start the production server:
   \`\`\`bash
   npm start
   \`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Prisma](https://prisma.io/) for the excellent database toolkit
- [Stripe](https://stripe.com/) for payment processing
- [Vercel](https://vercel.com/) for hosting and deployment

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Built with ❤️ using Next.js 15 and modern web technologies**
