import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/lib/axiosInstance'; // Import axiosInstance

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        // Send token to backend for verification using axiosInstance
        const response = await axiosInstance.post('/auth/verify-email', { token });
        setMessage(response.data.message);
        toast.success(response.data.message);

        // You can redirect the user to login after successful verification
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Something went wrong');
        toast.error(error.response?.data?.message || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-4 bg-white rounded-md shadow-md text-center">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <h2 className="text-xl font-bold">{message}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
