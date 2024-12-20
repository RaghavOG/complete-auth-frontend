import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { logout } from '@/redux/authSlice';
import { Github, Linkedin, LogOut, User, LogIn } from 'lucide-react';

const Home = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white  px-4 sm:px-6 lg:px-8 flex items-center justify-center py-24">
            <motion.div
                className="max-w-4xl w-full mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 
                    className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-300"
                    variants={itemVariants}
                >
                    Welcome to Auth Controller
                </motion.h1>

                <motion.div variants={itemVariants} className="flex justify-center">
                    <Card className="bg-gray-700 shadow-xl w-full max-w-2xl">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-200">
                                {user ? `Hello, ${user.name}!` : "Hello, Guest!"}
                            </h2>
                            <p className="text-gray-300 text-center mb-6">
                                {user
                                    ? "You're logged in! Explore your profile or log out."
                                    : "Join our community to access exclusive features and content."}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {user ? (
                                    <>
                                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                            <Link to="/profile"><User className="mr-2 h-4 w-4" /> View Profile</Link>
                                        </Button>
                                        <Button
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" /> Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Button asChild className="bg-green-600 hover:bg-green-700">
                                        <Link to="/login"><LogIn className="mr-2 h-4 w-4" /> Log In</Link>
                                    </Button>
                                )}
                            </div>
                            {user && (
                                <p className="text-sm text-gray-400 mt-4 text-center">
                                    Logged in as: {user.email}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-12 mt-12">
                    <section>
                        <h2 className="text-3xl font-bold mb-4 text-blue-300 text-center">About the Project</h2>
                        <Card className="bg-gray-700 shadow-xl w-full max-w-3xl mx-auto">
                            <CardContent className="p-6">
                                <p className="text-gray-300 mb-4">
                                    Auth Controller is a comprehensive authentication system built with Node.js, Express, and React. It provides a robust solution for user authentication and management, offering a wide range of features to ensure secure and efficient user interactions.
                                </p>
                                <p className="text-gray-300">
                                    This project is designed to be easily extensible and integrates with various services like Cloudinary for file uploads and a custom email service for sending verification emails and OTPs.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold mb-4 text-blue-300 text-center">Key Features</h2>
                        <Card className="bg-gray-700 shadow-xl w-full max-w-3xl mx-auto">
                            <CardContent className="p-6">
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                                    <li className="flex items-center"><span className="mr-2 text-green-400">✓</span> User Registration and Login</li>
                                    <li className="flex items-center"><span className="mr-2 text-green-400">✓</span> Email Verification</li>
                                    <li className="flex items-center"><span className="mr-2 text-green-400">✓</span> OTP-based Login</li>
                                    <li className="flex items-center"><span className="mr-2 text-green-400">✓</span> Password Management</li>
                                    <li className="flex items-center"><span className="mr-2 text-green-400">✓</span> Token Management</li>
                                    <li className="flex items-center"><span className="mr-2 text-green-400">✓</span> Profile Management</li>
                                    <li className="flex items-center"><span className="mr-2 text-green-400">✓</span> Secure Authentication</li>
                                    <li className="flex items-center"><span className="mr-2 text-green-400">✓</span> Extensible Architecture</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold mb-4 text-blue-300 text-center">Developed By</h2>
                        <Card className="bg-gray-700 shadow-xl w-full max-w-3xl mx-auto">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-4 text-center text-blue-200">Raghav Singla</h3>
                                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                    <div className="flex gap-4">
                                        <a href="https://www.linkedin.com/in/singlaraghav" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                                            <Linkedin size={24} />
                                        </a>
                                        <a href="https://github.com/RaghavOG" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors">
                                            <Github size={24} />
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;
