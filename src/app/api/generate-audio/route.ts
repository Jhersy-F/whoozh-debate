// app/api/generate-audio/route.ts
import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';
import fs from 'fs-extra';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

// --- Start of module-level initialization ---

// Initialize credentials and client outside the handler for reuse.
if (!process.env.GOOGLE_CREDENTIALS) {
    throw new Error('GOOGLE_CREDENTIALS environment variable is not set.');
}

let credentials;
try {
    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
} catch {
    // If GOOGLE_CREDENTIALS is a file path, read and parse it
    const credPath = process.env.GOOGLE_CREDENTIALS;
    if (fs.existsSync(credPath)) {
        credentials = JSON.parse(fs.readFileSync(credPath, 'utf-8'));
    } else {
        throw new Error('GOOGLE_CREDENTIALS environment variable is not valid JSON or a valid file path.');
    }
}

if (!credentials.project_id || !credentials.private_key || !credentials.client_email) {
    throw new Error('GOOGLE_CREDENTIALS environment variable is missing required fields (project_id, private_key, client_email).');
}
credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

const textToSpeechClient = new TextToSpeechClient({
    credentials,
});

// Make sure to install the package: npm install @google-cloud/storage
const storage = new Storage({
    credentials,
});

const bucketName = process.env.GOOGLE_STORAGE_BUCKET || 'whoozh2'; // Replace with your bucket name

// --- End of module-level initialization ---

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text } = body;

        // Combine and improve input validation.
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json(
                { error: 'Text parameter is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        if (text.length > 5000) {
            return NextResponse.json(
                { error: 'Text parameter exceeds maximum length of 5000 characters' },
                { status: 413 }
            );
        }
        const request = {   
            input: { text: text },
            voice: { languageCode: 'en-US', name: 'en-US-Wavenet-F' },
            audioConfig: { audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3  },
        };

        const [response] = await textToSpeechClient.synthesizeSpeech(request);

        // Handle cases where audio content might not be returned.
        if (!response.audioContent) {
            console.error("No audio content received from Google Cloud Text-to-Speech API");
            return NextResponse.json(
                { error: 'Failed to generate audio: No content received' },
                { status: 500 }
            );
        }

        const filename = `audio-${Date.now()}.mp3`;
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(filename);

        await file.save(response.audioContent);

        const audioUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
        return NextResponse.json({ audioUrl: audioUrl });

    } catch (error) {
        console.error('Error generating or saving audio:', error);
        return NextResponse.json(
            { error: 'Failed to generate or save audio' },
            { status: 500 }
        );
    }
}