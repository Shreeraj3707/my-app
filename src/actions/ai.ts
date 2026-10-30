'use server';

export async function generateSummary(text: string) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b', // The current free model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Summarize the following text in exactly one short, engaging sentence.'
          },
          { role: 'user', content: text }
        ],
        max_tokens: 60,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Groq API Error:", data.error);
      return `Error: ${data.error.message}`;
    }

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('AI Error:', error);
    return 'Failed to connect to AI.';
  }
}