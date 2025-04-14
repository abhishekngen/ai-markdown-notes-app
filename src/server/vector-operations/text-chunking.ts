'use server';

import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export async function chunkNote(noteContent: string) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 250,
    });

    const docs = await splitter.createDocuments([noteContent]);
    const chunks = docs.map((doc) => doc.pageContent);

    return chunks;
}
