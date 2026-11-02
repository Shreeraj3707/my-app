import OpenAI from 'openai';

export async function createEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  // Safe check: If no key is set, return empty array instead of crashing
  if (!apiKey || apiKey.trim() === '') {
    return [];
  }

  try {
    const openai = new OpenAI({ apiKey });

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.replace(/\n/g, ' '),
    });

    return response.data[0].embedding;
  } catch (error) {
    console.warn('Embedding generation skipped:', error);
    return [];
  }
}