import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  });

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      likes: 0,
    });

    setNewBlog({
      title: '',
      author: '',
      url: '',
    });
  };

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          <label htmlFor='title'>Title:</label>
          <input
            type="text"
            value={newBlog.title}
            id='title'
            name='title'
            onChange={(event) =>
              setNewBlog({ ...newBlog, title: event.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor='author'>Author:</label>
          <input
            type="text"
            value={newBlog.author}
            id='author'
            name='author'
            onChange={(event) =>
              setNewBlog({ ...newBlog, author: event.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id='url'
            name='url'
            value={newBlog.url}
            onChange={(event) =>
              setNewBlog({ ...newBlog, url: event.target.value })
            }
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default BlogForm;