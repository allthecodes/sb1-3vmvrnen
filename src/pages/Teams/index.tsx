import React from 'react';
import { Users } from 'lucide-react';
import TeamsList from './TeamsList';
import TeamMembers from './TeamMembers';

export default function Teams() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Users className="h-6 w-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-sage-800">Teams</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TeamsList />
        </div>
        <div className="lg:col-span-1">
          <TeamMembers />
        </div>
      </div>
    </div>
  );
}