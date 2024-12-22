import { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, User, Phone, Lock, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
    phone: '',
    profilePic: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(''); // New state for error message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when the user types
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePic: file
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match"); // Set error message
      return;
    }
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      await axiosInstance.post('/auth/signup', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Signup successful!');
      setFormData({
        name: '',
        username: '',
        password: '',
        email: '',
        confirmPassword: '',
        phone: '',
        profilePic: null
      });
      setImagePreview(null);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const namePattern = /^[A-Za-z ]{3,}$/;
    const usernamePattern = /^[A-Za-z0-9]{3,}$/;
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!namePattern.test(formData.name)) {
      toast.error('Name is invalid. It should contain only letters and spaces, and be at least 3 characters long.');
      return false;
    }
    if (!usernamePattern.test(formData.username)) {
      toast.error('Username is invalid. It should contain only alphanumeric characters and be at least 3 characters long.');
      return false;
    }
    if (!emailPattern.test(formData.email)) {
      toast.error('Email is invalid.');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password is invalid. It should be at least 6 characters long.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }
    if (!phonePattern.test(formData.phone)) {
      toast.error('Phone Number is invalid. It should contain exactly 10 digits.');
      return false;
    }
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center  bg-gradient-to-b from-blue-900 to-gray-900 px-4 py-24"
    >
      <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md border-gray-700 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <motion.h2 
            className="text-3xl font-bold text-white"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          >
            Create Account
          </motion.h2>
          <motion.p 
            className="text-gray-400 mt-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
          >
            Join our community today
          </motion.p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6">
              <Label htmlFor="profilePic" className="cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-blue-500 hover:border-blue-400 transition-colors duration-200">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <Input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {/* <p className="text-center text-sm text-gray-400 mt-2">Upload Profile Picture</p> */}
              </Label>
            </div>
            <div>
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <div className="relative mt-1">
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  pattern="[A-Za-z ]{3,}"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div>
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <div className="relative mt-1">
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  pattern="[A-Za-z0-9]{3,}"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
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
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <div className="relative mt-1">
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
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
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-400 pt-6">
          Already have an account? {" "}
          <span className='ml-2' >
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
            Sign Up
          </Link>
          </span>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SignUp;
