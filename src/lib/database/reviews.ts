import { supabase, retryOperation } from '../supabase';
import type { ReviewResponse } from './types';

export async function getReviewResponses(userId: string) {
  try {
    const { data, error } = await retryOperation(() =>
      supabase
        .from('review_responses')
        .select(`
          *,
          template:reflection_templates(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching review responses:', error);
    throw error;
  }
}

export async function createReviewResponse(
  templateId: string,
  responses: Record<string, any>,
  status: 'in_progress' | 'completed' = 'completed'
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await retryOperation(() =>
      supabase
        .from('review_responses')
        .insert({
          user_id: user.id,
          template_id: templateId,
          responses,
          status
        })
        .select()
        .single()
    );

    if (error) throw error;
    return data as ReviewResponse;
  } catch (error) {
    console.error('Error creating review response:', error);
    throw error;
  }
}

export async function updateReviewResponse(
  id: string,
  updates: Partial<Pick<ReviewResponse, 'responses' | 'status'>>
) {
  try {
    const { data, error } = await retryOperation(() =>
      supabase
        .from('review_responses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    );

    if (error) throw error;
    return data as ReviewResponse;
  } catch (error) {
    console.error('Error updating review response:', error);
    throw error;
  }
}