import { supabase } from '../supabase';
import type { Team, TeamMember } from './types';

export async function getTeams(userId: string) {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        members:team_members_with_profiles(
          user_id,
          role,
          full_name,
          user_role
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as (Team & { members: TeamMember[] })[];
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
}

export async function createTeam(name: string, description?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // First create the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name,
        description
      })
      .select()
      .single();

    if (teamError) throw teamError;

    // Then add the creator as owner
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'owner'
      });

    if (memberError) throw memberError;

    return team as Team;
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
}

export async function inviteTeamMember(teamId: string, email: string, role: 'admin' | 'member' = 'member') {
  try {
    const { data, error } = await supabase.rpc(
      'invite_team_member',
      {
        team_id: teamId,
        member_email: email,
        member_role: role
      }
    );

    if (error) throw error;
    return data as TeamMember;
  } catch (error) {
    console.error('Error inviting team member:', error);
    throw error;
  }
}

export async function updateTeamMemberRole(teamId: string, userId: string, role: 'admin' | 'member') {
  try {
    const { error } = await supabase
      .from('team_members')
      .update({ role })
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating team member role:', error);
    throw error;
  }
}

export async function leaveTeam(teamId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error leaving team:', error);
    throw error;
  }
}