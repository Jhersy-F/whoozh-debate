'use client'
import { useState } from 'react';

export default function TextToSpeech() {
    const [text, setText] = useState<string>('');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
        const response = await fetch('/api/playht', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }), // Corrected line
        });

        const data = await response.json();
        if (data.audioUrl) {
            setAudioUrl(data.audioUrl);
        }
        console.log(data);
    };

    return (
        <div style={{marginLeft:100}}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={handleGenerate} style={{backgroundColor:'blue',color:'white'}}>Generate Audio</button>
            {audioUrl && <audio src={audioUrl} controls />}
        </div>
    );
}

