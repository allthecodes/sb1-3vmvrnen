import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function FeedbackList() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Received Feedback</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <MessageSquare className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">Example Feedback</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Peer
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Feedback from your peers and manager will appear here.
              </p>
              <div className="mt-2 text-sm text-gray-500">
                March 1, 1970
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}