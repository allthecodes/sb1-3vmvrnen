import React from 'react';
import { Users, Settings } from 'lucide-react';
import type { Team, TeamMember } from '../../../lib/database/types';
import { useAuth } from '../../../contexts/AuthContext';

interface TeamCardProps {
  team: Team & { members: TeamMember[] };
  onUpdate: () => void;
}

export function TeamCard({ team, onUpdate }: TeamCardProps) {
  const { user } = useAuth();
  const userMember = team.members.find(m => m.user_id === user?.id);
  const isAdmin = userMember?.role === 'owner' || userMember?.role === 'admin';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="bg-primary-100 rounded-lg p-3">
            <Users className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-sage-800">{team.name}</h3>
            {team.description && (
              <p className="mt-1 text-sm text-sage-600">{team.description}</p>
            )}
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-sm text-sage-500">
                {team.members.length} member{team.members.length === 1 ? '' : 's'}
              </span>
              {isAdmin && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                  {userMember?.role}
                </span>
              )}
            </div>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => {/* TODO: Add team settings modal */}}
            className="text-sage-400 hover:text-sage-600"
          >
            <Settings className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}