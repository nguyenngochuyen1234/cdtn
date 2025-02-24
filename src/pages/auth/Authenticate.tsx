import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface AuthProps {
  setIsLoggedIn?: (isLoggedIn: boolean) => void;
}

const Authenticate: React.FC<AuthProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const authAttempted = useRef<boolean>(false);

  const authenticateUser = useCallback( async(authCode: string) => {
    if (authAttempted.current) return;
    authAttempted.current = true;
    setIsAuthenticating(true);

    // API endpoint để xác thực với Google OAuth code
    try {
        // Gửi authCode trong body của request
        const response = await fetch("http://localhost:8080/auth/login-google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: authCode }), // Gửi authCode trong body
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log(data);
        
        if (data.success) {
          localStorage.setItem("access_token", data.data.accessToken);
          if (setIsLoggedIn) {
            setIsLoggedIn(true);
          }
          navigate("/");
        } else {
          throw new Error("Token not found in response");
        }
      } catch (err) {
        console.error("Error during authentication:", err);
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định");
      } finally {
        setIsAuthenticating(false);
      }
  }, [navigate, setIsLoggedIn]);

  useEffect(() => {
    // Lấy auth code từ URL (callback từ Google)
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('code');

    // Kiểm tra nếu đã có access token
    const token = localStorage.getItem('access_token');
    
    if (authCode && !token && !isAuthenticating && !authAttempted.current) {
      authenticateUser(authCode);
    } else if (token) {
      navigate("/");
    }
  }, [authenticateUser, isAuthenticating, navigate]);

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <Typography>Đang xác thực...</Typography>
    </Box>
  );
};

export default Authenticate;