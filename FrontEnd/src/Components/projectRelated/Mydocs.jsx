import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../Pages/Dashboard/Main-Dashboard/GlobalFiles/Sidebar';

function Mydocs() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.email) {
      setLoading(true);
      axios.get(`http://localhost:5000/project/getMyDocs/${user.email}`)
        .then(response => {
          setDocs(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching documents:', error);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Sidebar />
      <div style={{ 
        flex: 1, 
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '600', 
            color: '#1f2937',
            marginTop: '0',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            My Documents
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading documents...
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}>
                <thead>
                  <tr>
                    <th style={{ 
                      padding: '12px 16px', 
                      backgroundColor: '#f3f4f6', 
                      textAlign: 'left',
                      fontWeight: '500',
                      color: '#4b5563',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Title</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      backgroundColor: '#f3f4f6', 
                      textAlign: 'left',
                      fontWeight: '500',
                      color: '#4b5563',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Email</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      backgroundColor: '#f3f4f6', 
                      textAlign: 'center',
                      fontWeight: '500',
                      color: '#4b5563',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.length > 0 ? (
                    docs.map((doc, index) => (
                      <tr key={index} style={{ 
                        backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                      }}>
                        <td style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e5e7eb',
                          color: '#1f2937'
                        }}>{doc.title}</td>
                        <td style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e5e7eb',
                          color: '#6b7280'
                        }}>{doc.email}</td>
                        <td style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e5e7eb',
                          textAlign: 'center'
                        }}>
                          <a 
                            href={`https://gateway.lighthouse.storage/ipfs/${doc.cid}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                              backgroundColor: '#4f46e5',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              textDecoration: 'none',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              display: 'inline-block',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
                          >
                            View Document
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td 
                        colSpan="3" 
                        style={{ 
                          padding: '1.5rem', 
                          textAlign: 'center',
                          color: '#6b7280'
                        }}
                      >
                        No documents found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mydocs;