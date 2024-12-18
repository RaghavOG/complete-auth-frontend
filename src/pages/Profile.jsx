import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUser } from '@/redux/authSlice';
import axiosInstance from '@/lib/axiosInstance';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, PencilIcon, Camera } from 'lucide-react'
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setNewShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    phone: user?.phone || '',
  });
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showPicDialog, setShowPicDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    logout: false,
    logoutAll: false,
    changePassword: false,
    updateProfile: false,
    updateProfilePic: false,
    deleteProfilePic: false,
    deleteAccount: false,
    resendEmailVerification: false,
  });

  const setLoadingState = (action, isLoading) => {
    setLoadingStates(prevStates => ({
      ...prevStates,
      [action]: isLoading,
    }));
  };

  if (!user) return <div className="text-center p-4">Loading...</div>;

  const handleLogout = async () => {
    setLoadingState('logout', true);
    try {
      await axiosInstance.post('/auth/logout');
      dispatch(logout());
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed, please try again.');
    } finally {
      setLoadingState('logout', false);
    }
  };

  const handleLogoutAll = async () => {
    setLoadingState('logoutAll', true);
    try {
      await axiosInstance.post('/auth/logout-all');
      dispatch(logout());
      toast.success('Logged out from all sessions!');
    } catch (error) {
      console.error('Logout all failed:', error);
      toast.error('Logout from all sessions failed, please try again.');
    } finally {
      setLoadingState('logoutAll', false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    setLoadingState('changePassword', true);
    try {
      await axiosInstance.post('/auth/change-password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success('Password changed successfully');
      setShowPasswordDialog(false);
    } catch (error) {
      console.error('Change password failed:', error);
      toast.error('Failed to change password');
    } finally {
      setLoadingState('changePassword', false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingState('updateProfile', true);
    try {
      const response = await axiosInstance.put('/auth/update-profile', profileForm);
      dispatch(updateUser(response.data.user));
      setShowProfileDialog(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile failed:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoadingState('updateProfile', false);
    }
  };

  const handleUpdateProfilePic = async () => {
    if (!newProfilePic) return;
    setLoadingState('updateProfilePic', true);
    const formData = new FormData();
    formData.append('profilePic', newProfilePic);
    try {
      const response = await axiosInstance.put('/auth/update-profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(updateUser(response.data.user));
      setShowPicDialog(false);
      setNewProfilePic(null);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Update profile picture failed:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setLoadingState('updateProfilePic', false);
    }
  };

  const handleDeleteProfilePic = async () => {
    setLoadingState('deleteProfilePic', true);
    try {
      const response = await axiosInstance.delete('/auth/delete-profile-pic');
      dispatch(updateUser(response.data.user));
      toast.success('Profile picture deleted successfully');
      setShowPicDialog(false);
    } catch (error) {
      console.error('Delete profile picture failed:', error);
      toast.error('Failed to delete profile picture');
    } finally {
      setLoadingState('deleteProfilePic', false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoadingState('deleteAccount', true);
      try {
        await axiosInstance.delete('/auth/delete-account');
        dispatch(logout());
        toast.success('Account deleted successfully');
      } catch (error) {
        console.error('Delete account failed:', error);
        toast.error('Failed to delete account');
      } finally {
        setLoadingState('deleteAccount', false);
      }
    }
  };

  const handleResendEmailVerification = async () => {
    setLoadingState('resendEmailVerification', true);
    try {
      await axiosInstance.post('/auth/resend-email-verification');
      toast.success('Verification email sent successfully');
    } catch (error) {
      console.error('Resend email verification failed:', error);
      toast.error('Failed to resend verification email');
    } finally {
      setLoadingState('resendEmailVerification', false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user.profilePic} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md"
                onClick={() => setShowPicDialog(true)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Phone:</span> {user.phone}</p>
            <p><span className="font-semibold">Email verified:</span> {user.emailVerified ? 'Yes' : 'No'}</p>
            {!user.emailVerified && (
              <Button onClick={handleResendEmailVerification} disabled={loadingStates.resendEmailVerification} className="w-full">
                {loadingStates.resendEmailVerification ? 'Sending...' : 'Verify Email'}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Button onClick={() => setShowProfileDialog(true)} className="w-full">Edit Profile</Button>
            <Button onClick={() => setShowPasswordDialog(true)} className="w-full">Change Password</Button>
          </div>

          <div className="space-y-2">
            <Button onClick={handleLogout} disabled={loadingStates.logout} className="w-full">
              {loadingStates.logout ? 'Logging out...' : 'Logout'}
            </Button>
            <Button variant="outline" onClick={handleLogoutAll} disabled={loadingStates.logoutAll} className="w-full">
              {loadingStates.logoutAll ? 'Logging out...' : 'Logout from all sessions'}
            </Button>
          </div>

          <div>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={loadingStates.deleteAccount} className="w-full">
              {loadingStates.deleteAccount ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowProfileDialog(false)} disabled={loadingStates.updateProfile}>Cancel</Button>
              <Button type="submit" disabled={loadingStates.updateProfile}>{loadingStates.updateProfile ? 'Updating...' : 'Update'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showPicDialog} onOpenChange={setShowPicDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={newProfilePic ? URL.createObjectURL(newProfilePic) : user.profilePic} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewProfilePic(e.target.files[0])}
                className="hidden"
                id="profile-pic-input"
              />
              <Label
                htmlFor="profile-pic-input"
                className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md cursor-pointer hover:bg-primary/90"
              >
                <Camera className="w-5 h-5 mr-2" />
                Choose Image
              </Label>
            </div>
            <div className="flex justify-between space-x-2">
              <Button variant="destructive" onClick={handleDeleteProfilePic} disabled={loadingStates.deleteProfilePic}>
                {loadingStates.deleteProfilePic ? 'Deleting...' : 'Delete Picture'}
              </Button>
              <div>
                <Button type="button" variant="outline" className='mr-4' onClick={() => setShowPicDialog(false)} disabled={loadingStates.updateProfilePic}>Cancel</Button>
                <Button onClick={handleUpdateProfilePic} disabled={loadingStates.updateProfilePic || !newProfilePic}>
                  {loadingStates.updateProfilePic ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
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
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setNewShowPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showNewPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)} disabled={loadingStates.changePassword}>
                Cancel
              </Button>
              <Button type="submit" disabled={loadingStates.changePassword}>
                {loadingStates.changePassword ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
