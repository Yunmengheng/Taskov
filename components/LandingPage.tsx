import React from 'react';
import Link  from 'next/link';
import { CheckCircleIcon, ArrowRightIcon, CheckSquareIcon, ClockIcon, BarChart3Icon, CalendarIcon, TagIcon, KanbanIcon, UsersIcon, MessageSquareIcon } from 'lucide-react';
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <KanbanIcon size={24} className="text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Task Manager
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/Login" className="text-gray-700 hover:text-blue-600 font-medium">
                Sign In
              </Link>
              <Link href="/Signup" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>
  {/* Hero Section (full remaining viewport height) */}
  <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Manage Your Tasks <br />
                <span className="text-blue-600">Simply & Effectively</span>
              </h1>
              <p className="text-lg text-gray-700 mb-6 max-w-lg">
                An intuitive task management platform that helps you organize,
                prioritize, and complete your tasks with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg">
                  Get Started Free
                </Link>
                <Link href="/login" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-200 rounded-xl transform rotate-3"></div>
                <img src="https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Task Management Dashboard" className="relative z-10 rounded-xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our task management platform offers everything you need to stay
              organized and productive.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <KanbanIcon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Kanban Board
              </h3>
              <p className="text-gray-600">
                Visualize your workflow with a customizable Kanban board. Drag
                and drop tasks between columns to update their status.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
              <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <CheckSquareIcon className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Task Management
              </h3>
              <p className="text-gray-600">
                Create, organize, and track tasks with ease. Set priorities, due
                dates, and categories to stay on top of your work.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <CalendarIcon className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Calendar View
              </h3>
              <p className="text-gray-600">
                View your tasks in a calendar format. Get a clear picture of
                your schedule and deadlines at a glance.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
              <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <BarChart3Icon className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Analytics
              </h3>
              <p className="text-gray-600">
                Track your productivity with detailed analytics. Understand your
                work patterns and improve your efficiency.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
              <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <TagIcon className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Task Categorization
              </h3>
              <p className="text-gray-600">
                Organize tasks by categories and tags. Filter and sort to find
                exactly what you're looking for.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
              <div className="bg-teal-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <ClockIcon className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Time Tracking
              </h3>
              <p className="text-gray-600">
                Monitor time spent on tasks. Set due dates and get notified
                about upcoming deadlines.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started with our task management platform in just a few simple
              steps.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Create an Account
              </h3>
              <p className="text-gray-600">
                Sign up for free and set up your personal account in seconds.
              </p>
            </div>
            <div className="hidden md:block">
              <ArrowRightIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Add Your Tasks
              </h3>
              <p className="text-gray-600">
                Create tasks, set priorities, due dates, and organize them into
                categories.
              </p>
            </div>
            <div className="hidden md:block">
              <ArrowRightIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Manage & Complete
              </h3>
              <p className="text-gray-600">
                Track progress, update statuses, and mark tasks as complete when
                you're done.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their
              productivity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" alt="User" className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Sarah Johnson
                  </h4>
                  <p className="text-gray-600">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "This task management tool has completely transformed how our
                team works. We're more organized and productive than ever
                before."
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" alt="User" className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Michael Chen
                  </h4>
                  <p className="text-gray-600">Freelance Developer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a freelancer juggling multiple projects, this platform keeps
                me on track. The Kanban board is a game-changer for visualizing
                my workflow."
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" alt="User" className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Emma Rodriguez
                  </h4>
                  <p className="text-gray-600">Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I use this app to manage my coursework and assignments. The
                calendar view helps me plan ahead and never miss a deadline."
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join thousands of users who have already transformed their
            productivity with our task management platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/signup" className="bg-white hover:bg-gray-100 text-blue-600 font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg">
              Sign Up Free
            </Link>
            <Link href="/login" className="bg-transparent hover:bg-blue-700 text-white border-2 border-white font-medium py-3 px-8 rounded-lg transition-colors duration-300">
              Sign In
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <KanbanIcon size={20} className="text-blue-600" />
                <span className="ml-2 text-lg font-bold text-gray-900">
                  Task Manager
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                The simple yet powerful task management platform for individuals
                and teams.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Features
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Kanban Board
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Task Management
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Calendar View
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <p className="text-center text-gray-600 text-sm">
              © {new Date().getFullYear()} Task Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;