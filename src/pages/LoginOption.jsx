import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import OTPVerification from '@/pages/OTPVerification';
import ForgotPassword from './ForgotPassword';
import axiosInstance from '@/lib/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/authSlice'; 

const LoginOption = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const dispatch = useDispatch(); 

  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/login', formData)
      if (response.status === 200) {
        toast.success('Login successful! using Password')
        dispatch(login(response.data.data.user));
        navigate('/')
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Login failed. Please try again.')
      } else if (error.request) {
        toast.error('No response from server. Please try again later.')
      } else {
        toast.error('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOTPLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/send-otp', { email: formData.email })
      if (response.status === 200) {
        toast.success('OTP sent successfully. Please enter the OTP.')
        setShowOTP(true)
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Failed to send OTP. Please try again.')
      } else if (error.request) {
        toast.error('No response from server. Please try again later.')
      } else {
        toast.error('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handleVerificationComplete = () => {
    toast.success('Login completed successfully!')
    navigate('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gray-900 px-4"
    >
      <Card className="w-full max-w-sm md:max-w-md p-4 md:p-6">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Login</h2>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
            </TabsList>
            <TabsContent value="password">
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pl-10"
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
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login with Password'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="otp">
              <form onSubmit={handleOTPLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email-otp">Email</Label>
                  <div className="relative">
                    <Input
                      id="email-otp"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Login with OTP'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Don&apos;t have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
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
  )
}

export default LoginOption

