# TaskOV

A modern, feature-rich task management application built with Next.js 14, featuring intuitive Kanban boards, calendar views, analytics, and a responsive dashboard interface.

## 🚀 Features

- **📊 Dashboard**: Comprehensive overview with task statistics and productivity metrics
- **📋 Kanban Board**: Interactive drag-and-drop task management with status columns
- **📅 Calendar View**: Visual task scheduling and deadline management
- **📈 Analytics**: Detailed insights into productivity patterns and task completion rates
- **👥 Admin Panel**: User and task management for administrators
- **🔐 Authentication**: Secure login and signup functionality
- **⚙️ Settings**: Customizable user preferences and account management
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, professional interface with smooth animations

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono
- **State Management**: React Context API
- **Development Tools**: ESLint, PostCSS

## 📁 Project Structure

```
TaskOV/
├── app/                          # Next.js App Router pages
│   ├── Admin/                   # Admin panel for user/task management
│   ├── analytics/               # Analytics and insights dashboard
│   ├── calendar/                # Calendar view implementation
│   ├── CalendarView/            # Calendar component page
│   ├── Dashboard/               # Main dashboard interface
│   ├── KanbanView/              # Kanban board page
│   ├── Login/                   # User authentication
│   ├── Signup/                  # User registration
│   ├── profile/                 # User profile management
│   ├── settings/                # Application settings
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/                   # Reusable React components
│   ├── dashboard/               # Dashboard-specific components
│   ├── kanban/                  # Kanban board components
│   ├── layout/                  # Layout components
│   ├── tasks/                   # Task-related components
│   └── LandingPage.tsx          # Main landing page component
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx          # Authentication state management
│   ├── TaskContext.tsx          # Task state management
│   └── ThemeContext.tsx         # Theme switching context
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions and configurations
├── middleware/                  # Next.js middleware
├── pages/                       # Additional pages (if using Pages Router)
├── public/                      # Static assets
├── types/                       # TypeScript type definitions
├── utils/                       # Utility functions
├── .env.local                   # Environment variables (not in repo)
├── .gitignore                   # Git ignore rules
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Yunmengheng/Taskov.git
   cd TaskOV
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account or sign in with existing credentials
2. **Dashboard**: Access your main dashboard to view task overview and statistics
3. **Create Tasks**: Add new tasks with titles, descriptions, priorities, and due dates

### Kanban Board
- **View Tasks**: Navigate to `/KanbanView` to see tasks organized in columns
- **Drag & Drop**: Move tasks between "To Do", "In Progress", and "Done" columns
- **Task Details**: Click on tasks to view and edit detailed information
- **Status Updates**: Automatically update task status by moving between columns

### Calendar View
- **Schedule Overview**: Switch to `/CalendarView` to see tasks in calendar format
- **Date Navigation**: Browse different months and dates
- **Deadline Management**: Visualize task deadlines and due dates
- **Quick Actions**: Click on dates to create new tasks

### Analytics
- **Productivity Metrics**: View `/analytics` for detailed productivity insights
- **Progress Tracking**: Monitor task completion rates and patterns
- **Performance Charts**: Analyze your work habits and efficiency trends

### Admin Features
- **User Management**: Access `/Admin` for user administration (admin only)
- **Task Oversight**: Monitor all tasks across the platform
- **System Analytics**: View platform-wide statistics and metrics

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code quality checks

### Code Quality

This project maintains high code quality standards using:
- **ESLint**: Configured in [`eslint.config.mjs`](eslint.config.mjs)
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (recommended)

### Environment Variables

Create a `.env.local` file with the following variables:
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
# Add other environment variables as needed
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and patterns
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide](https://lucide.dev/)** - Beautiful & consistent icon toolkit
- **[Vercel](https://vercel.com/)** - Deployment and hosting platform