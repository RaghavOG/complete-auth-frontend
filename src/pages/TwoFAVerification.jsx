/* eslint-disable react/prop-types */
import  { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import axiosInstance from "@/lib/axiosInstance";
import { useDispatch } from "react-redux";
import { login } from "@/redux/authSlice";

const TwoFAVerification = ({ onVerificationComplete }) => {
  const [twoFACode, setTwoFACode] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const tempToken = localStorage.getItem('tempToken');
        if (!tempToken) {
          console.error('Temp token missing');
          toast.error('Session expired. Please log in again.');
          return;
        }
        
      
      const response = await axiosInstance.post('/auth/verify-2fa', 
        { twoFACode },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );

      if (response.status === 200) {
        toast.success('Login successful!');
        dispatch(login(response.data.data.user));
        localStorage.removeItem('tempToken'); // Clear the temporary token
        onVerificationComplete();
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Verification failed. Please try again.');
      } else if (error.request) {
        toast.error('No response from server. Please try again later.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md border-gray-700 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <h2 className="text-3xl font-bold text-white">Two-Factor Authentication</h2>
          <p className="text-gray-400 mt-2">Enter your 2FA code to complete login</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
                placeholder="Enter 2FA code"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                'Verify'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TwoFAVerification;

