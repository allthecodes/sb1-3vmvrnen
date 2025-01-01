import React from 'react';
import { ClipboardList, Calendar } from 'lucide-react';

export default function ReviewsList() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-sage-100">
      <div className="p-4 border-b border-sage-100">
        <h2 className="text-lg font-semibold text-sage-800">Your Reviews</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-sage-50 rounded-lg border border-sage-100">
            <ClipboardList className="h-5 w-5 text-primary-600 mt-1" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-sage-800">Year-End Review 1970</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  Draft
                </span>
              </div>
              <p className="mt-1 text-sm text-sage-600">
                Complete your year-end review and reflection.
              </p>
              <div className="mt-2 flex items-center text-sm text-sage-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Due: March 31, 1970</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}