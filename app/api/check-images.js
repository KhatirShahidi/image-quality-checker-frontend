import { classifyImage } from '@/utils/azureVision';
import { isImageBlurry } from '@/utils/imageQuality';

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({ message: 'Hello, world!' });
}
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { file } = req.body;
  if (!file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const buffer = Buffer.from(file, 'base64');

  // Step 1: Check if the image is blurry using OpenCV
  const isBlurry = isImageBlurry(buffer);
  if (isBlurry) {
    return res
      .status(200)
      .json({ message: 'Image is blurry', accepted: false });
  }

  // Step 2: Classify the image using Azure Custom Vision
  const classificationResult = await classifyImage(buffer);
  if (classificationResult) {
    return res
      .status(200)
      .json({
        message: 'Image classified successfully',
        result: classificationResult,
      });
  } else {
    return res.status(500).json({ message: 'Failed to classify image' });
  }
