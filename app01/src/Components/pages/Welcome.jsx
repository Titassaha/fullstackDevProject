import React, { useState } from 'react'
import AWS from 'aws-sdk';
import awsConfig from '../../aws-config.json'

const Welcome = () => {
  const username = localStorage.getItem("username");


  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    setUploading(true);

    AWS.config.update(awsConfig);

    const s3 = new AWS.S3();

    const params = {
      Bucket: 'bucketapp014', // Specify your bucket name
      Key: file.name,
      Body: file
    };

    // Upload file to S3
    try {
      const data = await s3.upload(params).promise();
      console.log('File uploaded successfully:', data.Location);
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }

    setUploading(false);
  };


  return (
    <div>
      <p>Hi {username}, Welcome !</p>
      <button onClick={() => { localStorage.clear() }}>Logout</button>

      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

    </div>
  )
}

export default Welcome
