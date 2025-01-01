import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTeams } from '../../lib/database/teams';
import { CreateTeamForm } from './components/CreateTeamForm';
import { TeamCard } from './components/TeamCard';
import { PlusCircle } from 'lucide-react';
import type { Team, TeamMember } from '../../lib/database/types';

export default function TeamsList() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<(Team & { members: TeamMember[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user]);

  const fetchTeams = async () => {
    if (!user) return;
    try {
      const data = await getTeams(user.id);
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
        <div className="text-center text-sage-600">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-sage-800">Your Teams</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
          <div className="text-center text-sage-600">
            You haven't joined any teams yet. Create a team to get started!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onUpdate={fetchTeams}
            />
          ))}
        </div>
      )}

      {showCreateForm && (
        <CreateTeamForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            fetchTeams();
            setShowCreateForm(false);
          }}
        />
      )}
    </div>
  );
}