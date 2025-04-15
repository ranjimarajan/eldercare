import React, { useState } from 'react';
import axios from 'axios';
import './blog.css';

function BlogAdd() {
  const [blog, setBlog] = useState({
    title: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/nurses/addNewBlog', blog);
      console.log('Blog Created:', response.data);
      alert('Blog published successfully!');
      setBlog({ title: '', content: '' }); // Reset form after submission
    } catch (error) {
      console.error('Error submitting blog:', error);
      alert('Failed to publish blog');
    }
  };

  return (
    <div className="blog-form-container">
      <h2>Add New Blog</h2>
      <form onSubmit={handleSubmit} className="blog-form">
        {/* Title Input */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={blog.title}
            onChange={handleChange}
            required
            placeholder="Enter blog title"
          />
        </div>

        {/* Content Input */}
        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            value={blog.content}
            onChange={handleChange}
            required
            placeholder="Write your blog content here..."
            rows="6"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">Publish</button>
      </form>
    </div>
  );
}

export default BlogAdd;
