/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"; // Loading spinner
import axiosInstance from "@/lib/axiosInstance"; // Global axios instance
import { login } from "@/redux/authSlice"; 
import { useDispatch } from "react-redux";

export default function OTPVerification({ email, onVerificationComplete }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(10); // 5 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loadingVerify, setLoadingVerify] = useState(false); // Loading state for Verify button
  const [loadingResend, setLoadingResend] = useState(false); // Loading state for Resend OTP button
  const dispatch = useDispatch();
  const inputsRef = useRef([]);

  // Auto-focus the first input on component mount
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  // Timer for resend OTP
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

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input if value is entered
    if (value && index < 5) {
      const nextInput = inputsRef.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };
  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text");
    const pastedOTP = pastedData.slice(0, 6).split("");

    if (pastedOTP.length === 6 && pastedOTP.every(char => !isNaN(char))) {
      setOtp(pastedOTP);
      inputsRef.current[5].focus(); // Focus the last input after pasting
    }
  };
  const handleKeyDown = (event, index) => {
    const { key } = event;

    if (key === "Backspace") {
      event.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        // Clear current input
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Focus previous input if current is empty
        const prevInput = inputsRef.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
      }
    } else if (key === "ArrowLeft" && index > 0) {
      // Move focus to the previous input on left arrow
      const prevInput = inputsRef.current[index - 1];
      if (prevInput) prevInput.focus();
    } else if (key === "ArrowRight" && index < 5) {
      // Move focus to the next input on right arrow
      const nextInput = inputsRef.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    setLoadingVerify(true);

    try {
      const response = await axiosInstance.post("/auth/login-otp", {
        email,
        otp: otpString,
      });

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
      setLoadingVerify(false);
    }
  };

  const handleResendOTP = async () => {
    setLoadingResend(true);

    try {
      const response = await axiosInstance.post("/auth/resend-otp", { email });

      if (response.status === 200) {
        toast.success("OTP resent successfully!");
        setTimeLeft(10); // Reset timer for 5 minutes
        setIsResendDisabled(true);
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-blue-900 bg-opacity-50 flex items-center justify-center p-4">
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
              onChange={(e) => handleChange(e.target.value, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-2xl"
              ref={(el) => (inputsRef.current[index] = el)} // Store ref for each input
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
          disabled={loadingVerify || loadingResend}
        >
          {loadingVerify ? <Loader2 className="animate-spin mr-2" /> : "Verify"}
        </Button>

        <Button
          onClick={handleResendOTP}
          disabled={isResendDisabled || loadingVerify || loadingResend}
          variant="outline"
          className="w-full"
        >
          {loadingResend ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            "Resend OTP"
          )}
        </Button>
      </motion.div>
    </div>
  );
}
