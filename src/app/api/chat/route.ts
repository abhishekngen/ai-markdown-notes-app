import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { generateTextEmbedding } from '@/server/vector-operations/text-embeddings';
import { noteChunksRagSearch } from '@/server/db/notes-queries';

export async function POST(req: Request) {
    const { messages } = await req.json();

    const lastUserMessage = messages[messages.length - 1].content;

    const lastUserMessageEmbedding =
        await generateTextEmbedding(lastUserMessage);

    const ragSearchResponse = await noteChunksRagSearch(
        lastUserMessageEmbedding,
        5
    );

    const relevantChunks = ragSearchResponse.data.map(
        // @ts-expect-error response is not typed
        (response) => response.note_chunk
    );

    const augmentedText = `The following are relevant other note snippets the user has written: ${relevantChunks.join(', ')}. You can use these in answering the user's question, which may not just pertain to the current note.`;
    const lastUserMessageWithAugmentedText = `${lastUserMessage} ${augmentedText}`;
    messages[messages.length - 1].content = lastUserMessageWithAugmentedText;

    const result = streamText({
        model: openai('gpt-4o'),
        messages,
        tools: {
            weather: tool({
                description:
                    'Get the current weather for a given latitude/longitude pair.',
                parameters: z.object({
                    latitude: z
                        .number()
                        .describe(
                            'The latitude of the location to get the weather for.'
                        ),
                    longitude: z
                        .number()
                        .describe(
                            'The longitude of the location to get the weather for.'
                        ),
                }),
                execute: async ({ latitude, longitude }) => {
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
                    );
                    const data = await response.json();
                    return {
                        temperature: data.current.temperature_2m,
                        unit: data.current_units.temperature_2m,
                    };
                },
            }),
        },
        maxSteps: 2,
    });

    return result.toDataStreamResponse();
}
