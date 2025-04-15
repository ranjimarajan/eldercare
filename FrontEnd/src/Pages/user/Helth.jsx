import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Health.css';

function Health() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/nurses/getAllBlog');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="health-container">
      <header className="health-header">
        <h1 className="health-title">Daily Health Tips</h1>
        <p className="health-tagline">Simple ways to improve your wellbeing every day</p>
      </header>

      <div className="health-articles">
        {blogs.length > 0 ? (
          blogs.map((blog, index) => (
            <article key={index} className="health-article">
              <h2 className="article-title">{blog.title}</h2>
              <p className="article-content">{blog.content}</p>
              <div className="article-date">Posted on {new Date(blog.date).toLocaleDateString()}</div>
            </article>
          ))
        ) : (
          <p>Loading health tips...</p>
        )}
      </div>

      <footer className="health-footer">
        <p>© 2025 Health Tips Blog | New content published weekly</p>
      </footer>
    </div>
  );
}

export default Health;
