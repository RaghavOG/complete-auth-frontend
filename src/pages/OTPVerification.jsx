/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"; // Importing the loading spinner
import axiosInstance from "@/lib/axiosInstance"; // Import the global axios instance
import { login } from '@/redux/authSlice'; 
import { useDispatch } from 'react-redux';
export default function OTPVerification({ email,onVerificationComplete }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loadingVerify, setLoadingVerify] = useState(false); // Loading state for Verify button
  const [loadingResend, setLoadingResend] = useState(false); // Loading state for Resend OTP button
  const dispatch = useDispatch(); 

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input if value is entered
    if (element.value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    const { key } = event;

    if (key === "Backspace" || key === "Delete") {
      event.preventDefault(); // Prevent default backspace/delete behavior
      const newOtp = [...otp];

      // Clear current input
      newOtp[index] = "";
      setOtp(newOtp);

      // Focus previous input if backspace is pressed
      if (key === "Backspace" && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    } else if (key === "ArrowLeft" && index > 0) {
      // Move focus to the previous input on left arrow
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (key === "ArrowRight" && index < 5) {
      // Move focus to the next input on right arrow
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    setLoadingVerify(true); // Set loading state to true when starting the request

    try {
      const response = await axiosInstance.post(
        "/auth/login-otp",  // Use global axios instance
        { email, otp: otpString }
      );

      if (response.status === 200) {
        toast.success("Email verified successfully!");
        dispatch(login(response.data.data.user));

        onVerificationComplete();
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoadingVerify(false); // Set loading state back to false after request completes
    }
  };

  const handleResendOTP = async () => {
    setLoadingResend(true); // Set loading state to true when starting the request

    try {
      const response = await axiosInstance.post(
        "/auth/resend-otp", // Use global axios instance
        { email }
      );

      if (response.status === 200) {
        toast.success("OTP resent successfully!");
        setTimeLeft(300); // Reset timer for 5 minutes
        setIsResendDisabled(true); // Disable resend button again
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoadingResend(false); // Set loading state back to false after request completes
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full md:p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Enter Verification Code
        </h2>
        <p className="text-gray-600 text-center mb-6">
          We&apos;ve sent a code to {email}
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-2xl"
            />
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600">
            Time remaining: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full mb-4"
          disabled={loadingVerify || loadingResend} // Disable button while loading
        >
          {loadingVerify ? <Loader2 className="animate-spin mr-2" /> : "Verify"}
        </Button>

        <Button
          onClick={handleResendOTP}
          disabled={isResendDisabled || loadingVerify || loadingResend} // Disable button while loading or if resend is disabled
          variant="outline"
          className="w-full"
        >
          {loadingResend ? <Loader2 className="animate-spin mr-2" /> : "Resend OTP"}
        </Button>
      </motion.div>
    </div>
  );
}
