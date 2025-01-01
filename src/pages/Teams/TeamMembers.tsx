import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTeams, updateTeamMemberRole, leaveTeam } from '../../lib/database/teams';
import { UserPlus, UserMinus, Shield } from 'lucide-react';
import type { Team, TeamMember } from '../../lib/database/types';

export default function TeamMembers() {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<Team & { members: TeamMember[] } | null>(null);
  const [teams, setTeams] = useState<(Team & { members: TeamMember[] })[]>([]);
  const [loading, setLoading] = useState(true);

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
      if (data.length > 0) {
        setSelectedTeam(data[0]);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'member') => {
    if (!selectedTeam || !user) return;
    try {
      await updateTeamMemberRole(selectedTeam.id, memberId, newRole);
      await fetchTeams();
    } catch (error) {
      console.error('Error updating member role:', error);
    }
  };

  const handleLeaveTeam = async () => {
    if (!selectedTeam || !user) return;
    try {
      await leaveTeam(selectedTeam.id, user.id);
      await fetchTeams();
    } catch (error) {
      console.error('Error leaving team:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
        <div className="text-center text-sage-600">Loading team members...</div>
      </div>
    );
  }

  if (!selectedTeam) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-8">
        <div className="text-center text-sage-600">Select a team to view members</div>
      </div>
    );
  }

  const currentUserRole = selectedTeam.members.find(m => m.user_id === user?.id)?.role;
  const isAdmin = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-sage-100">
      <div className="p-4 border-b border-sage-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-sage-800">Team Members</h2>
          {teams.length > 1 && (
            <select
              value={selectedTeam.id}
              onChange={(e) => setSelectedTeam(teams.find(t => t.id === e.target.value) || null)}
              className="text-sm rounded-md border-sage-200"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {selectedTeam.members.map((member) => (
            <div key={member.user_id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-sage-100 rounded-full p-2">
                  <Shield className="h-4 w-4 text-sage-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-sage-800">
                    {member.user?.full_name || 'Unknown User'}
                  </p>
                  <p className="text-xs text-sage-500">{member.role}</p>
                </div>
              </div>

              {isAdmin && member.user_id !== user?.id && member.role !== 'owner' && (
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.user_id, e.target.value as 'admin' | 'member')}
                  className="text-sm rounded-md border-sage-200"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => {/* TODO: Add invite member modal */}}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Invite Member
          </button>

          {currentUserRole !== 'owner' && (
            <button
              onClick={handleLeaveTeam}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <UserMinus className="h-4 w-4 mr-1" />
              Leave Team
            </button>
          )}
        </div>
      </div>
    </div>
  );
}