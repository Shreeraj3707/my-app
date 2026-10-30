'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addTask(title: string, status: string, position: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title,
      status,
      position,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding task:', error);
    throw new Error(error.message);
  }

  revalidatePath('/[locale]/dashboard/kanban', 'page');
  return data;
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting task:', error);
    throw new Error(error.message);
  }

  revalidatePath('/[locale]/dashboard/kanban', 'page');
  return true;
}

export async function updateTaskPositions(updates: { id: string; position: number; status: string }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase.from('tasks').upsert(
    updates.map((task) => ({
      id: task.id,
      position: task.position,
      status: task.status,
      user_id: user.id, // Required for RLS
    }))
  );

  if (error) {
    console.error('Error updating positions:', error);
    throw new Error(error.message);
  }

  revalidatePath('/[locale]/dashboard/kanban', 'page');
  return true;
}