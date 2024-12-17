import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../axiosInstance';
import { updateUser } from '../features/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get('/auth/me'); // Fetch user info
        dispatch(updateUser(data));
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      {/* Add other user info as needed */}
    </div>
  );
};

export default Profile;
