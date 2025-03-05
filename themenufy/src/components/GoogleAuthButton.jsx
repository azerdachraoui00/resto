import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const GoogleAuthButton = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/profilePage");
      }
    } catch (error) {
      console.error("Google authentication error:", error);
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
<div className="w-full flex justify-center my-4">
  <div className="w-full">
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      theme="outline"
      size="large"
      text="continue_with"
      shape="pill"
      className="w-full" // Ensures it stretches to full width
    />
  </div>
</div>

  );
};

export default GoogleAuthButton;
