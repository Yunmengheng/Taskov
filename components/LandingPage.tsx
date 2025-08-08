"use client";
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, BarChart3Icon, CalendarIcon, CheckSquareIcon, ChevronDown, ClockIcon, KanbanIcon, TagIcon } from 'lucide-react';

const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll from hero to features on initial downward scroll
  useEffect(() => {
    let scrollListener: ((e: WheelEvent) => void) | null = null;
    const onWheel = (e: WheelEvent) => {
      if (!heroRef.current || !featuresRef.current) return;
      const heroHeight = heroRef.current.offsetHeight;
      const heroTop = heroRef.current.offsetTop;
      const scrollY = window.scrollY || window.pageYOffset;
      const stillInHero = scrollY < heroTop + heroHeight - 40; // 40px threshold

      if (e.deltaY > 0 && stillInHero) {
        e.preventDefault();
        featuresRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Remove listener after first trigger
        if (scrollListener) {
          window.removeEventListener('wheel', scrollListener);
          scrollListener = null;
        }
      }
    };
    
    scrollListener = onWheel;
    // Use non-passive listener to allow preventDefault
    window.addEventListener('wheel', scrollListener, { passive: false });
    
    return () => {
      if (scrollListener) {
        window.removeEventListener('wheel', scrollListener);
      }
    };
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-900 text-gray-300">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <KanbanIcon size={24} className="text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">
                Task Manager
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/Login" className="text-gray-300 hover:text-white font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/Signup" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative flex items-center bg-gray-900 py-16 flex-1 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Manage Your Tasks <br />
                <span className="text-blue-500">Simply & Effectively</span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-lg mx-auto md:mx-0">
                An intuitive task management platform that helps you organize,
                prioritize, and complete your tasks with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg">
                  Get Started Free
                </Link>
                <Link href="/login" className="border-2 border-gray-700 text-gray-300 hover:bg-gray-800 font-medium py-3 px-8 rounded-lg">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-800 rounded-xl transform rotate-3"></div>
                <img src="https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Task Management Dashboard" className="relative z-10 rounded-xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
        <button
          aria-label="Scroll to features"
          onClick={scrollToFeatures}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-blue-500 hover:text-blue-400 transition-colors"
        >
          <ChevronDown size={46} className="animate-bounce" />
        </button>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 scroll-mt-16 bg-gray-900" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our task management platform offers everything you need to stay organized and productive.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: KanbanIcon, title: 'Kanban Board', description: 'Visualize your workflow with a customizable Kanban board. Drag and drop tasks between columns to update their status.' },
              { icon: CheckSquareIcon, title: 'Task Management', description: 'Create, organize, and track tasks with ease. Set priorities, due dates, and categories to stay on top of your work.' },
              { icon: CalendarIcon, title: 'Calendar View', description: 'View your tasks in a calendar format. Get a clear picture of your schedule and deadlines at a glance.' },
              { icon: BarChart3Icon, title: 'Analytics', description: 'Track your productivity with detailed analytics. Understand your work patterns and improve your efficiency.' },
              { icon: TagIcon, title: 'Task Categorization', description: 'Organize tasks by categories and tags. Filter and sort to find exactly what you\'re looking for.' },
              { icon: ClockIcon, title: 'Time Tracking', description: 'Monitor time spent on tasks. Set due dates and get notified about upcoming deadlines.' },
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-lg border border-gray-700 transition-all hover:border-blue-500/50 hover:shadow-xl">
                <div className="p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6 bg-blue-900/30">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Get started with our task management platform in just a few simple steps.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-12 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-900 border border-gray-700">
                <span className="text-2xl font-bold text-blue-500">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Create an Account</h3>
              <p className="text-gray-400">Sign up for free and set up your personal account in seconds.</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 text-gray-600 hidden md:block" />
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-900 border border-gray-700">
                <span className="text-2xl font-bold text-blue-500">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Add Your Tasks</h3>
              <p className="text-gray-400">Create tasks, set priorities, due dates, and organize them into categories.</p>
            </div>
             <ArrowRightIcon className="w-6 h-6 text-gray-600 hidden md:block" />
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-900 border border-gray-700">
                <span className="text-2xl font-bold text-blue-500">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Manage & Complete</h3>
              <p className="text-gray-400">Track progress, update statuses, and mark tasks as complete when you're done.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Join thousands of satisfied users who have transformed their productivity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', title: 'Product Manager', quote: '"This task management tool has completely transformed how our team works. We\'re more organized and productive than ever before."', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80' },
              { name: 'Michael Chen', title: 'Freelance Developer', quote: '"As a freelancer juggling multiple projects, this platform keeps me on track. The Kanban board is a game-changer for visualizing my workflow."', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80' },
              { name: 'Emma Rodriguez', title: 'Student', quote: '"I use this app to manage my coursework and assignments. The calendar view helps me plan ahead and never miss a deadline."', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-gray-400 italic">
                  {testimonial.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Join thousands of users who have already transformed their productivity with our task management platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg">
              Sign Up Free
            </Link>
            <Link href="/login" className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-medium py-3 px-8 rounded-lg transition-colors duration-300">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <KanbanIcon size={20} className="text-blue-500" />
                <span className="ml-2 text-lg font-bold text-white">Task Manager</span>
              </div>
              <p className="text-gray-400 mb-4">The simple yet powerful task management platform for individuals and teams.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Kanban Board</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Task Management</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Calendar View</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Task Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;