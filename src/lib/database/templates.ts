import { supabase, retryOperation } from '../supabase';
import type { ReflectionTemplate, TemplateStatus } from './types';

export async function getTemplates() {
  try {
    const { data, error } = await retryOperation(() =>
      supabase
        .from('reflection_templates')
        .select('*')
        .order('created_at', { ascending: false })
    );

    if (error) throw error;
    return data as ReflectionTemplate[];
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}

export async function createTemplate(
  template: Omit<ReflectionTemplate, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'status'>
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await retryOperation(() =>
      supabase
        .from('reflection_templates')
        .insert({
          ...template,
          user_id: user.id,
          status: 'draft'
        })
        .select()
        .single()
    );

    if (error) throw error;
    return data as ReflectionTemplate;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
}

export async function updateTemplateStatus(id: string, status: TemplateStatus) {
  try {
    const { data, error } = await retryOperation(() =>
      supabase
        .from('reflection_templates')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
    );

    if (error) throw error;
    return data as ReflectionTemplate;
  } catch (error) {
    console.error('Error updating template status:', error);
    throw error;
  }
}