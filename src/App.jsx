import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/notification';
import blogService from './services/blogService';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import ErrorNotification from './components/ErrorNotification';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [succesMessage, setSuccesMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);
  const [sortedBlogs, setSortedBlogs] = useState([]);
  const [sortOrder, setSortOrder] = useState('descending');

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' };
    const showWhenVisible = { display: loginVisible ? '' : 'none' };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  const logout = () => {
    localStorage.clear();
    console.log('token cleared!');
  };

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} /> {/* Pass createBlog as a prop */}
    </Togglable>
  );

  const addLike = (id) => {
    const blog = blogs.find((b) => b.id === id);
    const changedBlog = { ...blog, likes: blog.likes + 1 };

    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)));
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(
          `blog '${blog.title}' was already removed from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const sortBlogs = () => {
    const sorted = [...blogs];
    sorted.sort((a, b) => {
      if (sortOrder === 'descending') {
        return b.likes - a.likes;
      } else {
        return a.likes - b.likes;
      }
    });
    setSortedBlogs(sorted);
  };

  useEffect(() => {
    sortBlogs();
  }, [blogs, sortOrder]);

  const removeBlog = (id) => {
    const confirmed = window.confirm('Do you want to remove this blog?');
    if (!confirmed) return;

    blogService.deleteBlog(id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id));
        setSuccesMessage('Blog removed successfully');
        setTimeout(() => {
          setSuccesMessage(null);
        }, 5000);
      })
      .catch((error) => {
        setErrorMessage('Failed to remove blog');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  return (
    <div>
      <ErrorNotification message={errorMessage} />
      <Notification message={succesMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in<button onClickCapture={logout}>logout</button>
          </p>
          {blogForm()}
        </div>
      )}

      <div>
        {sortedBlogs.map((blog) => (
          <Blog key={blog.id} blog={blog} addLike={addLike} removeBlog={removeBlog} />
        ))}
      </div>
    </div>
  );
};

export default App;
