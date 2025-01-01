import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, MessageSquare, ClipboardList, Layout as LayoutIcon, LogOut, Briefcase, Users } from 'lucide-react';

export default function Layout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/jobs', icon: Briefcase, text: 'Jobs' },
    { path: '/achievements', icon: Trophy, text: 'Achievements' },
    { path: '/feedback', icon: MessageSquare, text: 'Feedback' },
    { path: '/reviews', icon: ClipboardList, text: 'Reviews' },
    { path: '/teams', icon: Users, text: 'Teams' }
  ];

  return (
    <div className="min-h-screen bg-sage-50">
      <nav className="bg-white shadow-sm border-b border-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex items-center px-2 py-2 text-sage-800">
                <LayoutIcon className="h-6 w-6" />
                <span className="ml-2 font-semibold">Career Tracker</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map(({ path, icon: Icon, text }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center px-3 py-2 text-sm font-medium ${
                      isActive(path)
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-sage-700 hover:text-primary-600'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {text}
                  </Link>
                ))}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center px-3 py-2 text-sm font-medium text-sage-700 hover:text-primary-600"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}