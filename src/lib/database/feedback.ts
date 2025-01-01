import { supabase } from '../supabase';
import type { Feedback } from './types';

export async function getFeedback(userId: string) {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*, provider:profiles!provider_id(full_name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
}

export async function createFeedback(feedback: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert(feedback)
      .select()
      .single();

    if (error) throw error;
    return data as Feedback;
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
}