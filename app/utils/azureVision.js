import axios from 'axios';

const endpoint = process.env.AZURE_CUSTOM_VISION_ENDPOINT;
const apiKey = process.env.AZURE_CUSTOM_VISION_KEY;

export async function classifyImage(imageBuffer) {
  const url = `${endpoint}/customvision/v3.0/Prediction/${process.env.AZURE_CUSTOM_VISION_PROJECT_ID}/classify/iterations/${process.env.AZURE_CUSTOM_VISION_PREDICTION_MODEL}/image`;

  try {
    const response = await axios.post(url, imageBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Prediction-Key': apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in classifyImage:', error.message);
    return null;
  }
}
