'use server';
import OpenAI from 'openai';
const openai = new OpenAI();

export async function generateTextEmbedding(text: string) {
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
    });

    return embedding.data[0].embedding;
}
