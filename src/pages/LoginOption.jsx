import  { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, Key } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import OTPVerification from '@/pages/OTPVerification';
import ForgotPassword from './ForgotPassword';
import axiosInstance from '@/lib/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/authSlice';

const LoginOption = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!emailPattern.test(formData.email)) {
      toast.error('Email is invalid.');
      return false;
    }
    if (loginMethod === 'password' && formData.password.length < 6) {
      toast.error('Password is invalid. It should be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      if (loginMethod === 'password') {
        const response = await axiosInstance.post('/auth/login', formData);
        if (response.status === 200) {
          toast.success('Login successful using Password');
          dispatch(login(response.data.data.user));
          navigate('/');
        }
      } else {
        const response = await axiosInstance.post('/auth/send-otp', { email: formData.email });
        if (response.status === 200) {
          toast.success('OTP sent successfully. Please enter the OTP.');
          setShowOTP(true);
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Login failed. Please try again.');
      } else if (error.request) {
        toast.error('No response from server. Please try again later.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleVerificationComplete = () => {
    toast.success('Login completed successfully!');
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 px-4"
    >
      <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md border-gray-700">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Choose your login method</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={() => setLoginMethod('password')}
              className={`flex-1 ${loginMethod === 'password' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <Lock className="mr-2" size={18} />
              Password
            </Button>
            <Button
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 ${loginMethod === 'otp' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <Key className="mr-2" size={18} />
              OTP
            </Button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder='Enter your email'
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            {loginMethod === 'password' && (
              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    placeholder='Enter your password'
                    onChange={handleChange}
                    required
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}
            {loginMethod === 'password' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Processing...' : `Login with ${loginMethod === 'password' ? 'Password' : 'OTP'}`}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-400">
          Don&apos;t have an account? <span className='ml-2' >
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
            Sign Up
          </Link>
          </span>
        </CardFooter>
      </Card>

      {showOTP && (
        <OTPVerification
          email={formData.email}
          onVerificationComplete={handleVerificationComplete}
        />
      )}

      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
    </motion.div>
  );
};

export default LoginOption;

