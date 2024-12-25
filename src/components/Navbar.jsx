import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector from Redux
import { useDispatch } from 'react-redux'; // Import useDispatch from Redux
import { logout } from '@/redux/authSlice';
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch(); // Create a dispatch function
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Access auth state from Redux
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
      dispatch(logout());

      toast.success("Logged out successfully");
      navigate("/login");
    };

  useEffect(() => {
    const updateProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const progressBarLeft = {
    width: `${scrollProgress / 2}%`,
    right: '50%',
  };

  const progressBarRight = {
    width: `${scrollProgress / 2}%`,
    left: '50%',
  };

  return (
    <>
      <div className="fixed top-0 z-50 w-full h-1">
        <div className="absolute h-full bg-indigo-600 transition-all duration-300" style={progressBarLeft} />
        <div className="absolute h-full bg-indigo-600 transition-all duration-300" style={progressBarRight} />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-indigo-600"
              >
                LOGO
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white"
                  >
                    {user?.email}
                  </motion.button>
                </Link>

                 <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>

                </div>
              ) : (
                <>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white"
                    >
                      Login with OTP and Password
                    </motion.button>
                  </Link>

                  <Link to="/loginoptions">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white"
                    >
                      Login with Email and Password / OTP
                    </motion.button>
                  </Link>
                  <Link to="/login2fa">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white"
                    >
                      Login with 2FA Auth
                    </motion.button>
                  </Link>
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-white bg-indigo-600 rounded-full transition-colors hover:bg-indigo-700"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 pt-2 pb-4 space-y-4">
              {isAuthenticated ? (
               <div className='space-y-4'>
                 <Link to="/profile">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white"
                  >
                    {/* {user?.email} */}
                    Profile
                  </motion.button>
                </Link>
                <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
               </div>
              ) : (
                <>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className=" my-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white"
                    >
                      Login with OTP and Password
                    </motion.button>
                  </Link>

                  <Link to="/loginoptions">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="my-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white"
                    >
                      Login with Email and Password / OTP
                    </motion.button>
                  </Link>

                  <Link to="/login2fa">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="my-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white"
                    >
                      Login with 2FA Auth
                    </motion.button>
                  </Link>
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="my-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-full transition-colors hover:bg-indigo-700"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
