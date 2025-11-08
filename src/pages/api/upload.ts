import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

// Configure multer for file uploads
const upload = multer({ dest: 'public/uploads/' });
interface MulterNextApiRequest extends NextApiRequest {
  file: Express.Multer.File;
}

// Disable Next.js's default body parser to allow multer to handle the request
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to run middleware
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req: MulterNextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Use multer to handle the file upload
      await runMiddleware(req, res, upload.single('avatar'));

      // Get the file path
      const filePath = req.file?.path;
      if (!filePath) {
        throw new Error('File upload failed');
      }

      // Define the output path for the PNG file
      const outputFilePath = path.join('public/uploads/', `${path.basename(filePath, path.extname(filePath))}.png`);

      // Convert the uploaded image to PNG format using sharp
      await sharp(filePath)
        .toFile(outputFilePath);

      // Remove the original file
      fs.unlinkSync(filePath);

      // Generate the URL for the saved PNG file
      const fileUrl = `/uploads/${path.basename(outputFilePath)}`;

      // Return the file URL to the client
      res.status(200).json({ fileUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}