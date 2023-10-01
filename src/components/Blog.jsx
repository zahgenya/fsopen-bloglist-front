import { useState, useImperativeHandle } from 'react';

const Blog = ({ blog, addLike }) => {
  const [visible, setVisible] = useState('');

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const paragraphStyle = {
    margin: '4px 0',
  };

  return (
    <div style={blogStyle}>
      <div onClick={toggleVisibility}>
        <span>{blog.title}</span>
        <button>{visible ? 'Hide' : 'View'}</button>
      </div>
      <div style={showWhenVisible}>
        <p style={paragraphStyle}>{blog.url}</p>
        <p style={paragraphStyle}>
          likes: {blog.likes}
          <button onClick={() => addLike(blog.id)}>like</button>
        </p>
        <p style={paragraphStyle}>{blog.author}</p>
        <button onClick={toggleVisibility}>Hide</button>
      </div>
    </div>
  );
};

export default Blog;
