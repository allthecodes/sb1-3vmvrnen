import React from 'react';
import FeedbackList from './FeedbackList';
import ProvideFeedback from './ProvideFeedback';

export default function Feedback() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FeedbackList />
        </div>
        <div className="lg:col-span-1">
          <ProvideFeedback />
        </div>
      </div>
    </div>
  );
}