'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function signUpUser(formData: {
  name: string;
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  // 1. Sign up user via Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.name,
        name: formData.name,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true, user: data.user };
}