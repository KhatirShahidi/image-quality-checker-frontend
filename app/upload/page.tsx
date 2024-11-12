"use client";
import { useState } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [response, setResponse] = useState<{
    blurry: boolean;
    score: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(false); // New state for controlling camera capture

  // Handle file selection and create a preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  // Handle form submission to upload the image to the backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    if (!selectedFile) {
      setError('Please select or capture a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setLoading(true);

      const res = await fetch('http://192.168.0.171:5000/api/detect_blur', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to fetch the response from the backend.');
      }

      const result = await res.json();
      setResponse(result);
    } catch (error) {
      setError('An error occurred while uploading the file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Upload or Capture Image for Blur Detection</h1>

      {/* Toggle between camera and gallery */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={useCamera}
            onChange={() => setUseCamera(!useCamera)}
          />
          Use Camera
        </label>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input
          type="file"
          accept="image/*"
          capture={useCamera ? 'environment' : undefined}
          onChange={handleFileChange}
        />
        <br />
        {preview && (
          <div style={{ marginTop: '20px' }}>
            <h3>Image Preview:</h3>
            <img
              src={preview}
              alt="Selected"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                margin: '20px auto',
                borderRadius: '10px',
              }}
            />
          </div>
        )}
        <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Uploading...' : 'Check Blur'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h2>Results:</h2>
          <p>Blurry: {response.blurry ? 'Yes' : 'No'}</p>
          <p>Score: {response.score}</p>
        </div>
      )}
    </div>
  );
}