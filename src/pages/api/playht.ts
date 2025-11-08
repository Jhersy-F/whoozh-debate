import * as PlayHT from 'playht';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import axios from 'axios'; 

PlayHT.init({
    apiKey: "" ,
    userId: process.env.PLAYHT_USER_ID || '',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { text  } = req.body;
            const voiceEngine = 'PlayHT2.0';
            const generated = await PlayHT.generate(text, {
                voiceId: 's3://voice-cloning-zero-shot/pvdYidDCyDaGrIf457yKB/sample/manifest.json',
                voiceEngine,
                speed: 1,
            });

            if (!generated || !generated.audioUrl) { // Check for audioUrl
                return res.status(500).json({ error: 'Failed to generate audio URL' });
            }

            // Download the audio file
            const audioResponse = await axios.get(generated.audioUrl, {
                responseType: 'arraybuffer', // Important: Get binary data
            });

            // Save audio to folder
            const filename = `audio-${Date.now()}.mp3`;
            const filePath = path.join(process.cwd(), 'public', 'audios', filename);

            fs.writeFileSync(filePath, Buffer.from(audioResponse.data, 'binary'));

            const audioUrl = `${filename}`;
            res.status(200).json({ audioUrl });
        } catch (error) {
            console.error('PlayHT Error:', error);
            res.status(500).json({ error: 'Failed to generate and save audio' });
        }
    } else {
        res.status(405).end();
    }
}