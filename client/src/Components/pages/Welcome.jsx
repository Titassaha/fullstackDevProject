import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Welcome = () => {
    const username = localStorage.getItem("username");
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [code, setCode] = useState("");
    const [uploading, setUploading] = useState(false);
    const [receiveCode, setReceiveCode] = useState(0);
    const [fileContent, setFileContent] = useState(null);
    const filenameAPI = "http://localhost:4000";

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const generateRandomCode = () => {
        return window.crypto.getRandomValues(new Uint8Array(4)).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const s3 = new AWS.S3();
    AWS.config.update({
        accessKeyId: "AKIA2SHE6I3NPN6GTBX6",
        secretAccessKey: "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",
        region: 'ap-south-1'
    });

    const uploadFile = async () => {
        if (!file) {
            alert('Please select a file.');
            return;
        }

        const randomCode = generateRandomCode();
        setCode(randomCode);
        setUploading(true);

        const params = {
            Bucket: 'bucketapp014', // Specify your bucket name
            Key: file.name,
            Body: file,
            
        };
        console.log('filename', file.name);

        // Upload file to S3
        try {
            const data = await s3.upload(params).promise();
            console.log('File uploaded successfully:', data);
            if(data.Location) {
                const body = {
                    filename : file.name,
                    randomcode : randomCode
                }
                const res = await axios.post(filenameAPI+"/filemap", body);
            }
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        }

        setUploading(false);
    };

    useEffect(() => {
        const jwt = localStorage.getItem("jwt_token");
        if (!jwt) {
            navigate("/login");
        }
    }, [navigate]);

    const getFileByRandomCode = async (filename) => {
        
        const params = {
            Bucket: 'bucketapp014', // Your bucket name
            Key: filename,        // Use the random code as the key
        };
        console.log("filename :", filename);
        try {
            const signedUrl = s3.getSignedUrl('getObject', params);
            
            console.log("signedUrl",signedUrl);
            const response = await axios.get(signedUrl, { responseType: 'arraybuffer' });

            const a = document.createElement('a');
            a.href = signedUrl;
            a.download = filename || 'file'; // Use filename from metadata
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(signedUrl);


            // const data = await s3.getObject(params).promise();
            // console.log("data", data);
            console.log('File retrieved successfully');
            return { content: response.data}; // Return both content and metadata
        } catch (error) {
            console.error('Error retrieving file:', error);
        }
    };

    const FileDownloadButton = async () => {
        const randomCode = receiveCode; // Replace with your actual random code
        const data = await axios.get(filenameAPI+`/getfile/${randomCode}`);
        const filename = data.data.filename;
        try {
            const content = await getFileByRandomCode(filename);
            console.log(content);
            setFileContent(content);
        } catch (error) {
            console.error('Failed to retrieve file:', error);
        }
    };

    // const handleFileDownload = () => {
    //     if (fileContent) {
    //         const blob = new Blob([fileContent], { type: 'application/octet' });
    //         const url = URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         console.log("filecontent :", fileContent);
    //         a.download = file.name || 'file'; // Use filename from metadata
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    //         URL.revokeObjectURL(url);
    //     }
    // };

    return (
        <div>
            <p>Hi {username}, Welcome!</p>
            <button onClick={() => { localStorage.clear(); navigate("/login") }}>Logout</button>

            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={uploadFile} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload File'}
                </button>
                <div>
                    {code ? <p>{code}</p> : ""}
                </div>
            </div>

            <div>
                <input type="number" onChange={(e) => { setReceiveCode(e.target.value) }} />
                <button onClick={FileDownloadButton}>Fetch from s3</button>
                {/* <button onClick={handleFileDownload}>Download file</button> */}
            </div>
        </div>
    );
};

export default Welcome;
