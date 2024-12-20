import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { logout } from '@/redux/authSlice'; // Assuming you have a logout action

const Home = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: 'spring',
                stiffness: 120,
                damping: 10,
                staggerChildren: 0.2
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white p-4">
            <motion.div
                className="text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 className="text-4xl md:text-5xl font-bold mb-4" variants={itemVariants}>
                    Welcome to Our Platform
                </motion.h1>
                <motion.p className="text-xl md:text-2xl mb-8" variants={itemVariants}>
                    {user ? `Hello, ${user.name}!` : "Hello, Guest!"}
                </motion.p>

                <Card className="p-6  text-center bg-gray-800 rounded-lg shadow-lg mb-6">
                    <p className="text-gray-300 mb-4">
                        {user 
                            ? "You're logged in! Explore your profile or log out."
                            : "Join our community to access exclusive features and content."}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {user ? (
                            <>
                                <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
                                    <Link to="/profile">View Profile</Link>
                                </Button>
                                <Button 
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
                                <Link to="/login">Log In</Link>
                            </Button>
                        )}
                    </div>
                </Card>

                {user && (
                    <motion.p className="text-sm text-gray-400" variants={itemVariants}>
                        Logged in as: {user.email}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default Home;

