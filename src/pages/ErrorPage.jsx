import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from 'lucide-react';

const ErrorPage = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white p-4">
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4" 
          variants={itemVariants}
        >
          404 - Page Not Found
        </motion.h1>
        <motion.p 
          className="text-xl mb-8 text-gray-300" 
          variants={itemVariants}
        >
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Home Page
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;

