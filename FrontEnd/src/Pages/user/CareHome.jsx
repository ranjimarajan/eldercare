import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CareHome.css';

function CareHome() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/getAllCare');
        console.log(response,"response")
        setData(response.data);
      } catch (error) {
        console.error('Error fetching caregivers:', error);
      }
    };

    fetchCaregivers();
  }, []);

  return (
    <div className="care-home-container">
      <h2>Caregiver Details</h2>
      <div className="card-container">
        {data.map((caregiver, index) => (
          <div key={index} className="card">
            <h3>{caregiver.Name}</h3>
            <p><strong>Email:</strong> {caregiver.email}</p>
            <p><strong>Place:</strong> {caregiver.place}</p>
            <button>Contact for Post Care</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CareHome;
