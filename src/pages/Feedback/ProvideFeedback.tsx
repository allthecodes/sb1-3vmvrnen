import React from 'react';
import { Send } from 'lucide-react';

export default function ProvideFeedback() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-medium text-gray-900 mb-4">Provide Feedback</h2>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Recipient</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="">Select a team member</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="peer">Peer Feedback</option>
            <option value="manager">Manager Feedback</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Feedback</label>
          <textarea
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Write your feedback here..."
          />
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Feedback
        </button>
      </form>
    </div>
  );
}