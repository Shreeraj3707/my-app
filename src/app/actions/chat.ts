'use server';

import { createClient } from '@/lib/supabase/server';
import { ratelimit } from '@/lib/rate-limit';

export async function askAI(userMessage: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Rate limit the chatbot (5 messages per minute)
    if (user) {
      const { success } = await ratelimit.limit(`chat_${user.id}`);
      if (!success) return "You are sending messages too fast. Please wait a minute.";
    }

    // 1. Fetch context from your database (RAG)
    // We grab the 3 most recent blog posts to give the AI context
    const { data: posts } = await supabase
      .from('posts')
      .select('title, content')
      .order('created_at', { ascending: false })
      .limit(3);

    const context = posts?.map(p => `Title: ${p.title}\nContent: ${p.content}`).join('\n\n') || 'No posts yet.';

    // 2. Call the AI with the context
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for a Next.js SaaS app. You have access to the following recent blog posts:\n\n${context}\n\nAnswer the user's question based on this context. Keep answers brief.`
          },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    if (data.error) return `Error: ${data.error.message}`;
    
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Chat AI Error:', error);
    return 'Failed to connect to AI.';
  }
}