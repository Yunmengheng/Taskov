# Todo Task Management App

A modern task management application built with Next.js, featuring Kanban boards, calendar views, and a responsive dashboard interface.

## Features

- 📋 **Kanban Board**: Drag and drop tasks between different status columns
- 📅 **Calendar View**: Visualize tasks in a calendar format
- 📊 **Dashboard**: Overview of your tasks and productivity metrics
- 🌙 **Dark Theme**: Modern dark UI design
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- 🔐 **Authentication**: Secure login and signup functionality

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Custom components with modern design
- **Development**: ESLint for code quality

## Project Structure

```
todo/
├── app/                          # Next.js App Router pages
│   ├── analytics/               # Analytics and insights page
│   ├── calendar/                # Calendar view implementation
│   ├── CalendarView/            # Calendar component page
│   ├── Dashboard/               # Main dashboard page
│   ├── KanbanView/              # Kanban board interface
│   ├── Login/                   # Authentication pages
│   ├── profile/                 # User profile management
│   ├── settings/                # Comprehensive settings page
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # Reusable React components
│   ├── dashboard/               # Dashboard-specific components
│   ├── kanban/                  # Kanban board components
│   ├── layout/                  # Layout components (DashboardLayout)
│   └── tasks/                   # Task-related components
├── contexts/                     # React Context providers
│   └── AuthContext.tsx          # Authentication context
├── lib/                         # Utility functions and configurations
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── next.config.ts               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration

```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/todo.git
cd todo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Kanban View
- Navigate to the Kanban board to see your tasks organized in columns
- Drag and drop tasks between different status columns (To Do, In Progress, Done)
- Switch to Calendar View using the button in the top-right corner

### Calendar View
- View your tasks in a calendar format
- See task deadlines and due dates at a glance
- Navigate between different months and dates

### Dashboard
- Get an overview of your task statistics
- View productivity metrics and progress tracking
- Access quick actions for task management

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

This project uses ESLint for maintaining code quality. The configuration can be found in [`eslint.config.mjs`](eslint.config.mjs).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
