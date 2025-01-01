import { supabase } from '../supabase';
import type { Job } from './types';

export async function getJobs(userId: string) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data as Job[];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

export async function createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();

    if (error) throw error;
    return data as Job;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

export async function updateJob(
  jobId: string,
  updates: Partial<Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data as Job;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}