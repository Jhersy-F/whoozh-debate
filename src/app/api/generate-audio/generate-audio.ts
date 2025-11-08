// pages/api/generate-audio.ts
import { TextToSpeechClient,protos } from '@google-cloud/text-to-speech';
import fs from 'fs-extra';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import 'dotenv/config'; 

// --- Start of module-level initialization ---

// 1. Initialize credentials and client outside the handler for reuse.
if (!process.env.GOOGLE_CREDENTIALS) {
    throw new Error('GOOGLE_CREDENTIALS environment variable is not set.');
}
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

if (!credentials.project_id || !credentials.private_key || !credentials.client_email) {
    throw new Error('GOOGLE_CREDENTIALS environment variable is missing required fields (project_id, private_key, client_email).');
}
credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

const client = new TextToSpeechClient({
    credentials,
});

const AUDIO_DIR = path.join(process.cwd(), 'public', 'audios');

// --- End of module-level initialization ---

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { text } = req.body;

        // 2. Combine and improve input validation.
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({ error: 'Text parameter is required and must be a non-empty string' });
        }

        if (text.length > 5000) {
            return res.status(413).json({ error: 'Text parameter exceeds maximum length of 5000 characters' });
        }
        const request = {   
            input: { text: text },
            voice: { languageCode: 'en-US', name: 'en-US-Wavenet-F' },
            audioConfig: { audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3  },
        };

        const [response] = await client.synthesizeSpeech(request);

        // 3. Handle cases where audio content might not be returned.
        if (!response.audioContent) {
            console.error("No audio content received from Google Cloud Text-to-Speech API");
            return res.status(500).json({ error: 'Failed to generate audio: No content received' });
        }

        const filename = `audio-${Date.now()}.mp3`;
        const audioFilePath = path.join(AUDIO_DIR, filename);

        await fs.ensureDir(AUDIO_DIR);
        await fs.writeFile(audioFilePath, response.audioContent, 'binary');

        const audioUrl = `/audios/${filename}`;
        res.status(200).json({ audioUrl: audioUrl });

    } catch (error) {
        console.error('Error generating or saving audio:', error);
        res.status(500).json({ error: 'Failed to generate or save audio' });
    }
}