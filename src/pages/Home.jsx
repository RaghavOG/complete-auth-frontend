import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { logout } from "@/redux/authSlice";
import {
  Github,
  Linkedin,
  LogOut,
  User,
  LogIn,
  Code,
  Server,
  Database,
  Loader2,
  Mail,
} from "lucide-react";
import axios from "axios";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.github.com/users/RaghavOG"
        );
        setAvatarUrl(response.data.avatar_url);
      } catch (error) {
        console.error("Error fetching GitHub avatar:", error);
        setAvatarUrl(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAvatar();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-3/5 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-blue-300 text-center mb-12"
          variants={itemVariants}
        >
          MERN Authentication System
        </motion.h1>

        <div className="grid grid-cols-1 gap-8">
          {/* Left Column */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <Card className="bg-gray-800 shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-blue-300">
                  Key Features
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-400">✓</span> User
                    Registration
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-400">✓</span> Email
                    Verification
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-400">✓</span> 2-Factor
                    Authentication
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-400">✓</span> Login with
                    OTP
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-400">✓</span> Login with
                    Password
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-400">✓</span> Login with
                    OTP and Password Both
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-400">✓</span> Forget /
                    Reset Password
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-400">✓</span> Profile
                    Management
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-400">✓</span> Token
                    Management
                  </li>
                  <li className="flex items-center"> And Many more...</li>
                  You Just need to change the some things according to your need
                  and you are good to go.
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <Card className="bg-gray-800 shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-blue-300">
                  Technologies Used
                </h2>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-center">
                    <Code className="mr-2 h-5 w-5 text-blue-400" />
                    <span>React.js with Redux for frontend</span>
                  </li>
                  <li className="flex items-center">
                    <Server className="mr-2 h-5 w-5 text-green-400" />
                    <span>Node.js and Express.js for backend</span>
                  </li>
                  <li className="flex items-center">
                    <Database className="mr-2 h-5 w-5 text-yellow-400" />
                    <span>MongoDB for database</span>
                  </li>
                  <li className="flex items-center">
                    <Code className="mr-2 h-5 w-5 text-purple-400" />
                    <span>Readymade Shadcn Components</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                  {user ? `Hello, ${user.name}!` : "Hello, Developer!"}
                </h2>
                <div className="flex flex-wrap gap-4 items-center">
                  {user ? (
                    <>
                      <Button
                        asChild
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Link to="/profile">
                          <User className="mr-2 h-4 w-4" /> Profile
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                      <p className="text-sm text-gray-400">
                        Logged in as: {user.email}
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4 justify-center">
                      <Button
                        asChild
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Link to="/login">
                          <LogIn className="mr-2 h-4 w-4" /> Login using Password and OTP
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Link to="/loginoptions">
                          <LogIn className="mr-2 h-4 w-4" /> Login either using OTP or Password
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Link to="/login2fa">
                          <LogIn className="mr-2 h-4 w-4" /> Login with Password and 2FA code
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-blue-300">
                  Made with ❤️ by 
                </h2>
                <div className="flex items-center space-x-4">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                  ) : (
                    <img
                      src={avatarUrl || "https://via.placeholder.com/150"}
                      alt="Raghav Singla"
                      className="w-20 h-20 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-blue-200">
                      Raghav Singla
                    </h3>
                    <p className="text-gray-400">Full Stack Developer</p>
                    <div className="flex space-x-2 mt-2">
                      <a
                        href="https://www.linkedin.com/in/singlaraghav"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Linkedin size={20} />
                      </a>
                      <a
                        href="https://github.com/RaghavOG"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        <Github size={20} />
                      </a>
                      <a
                        href="mailto:04raghavsingla28@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        <Mail size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
