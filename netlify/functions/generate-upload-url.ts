import { Storage } from '@google-cloud/storage';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid'; //  For unique file names
import 'dotenv/config'; 
//  Load service account credentials (IMPORTANT:  Use environment variables!)
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
if (!credentials) {
    throw new Error('GOOGLE_CREDENTIALS environment variable is not set.');
}
if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  }
const storage = new Storage({
    credentials,
 
});

const bucketName = process.env.GOOGLE_STORAGE_BUCKET||'whoozh2'; //  Also from env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end({ error: 'Method Not Allowed' });
  }

  try {
    const { filename, contentType } = req.body;

    if (!filename || !contentType) {
      return res.status(400).json({ error: 'filename and contentType are required' });
    }
    const uniqueFilename = `${uuidv4()}-${filename}`; // Ensure unique names
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(uniqueFilename);

    const signedUrlConfig = {
      action: 'write' as const,
      expires: Date.now() + 15 * 60 * 1000, //  15 minutes
      version: 'v4' as const, // Use V4 signing
      contentType, // Set the content type
    };

    const [signedUrl] = await file.getSignedUrl(signedUrlConfig);

    res.status(200).json({
      signedUrl,
      filename: uniqueFilename, //  Return the filename to the client
      storageUrl: `https://storage.googleapis.com/${bucketName}/${uniqueFilename}`, // Construct the full URL
    });
  } catch (error: any) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Failed to generate signed URL', message: error.message });
  }
}