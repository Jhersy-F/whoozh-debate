// pages/api/generate-audio.ts
import { TextToSpeechClient,protos } from '@google-cloud/text-to-speech';
import fs from 'fs-extra';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import 'dotenv/config'; 

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }
    //console.log("key "+ process.env.GOOGLE_PRIVATE_KEY)
    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
        console.log(credentials.project_id)
        if (!credentials) {
            throw new Error('GOOGLE_CREDENTIALS environment variable is not set.');
        }
        if (credentials.private_key) {
            credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
          }
        const client = new TextToSpeechClient({
            //keyFilename: path.join(process.cwd(), 'whoozh-0c85c67b61d1.json'),
            credentials,
        });
     
        const { text } = req.body;

        const request = {   
            input: { text: text },
            voice: { languageCode: 'en-US', name: 'en-US-Wavenet-F' },
            audioConfig: { audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3  },
        };

        const result= await client.synthesizeSpeech(request);
        console.log(result)
        if (Array.isArray(result)){
            const [response] = result
            if (!response || !response.audioContent) {
                throw new Error("No audio content received from Google Cloud Text-to-Speech API");
            }
    
            const audioContent = response.audioContent;
    
            const filename = `audio-${Date.now()}.mp3`;
            const audioFilePath = path.join(process.cwd(), 'public', 'audios', filename);
    
            await fs.ensureDir(path.join(process.cwd(), 'public', 'audios'));
    
            await fs.writeFile(audioFilePath, audioContent, 'binary');
    
            const audioUrl = `/${filename}`;
            res.status(200).json({ audioUrl: audioUrl });
        }
        else{
            console.error("Unexpected result from synthesizeSpeech:", result);
            throw new Error("Unexpected response from Google Cloud Text-to-Speech API. Expected an array.");
        }
     

    } catch (error) {
        console.error('Error generating or saving audio:', error);
        res.status(500).json({ error: 'Failed to generate or save audio' });
    }
}