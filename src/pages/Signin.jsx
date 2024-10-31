import React, { useState, useEffect } from "react";
import { Input, Button } from "@material-tailwind/react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { serverUrl } from "../api";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false); // Loading state for login

  const navigate = useNavigate();

  useEffect(() => {
    let countdown;

    if (otpSent && !canResendOtp) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setCanResendOtp(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [otpSent, canResendOtp]);

  const handleGetOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${serverUrl}/api/auth/login`, {
        email,
      });

      setMessage(response.data.message);
      setOtpSent(true);
      setCanResendOtp(false);
      setTimer(60);
    } catch (error) {
      console.error("Error fetching OTP:", error);
      setMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator

    try {
      const response = await axios.post(`${serverUrl}/api/auth/verify-otp`, {
        email,
        otp,
      });
      console.log("Role:", response.data.role);
      setMessage(response.data.message);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("token", response.data.token);

      setTimeout(() => {
        navigate("/quote")
      }, 2000);
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Failed to login. Please try again.");
    } finally {
      setLoading(false); // Hide loading indicator once login is complete
    }
  };

  return (
    <div className="min-h-screen border flex flex-col w-full justify-center items-center bg-gray-100 relative">
      <div className="absolute top-5 left-10 z-20">
        <img
          src="https://breakbag.com/static/media/logo.3fff3126fefbf4f3afe7.png"
          alt="Logo"
          className="h-16"
        />
      </div>

      <div className="absolute top-0 left-0 w-full" style={{ height: "50vh" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://admin-bucket.blr1.cdn.digitaloceanspaces.com/admin-bg.jpg")',
            height: "100%",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0) 70%, white 100%)",
            height: "100%",
          }}
        />
      </div>

      <div className="relative w-full mt-32 z-10">
        <div className="max-w-sm mx-auto bg-white shadow-lg p-8 rounded-lg">
          <div className="bg-main p-5 -mt-20 mb-6 text-center rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-white">Sign In</h2>
            <p className="text-white">
              Enter your email to Sign In to your Account
            </p>
          </div>
          <form onSubmit={handleGetOtp}>
            <div className="mb-4">
              <Input
                variant="standard"
                label="Email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {!otpSent && (
              <Button
                type="submit"
                className="w-full mb-4 bg-main text-white hover:bg-opacity-80"
              >
                Get OTP
              </Button>
            )}
            {message && <p className="text-center text-green-500">{message}</p>}
            {otpSent && (
              <>
                {canResendOtp ? (
                  <p
                    onClick={handleGetOtp}
                    className="cursor-pointer text-center text-green-500"
                  >
                    Resend OTP
                  </p>
                ) : (
                  <p className="text-center text-gray-500">
                    Resend OTP in {timer} seconds
                  </p>
                )}
              </>
            )}
            {otpSent && (
              <>
                <div className="mb-4">
                  <Input
                    variant="standard"
                    label="OTP"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                {loading ? (
                  <p className="text-center text-blue-500">Logging in...</p> // Loading indicator
                ) : (
                  <Button
                    type="submit"
                    onClick={handleLogin}
                    className="w-full mb-4 bg-main text-white hover:bg-opacity-80"
                  >
                    Login
                  </Button>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
