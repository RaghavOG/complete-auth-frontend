import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import OTPVerification from '@/pages/OTPVerification';
import ForgotPassword from './ForgotPassword';
import axiosInstance from '@/lib/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!emailPattern.test(formData.email)) {
      toast.error('Email is invalid.');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password is invalid. It should be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/auth/loginUsingpasswordandotp`,
        formData
      );

      if (response.status === 200) {
        toast.success('Login successful! Please enter OTP.');
        setShowOTP(true);
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
    toast.success('Login completed successfully! via OTP');
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 px-4"
    >
      <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md border-gray-700 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <motion.h2 
            className="text-3xl font-bold text-white"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          >
            Welcome Back
          </motion.h2>
          <motion.p 
            className="text-gray-400 mt-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
          >
            Sign in to your account
          </motion.p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter your email'
                  required
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  placeholder='Enter your password'
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-400 hover:text-blue-300 focus:outline-none focus:underline transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <LogIn className="mr-2" size={18} />
                  Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-400 pt-6">
          Don&apos;t have an account? {" "}
          <span className='ml-2' >
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

export default Login;

