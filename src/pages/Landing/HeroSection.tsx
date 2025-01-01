import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, LineChart, Users, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold tracking-tight text-sage-900 sm:text-6xl">
              Track Your Career Growth
            </h1>
            <p className="mt-6 text-lg leading-8 text-sage-600">
              Document achievements, gather feedback, and showcase your professional journey. The smart way to manage your career development and stand out in performance reviews.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-md bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="text-lg font-semibold leading-6 text-sage-900 hover:text-sage-700"
              >
                Sign In <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 p-6 rounded-lg">
                <Trophy className="h-8 w-8 text-primary-600 mb-3" />
                <h3 className="font-semibold text-sage-900">Track Achievements</h3>
                <p className="text-sage-600 mt-2">Log and categorize your professional wins</p>
              </div>
              <div className="bg-primary-50 p-6 rounded-lg">
                <LineChart className="h-8 w-8 text-primary-600 mb-3" />
                <h3 className="font-semibold text-sage-900">Monitor Progress</h3>
                <p className="text-sage-600 mt-2">Visualize your growth over time</p>
              </div>
              <div className="bg-primary-50 p-6 rounded-lg">
                <Users className="h-8 w-8 text-primary-600 mb-3" />
                <h3 className="font-semibold text-sage-900">Team Feedback</h3>
                <p className="text-sage-600 mt-2">Collect insights from colleagues</p>
              </div>
              <div className="bg-primary-50 p-6 rounded-lg">
                <Star className="h-8 w-8 text-primary-600 mb-3" />
                <h3 className="font-semibold text-sage-900">Performance Reviews</h3>
                <p className="text-sage-600 mt-2">Ace your reviews with data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}