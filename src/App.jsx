import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import VerifyEmail from './pages/VerifyEmail';
import LoginOption from './pages/LoginOption';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Public routes */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/loginoptions" element={isAuthenticated ? <Navigate to="/" /> : <LoginOption />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
