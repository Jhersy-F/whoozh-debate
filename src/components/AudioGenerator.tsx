// components/AudioGenerator.tsx
'use client'
import React, { useState } from 'react';

//interface AudioGeneratorProps {}

export const AudioGenerator: React.FC<object> = () => {
    const [text, setText] = useState<string>('');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/generate-audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate audio');
            }

            const data = await response.json();
            setAudioUrl(data.audioUrl);
        } catch (err: unknown) {
            // Using 'any' for error, you can define a more specific type if needed
            console.error('Error:', err);
            setError('Error generating audio. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to convert to audio"
                />
                <button type="submit" disabled={isLoading} style={{backgroundColor:'blue',color:'white'}}>
                    {isLoading ? 'Generating Audio...' : 'Generate Audio'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {audioUrl && (
                <div>
                    <audio controls src={audioUrl}>
                        Your browser does not support the audio element.
                    </audio>
                    <p>
                        <a href={audioUrl} target="_blank" rel="noopener noreferrer">
                            Download Audio
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};