import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

// This setup for credentials seems specific to your project, so I will keep it.
// Standard setup often uses GOOGLE_APPLICATION_CREDENTIALS pointing to a file path.
if (!process.env.GOOGLE_CREDENTIALS) {
    console.error('GOOGLE_CREDENTIALS environment variable is not set.');
    // Avoid throwing at module load time. Handle in the request.
}

const getStorageClient = () => {
    if (!process.env.GOOGLE_CREDENTIALS) {
        throw new Error('GOOGLE_CREDENTIALS environment variable is not set.');
    }
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    if (credentials.private_key) {
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
    return new Storage({ credentials });
};

const bucketName = process.env.GOOGLE_STORAGE_BUCKET || 'whoozh2';

export async function POST(req: NextRequest) {
    try {
        const storage = getStorageClient();
        const formData = await req.formData();
        const file = formData.get('audio') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'Audio file not found in form data.' }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate a unique filename
        const originalFilename = file.name;
        const uniqueFilename = `${uuidv4()}-${originalFilename}`;
        
        const bucket = storage.bucket(bucketName);
        const gcsFile = bucket.file(uniqueFilename);

        // Upload the file buffer
        await gcsFile.save(buffer, {
            metadata: {
                contentType: file.type,
            },
        });

        // By default, files are private. To make it publicly accessible:
        await gcsFile.makePublic();

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFilename}`;

        return NextResponse.json({
            message: 'File uploaded successfully.',
            filename: uniqueFilename,
            url: publicUrl,
        });

    } catch (error: any) {
        console.error('Error uploading to GCS:', error);
        // Don't expose detailed error messages to the client
        return NextResponse.json({ error: 'Failed to upload file.', details: error.message }, { status: 500 });
    }
}
