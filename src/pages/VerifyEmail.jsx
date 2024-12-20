/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/redux/authSlice';
import axiosInstance from '@/lib/axiosInstance'; // Import axiosInstance

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const verifyEmail = async () => {
        try {
          setLoading(true);
          // Send token to backend for verification using axiosInstance
          const response = await axiosInstance.post('/auth/verify-email', { token });
          setMessage(response.data.message);
          toast.success(response.data.message);
          if (response.status === 200) {
            const { emailVerified } = response.data.data;
            dispatch(updateUser({ emailVerified }));
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
          // You can redirect the user to login after successful verification
        } catch (error) {
          setMessage(error.response?.data?.message || 'Something went wrong');
          toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
          setLoading(false);
        }
      };

      verifyEmail();
      effectRan.current = true;
    }
  }, [token]);

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
