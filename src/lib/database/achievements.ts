import { supabase, retryOperation } from '../supabase';
import type { Achievement } from './types';

export async function getAchievements(userId: string) {
  try {
    const { data, error } = await retryOperation(() => 
      supabase
        .from('achievements')
        .select(`
          *,
          job:jobs(*)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false })
    );

    if (error) throw error;
    return data as (Achievement & { job: any })[];
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
}

export async function createAchievement({
  user_id,
  job_id,
  title,
  description,
  date,
  category,
  impact_level,
  attachments
}: Omit<Achievement, 'id' | 'created_at' | 'updated_at'> & { attachments?: File[] }) {
  try {
    // First create the achievement record
    const { data: achievement, error: achievementError } = await supabase
      .from('achievements')
      .insert({
        user_id,
        job_id,
        title,
        description,
        date,
        category,
        impact_level
      })
      .select()
      .single();

    if (achievementError) throw achievementError;

    // If there are attachments, upload them
    if (attachments?.length) {
      const uploadPromises = attachments.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user_id}/${achievement.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('achievement-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        return filePath;
      });

      await Promise.all(uploadPromises);
    }

    return achievement as Achievement;
  } catch (error) {
    console.error('Error creating achievement:', error);
    throw error;
  }
}