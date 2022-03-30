import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  useParams,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
const fakeAuth = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve('2342f2f1d131rf12'), 250);
  });

const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = React.useState(null);

  const handleLogin = async () => {
    const token = await fakeAuth();

    setToken(token);

    const origin = location.state?.from?.pathname || '/dashboard';
    navigate(origin);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};


const BlogPosts = {
  '1': {
    title: 'First Blog Post',
    description: 'Lorem ipsum dolor sit amet, consectetur adip.'
  },
  '2': {
    title: 'Second Blog Post',
    description: 'Hello React Router v6'
  }
};

function Post() {
  const { slug } = useParams();
  const post = BlogPosts[slug];

  const { title, description } = post;

  return (
    <div style={{ padding: 20 }}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route index element={<Login auth={useAuth()}/>} />
        {<Route path="login" element={<Login auth={useAuth()}/>} />}
        <Route path='dashboard' element={<Dashboard />}>
          <Route path="home" element={<Home />} />
          <Route 
            path="/about" 
            element={ 
              <ProtectedRoute>
                <About />
              </ProtectedRoute>} 
            />
          <Route path="posts" 
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>}
              >
            <Route path="/" element={<PostLists />} />
            <Route path=":slug" element={<Post />} />
          </Route>
        </Route>
      </Routes>
      </AuthProvider>
    </Router>
  );
}

const Navigation = () => {
  const { token, onLogout } = useAuth();
  return(
    <nav style={{ margin: 10 }}>
        <Link to="/home" style={{ padding: 5 }}>
          Home
        </Link>
        <Link to="/about" style={{ padding: 5 }}>
          About
        </Link>
        <Link to="/posts" style={{ padding: 5 }}>
          Posts
        </Link>
      {token && (
        <button type="button" onClick={onLogout}>
          Sign Out
        </button>
      )}
      {!token && <Navigate replace to="/login" />}
      </nav>
  )
}
const Home = () => {
  const { onLogin } = useAuth();

  return (
    <>
      <h2>Home (Public)</h2>

      <button type="button" onClick={onLogin}>
        Sign In
      </button>
    </>
  );
};

const Login = props => {
  const { onLogin } = useAuth();
  return(
      <div>
          <h1>Login</h1>
          <button type="button" onClick={onLogin}>
              Sign In
          </button>
          <Outlet />
      </div>
  )
}


const Dashboard = () => {
  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  )
}
function About() {
  const { token } = useAuth();
  return (
    <div style={{ padding: 20 }}>
      <h2>About View</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
      <div>Authenticated as {token}</div>
    </div>
  );
}

function Posts() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Blog</h2>
      {/* render any matching child */}
      <Outlet />
    </div>
  );
}

function PostLists() {
  return (
    <ul>
      {Object.entries(BlogPosts).map(([slug, { title }]) => (
        <li key={slug}>
          <Link to={`/posts/${slug}`}>
            <h3>{title}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
export default App;
