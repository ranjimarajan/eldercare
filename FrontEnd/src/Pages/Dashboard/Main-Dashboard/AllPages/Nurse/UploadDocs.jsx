import React, { useState, useEffect } from 'react';
import Sidebar from '../../GlobalFiles/Sidebar';
import lighthouse from '@lighthouse-web3/sdk'
import axios from 'axios';
import MyDocs from '../../../../../Components/projectRelated/Mydocs';

function UploadDocs() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get user email from localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setEmail(user.email || '');
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !file || !email) {
      setMessage('Please fill in all required fields');
      return;
    }
    
    setUploading(true);
    setMessage('Uploading document...');
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('email', email);
    
    try {
      // Lighthouse expects an array of files or a FileList object
      const apiKey = '37354b07.82b4435e728e4e32b88a1ad996b7d895';
      
      // Fix: Create a proper FileList-like structure that Lighthouse can iterate over
      const fileArray = [file];
      
      // Pass the array of files and apiKey to the upload function
      const uploadResponse = await lighthouse.upload(fileArray, apiKey);
      console.log(uploadResponse.data.Hash,"from lighthouse");
      
      if (uploadResponse && uploadResponse.data) {
        // Once lighthouse upload is successful, send metadata to your backend
        const backendFormData = new FormData();
        backendFormData.append('title', title);
        backendFormData.append('email', email);
        backendFormData.append('cid', uploadResponse.data.Hash); // Store the CID from Lighthouse
        console.log('Title:', title);
        console.log('Email:', email);
        console.log('CID:', uploadResponse.data.Hash);
        let cid = uploadResponse.data.Hash
        
        const dataNew = {
            title: title,
            email: email,
            cid: uploadResponse.data.Hash
          };
          
          console.log(dataNew, "data new");
          
          // Send metadata to your backend
        let response= await axios.post('http://localhost:5000/project/addDocs',{dataNew})   
          console.log(response)
        //   const response = await fetch('http://localhost:5000/project/addDocs', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json'  // Important!
        //     },
        //     body: JSON.stringify(dataNew),  // Convert object to JSON string
        //   });
        // const data = await response.json();
        
        if (response.data) {
          setMessage('Document uploaded successfully!');
          setTitle('');
          setFile(null);
          // Reset file input
        } else {
          setMessage(`Upload failed:  'Unknown error'}`);
        }
      } else {
        setMessage('Upload to Lighthouse failed');
      }
    } catch (error) {
      setMessage(`Upload error: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
   <div>
   
             <div style={{ display: 'flex' }}>
      <Sidebar />
     
      <div className="upload-container" style={{ 
        flex: 1, 
        padding: '2rem', 
        maxWidth: '800px', 
        margin: '0 auto' 
      }}>
        <h1 style={{ marginBottom: '2rem' }}>Upload Documents</h1>
        
        {message && (
          <div style={{ 
            padding: '0.75rem', 
            marginBottom: '1rem', 
            backgroundColor: message.includes('success') ? '#d1fae5' : '#fee2e2',
            borderRadius: '0.375rem',
            color: message.includes('success') ? '#065f46' : '#b91c1c'
          }}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="title" style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}>
              Document Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.375rem', 
                border: '1px solid #d1d5db' 
              }}
              placeholder="Enter document title"
            />
          </div>
          
          <div>
            <label htmlFor="fileInput" style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}>
              Document File *
            </label>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.375rem', 
                border: '1px solid #d1d5db' 
              }}
            />
          </div>
          
          <div>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.375rem', 
                border: '1px solid #d1d5db',
                backgroundColor: '#f3f4f6' 
              }}
            />
            <small style={{ display: 'block', marginTop: '0.25rem', color: '#6b7280' }}>
              Automatically retrieved from your account
            </small>
          </div>
          
          <button
            type="submit"
            disabled={uploading}
            style={{ 
              backgroundColor: '#4f46e5', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.375rem', 
              fontWeight: '500',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.7 : 1,
              border: 'none',
              marginTop: '1rem'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>
    </div>
            
      
   </div>
  );
}

export default UploadDocs;