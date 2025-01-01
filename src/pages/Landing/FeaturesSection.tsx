import React from 'react';
import { Medal, Target, LineChart, Clock } from 'lucide-react';

export function FeaturesSection() {
  return (
    <div className="bg-sage-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-sage-900 sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-6 text-lg leading-8 text-sage-600">
            Our comprehensive toolkit helps you track, analyze, and showcase your professional growth.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {[
              {
                name: 'Achievement Tracking',
                description: 'Log your wins as they happen. Categorize and tag achievements for easy reference.',
                icon: Medal,
              },
              {
                name: 'Goal Setting',
                description: 'Set clear objectives and track your progress towards achieving them.',
                icon: Target,
              },
              {
                name: 'Growth Analytics',
                description: 'Visualize your professional development with insightful charts and metrics.',
                icon: LineChart,
              },
              {
                name: 'Review Preparation',
                description: 'Never scramble before a review again. Your achievements are always organized.',
                icon: Clock,
              },
            ].map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-sage-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-sage-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}