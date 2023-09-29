import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/notification';
import blogService from './services/blogService';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import ErrorNotification from './components/ErrorNotification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [succesMessage, setSuccesMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const logout = () => {
    localStorage.clear();
    console.log('token cleared!');
  };

  return (
    <div>
      <ErrorNotification message={errorMessage} />
      <Notification message={succesMessage} />
      {!user && (
        <div>
          <h1>log in to application</h1>
          {loginForm()}
        </div>
      )}
      {user && (
        <div>
          <h1>blogs</h1>
          <p>
            {user.name} logged in<button onClickCapture={logout}>logout</button>
          </p>
          <BlogForm
            blogs={blogs}
            setBlogs={setBlogs}
            setErrorMessage={setErrorMessage}
            setSuccesMessage={setSuccesMessage}
          />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
