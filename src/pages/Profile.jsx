import  { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/authSlice';
import axiosInstance from '@/lib/axiosInstance';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { toast } from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });

  if (!user) return <div className="text-center p-4">Loading...</div>;

  // Handle logout
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      dispatch(logout());
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed, please try again.');
    }
  };

  // Handle logout from all sessions
  const handleLogoutAll = async () => {
    try {
      await axiosInstance.post('/auth/logout-all');
      dispatch(logout());
      toast.success('Logged out from all sessions!');
    } catch (error) {
      console.error('Logout all failed:', error);
      toast.error('Logout from all sessions failed, please try again.');
    }
  };

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Password validation
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      await axiosInstance.post('/auth/change-password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Change password failed:', error);
      toast.error('Failed to change password');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.profilePic} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">@{user.username}</p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Phone:</span> {user.phone}</p>
        </div>

        <div className="flex space-x-4 mb-6">
          <Button onClick={handleLogout}>Logout</Button>
          <Button variant="outline" onClick={handleLogoutAll}>Logout from all sessions</Button>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <h3 className="text-lg font-semibold">Change Password</h3>
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit">Change Password</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Profile;
