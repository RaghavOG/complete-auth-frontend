/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUser } from '@/redux/authSlice';
import axiosInstance from '@/lib/axiosInstance';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, PencilIcon, Camera, LogOut, UserX } from 'lucide-react'
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
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.is2FAEnabled || false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [twoFACode, setTwoFACode] = useState('');
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [show2FAVerifyDialog, setShow2FAVerifyDialog] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
  logout: false,
  logoutAll: false,
  changePassword: false,
  updateProfile: false,
  updateProfilePic: false,
  deleteProfilePic: false,
  deleteAccount: false,
  resendEmailVerification: false,
  setup2FA: false,
  verify2FA: false,
  enable2FA: false,
  disable2FA: false,
  });

  const setLoadingState = (action, isLoading) => {
    setLoadingStates(prevStates => ({
      ...prevStates,
      [action]: isLoading,
    }));
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      dispatch(updateUser(response.data.user));
      setIs2FAEnabled(response.data.user.is2FAEnabled);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to update profile information');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (!user) return <div className="text-center p-4 text-white">Loading...</div>;

  const handleSetup2FA = async () => {
    setLoadingState('setup2FA', true);
    try {
      const response = await axiosInstance.post('/auth/2fa/setup');
      setQrCodeUrl(response.data.qrCodeUrl);
      setShow2FADialog(true);
    } catch (error) {
      console.error('2FA setup failed:', error);
      toast.error(error.response?.data?.message || '2FA setup failed, please try again.');
    } finally {
      setLoadingState('setup2FA', false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoadingState('verify2FA', true);
    try {
      await axiosInstance.post('/auth/2fa/verify', { code: twoFACode });
      setShow2FAVerifyDialog(false);
      setShow2FADialog(false);
      setIs2FAEnabled(true);
      toast.success('2FA successfully verified and enabled');
    } catch (error) {
      console.error('2FA verification failed:', error);
      toast.error(error.response?.data?.message || '2FA verification failed, please try again.');
    } finally {
      setLoadingState('verify2FA', false);
    }
  };



  
  const handleDisable2FA = async () => {
    setLoadingState('disable2FA', true);
    try {
      await axiosInstance.post('/auth/2fa/disable');
      setIs2FAEnabled(false);
      toast.success('2FA disabled successfully');
    } catch (error) {
      console.error('2FA disable failed:', error);
      toast.error(error.response?.data?.message || '2FA disable failed, please try again.');
    } finally {
      setLoadingState('disable2FA', false);
    }
  };

  const handleLogout = async () => {
    setLoadingState('logout', true);
    try {
      await axiosInstance.post('/auth/logout');
      dispatch(logout());
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error(error.response?.data?.message || 'Logout failed, please try again.');
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
      toast.error(error.response?.data?.message || 'Logout from all sessions failed, please try again.');
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
    // check if new password is same as current password
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.error('New password must be different from current password');
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
      toast.error(error.response?.data?.message || 'Failed to change password');
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
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
      toast.error(error.response?.data?.message || 'Failed to update profile picture');
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
      toast.error(error.response?.data?.message || 'Failed to delete profile picture');
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
        toast.error(error.response?.data?.message || 'Failed to delete account');
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
      toast.error(error.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setLoadingState('resendEmailVerification', false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-blue-900  px-4 sm:px-6 lg:px-8 py-24 '>
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-gray-700 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-white">Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-32 h-32 border-2 border-blue-500">
              <AvatarImage src={user.profilePic} alt={user.name} />
              <AvatarFallback className="bg-blue-600 text-white text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 shadow-md hover:bg-blue-600"
              onClick={() => setShowPicDialog(true)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
            <p className="text-gray-400">@{user.username}</p>
          </div>
        </div>

        <div className="space-y-2 text-gray-300">
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Phone:</span> {user.phone}</p>
          <p><span className="font-semibold">Email verified:</span> {user.emailVerified ? 'Yes' : 'No'}</p>
          {!user.emailVerified && (
            <Button onClick={handleResendEmailVerification} disabled={loadingStates.resendEmailVerification} className="w-full bg-blue-600 hover:bg-blue-700">
              {loadingStates.resendEmailVerification ? 'Sending...' : 'Verify Email'}
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Button onClick={() => setShowProfileDialog(true)} className="w-full bg-blue-600 hover:bg-blue-700">Edit Profile</Button>
          <Button onClick={() => setShowPasswordDialog(true)} className="w-full bg-blue-600 hover:bg-blue-700">Change Password</Button>
          {is2FAEnabled ? (
            <Button onClick={handleDisable2FA} disabled={loadingStates.disable2FA} className="w-full bg-red-600 hover:bg-red-700">
              {loadingStates.disable2FA ? 'Disabling...' : 'Disable 2FA'}
            </Button>
          ) : (
            <Button onClick={handleSetup2FA} disabled={loadingStates.setup2FA} className="w-full bg-blue-600 hover:bg-blue-700">
              {loadingStates.setup2FA ? 'Setting up...' : 'Setup 2FA'}
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Button onClick={handleLogout} disabled={loadingStates.logout} className="w-full bg-red-600 hover:bg-red-700">
            {loadingStates.logout ? 'Logging out...' : 'Logout'}
            <LogOut className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleLogoutAll} disabled={loadingStates.logoutAll} className="w-full text-black border-gray-600 hover:bg-gray-500">
            {loadingStates.logoutAll ? 'Logging out...' : 'Logout from all sessions'}
          </Button>
        </div>

        <div>
          <Button variant="destructive" onClick={handleDeleteAccount} disabled={loadingStates.deleteAccount} className="w-full bg-red-700 hover:bg-red-800">
            {loadingStates.deleteAccount ? 'Deleting...' : 'Delete Account'}
            <UserX className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>

    <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Name</Label>
            <Input
              id="name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">Username</Label>
            <Input
              id="username"
              value={profileForm.username}
              onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">Phone</Label>
            <Input
              id="phone"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShowProfileDialog(false)} disabled={loadingStates.updateProfile} className='mr-4 text-black border-gray-600 hover:bg-gray-300'>Cancel</Button>
            <Button type="submit" disabled={loadingStates.updateProfile} className="bg-blue-600 hover:bg-blue-700">{loadingStates.updateProfile ? 'Updating...' : 'Update'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog open={showPicDialog} onOpenChange={setShowPicDialog}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-32 h-32 border-2 border-blue-500">
              <AvatarImage src={newProfilePic ? URL.createObjectURL(newProfilePic) : user.profilePic} alt={user.name} />
              <AvatarFallback className="bg-blue-600 text-white text-2xl">{user.name.charAt(0)}</AvatarFallback>
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
              className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700"
            >
              <Camera className="w-5 h-5 mr-2" />
              Choose Image
            </Label>
          </div>
          <div className="flex justify-between space-x-2">
            <Button variant="destructive" onClick={handleDeleteProfilePic} disabled={loadingStates.deleteProfilePic} className="bg-red-600 hover:bg-red-700">
              {loadingStates.deleteProfilePic ? 'Deleting...' : 'Delete Picture'}
            </Button>
            <div>
              <Button type="button" variant="outline" className='mr-4 text-black border-gray-600 hover:bg-gray-300' onClick={() => setShowPicDialog(false)} disabled={loadingStates.updateProfilePic} >Cancel</Button>
              <Button onClick={handleUpdateProfilePic} disabled={loadingStates.updateProfilePic || !newProfilePic} className="bg-blue-600 hover:bg-blue-700">
                {loadingStates.updateProfilePic ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setNewShowPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showNewPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)} disabled={loadingStates.changePassword} className='mr-4 text-black border-gray-600 hover:bg-gray-300'>
              Cancel
            </Button>
            <Button type="submit" disabled={loadingStates.changePassword} className="bg-blue-600 hover:bg-blue-700">
              {loadingStates.changePassword ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Setup 2FA</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            {qrCodeUrl && <img src={qrCodeUrl} alt="2FA QR Code" />}
          </div>
          <div className="space-y-2">
            <Label htmlFor="twoFACode" className="text-gray-300">Enter 2FA Code</Label>
            <Input
              id="twoFACode"
              type="text"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShow2FADialog(false)} disabled={loadingStates.verify2FA} className='mr-4 text-black border-gray-600 hover:bg-gray-300'>
              Cancel
            </Button>
            <Button onClick={handleVerify2FA} disabled={loadingStates.verify2FA} className="bg-blue-600 hover:bg-blue-700">
              {loadingStates.verify2FA ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
  );
};

export default Profile;
