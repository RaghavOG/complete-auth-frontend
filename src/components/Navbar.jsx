import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector from Redux

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Access auth state from Redux
  const [scrollProgress, setScrollProgress] = useState(0);


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
              {['Features', 'Explore', 'Community', 'Blog'].map((item, index) => (
                <motion.a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  {item}
                </motion.a>
              ))}

              {isAuthenticated ? (
                <Link to="/profile">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white"
                  >
                    {user?.email}
                  </motion.button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white"
                    >
                      Login
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
              {['Link-1', 'Explore', 'Community', 'Blog'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block text-gray-700 hover:text-indigo-600 transition-colors">
                  {item}
                </a>
              ))}

              {isAuthenticated ? (
                <Link to="/profile">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white">
                    {user?.email}
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-full transition-colors hover:bg-indigo-600 hover:text-white">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-full transition-colors hover:bg-indigo-700">
                      Sign Up
                    </button>
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
