import React from 'react';
import { FileText } from 'lucide-react';

export default function ReviewTemplates() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-4">
      <h2 className="font-medium text-sage-800 mb-4">Available Templates</h2>
      
      <div className="space-y-4">
        <div className="p-4 border border-sage-100 rounded-lg hover:bg-sage-50 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="text-sm font-medium text-sage-800">Self Reflection</h3>
              <p className="text-sm text-sage-600">Personal growth and achievements</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border border-sage-100 rounded-lg hover:bg-sage-50 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="text-sm font-medium text-sage-800">Manager Review</h3>
              <p className="text-sm text-sage-600">Performance evaluation template</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}