import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import Footer from "../components/footer";
import GoogleAuthButton from "../components/GoogleAuthButton";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(""); // 2FA Code
  const [show2FA, setShow2FA] = useState(false); // Show 2FA input if required
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); 

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, token: token || undefined }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        // Redirect based on role
        if (data.user.role === "admin") {
          navigate("/admin");
        } else if (data.user.role === "superadmin") {
          navigate("/superadmin");
        } else {
          navigate("/");
        }
      } else if (data.message === "2FA code required") {
        setShow2FA(true); // Show 2FA input field
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center sm:justify-start py-6 px-4 sm:px-6 lg:px-20">
      <div className="w-full max-w-md sm:w-[480px] sm:h-[600px] p-10 rounded-2xl bg-white/10 backdrop-blur-xl mr-0 sm:mr-10 flex flex-col justify-between">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white pt-4">Sign in</h1>

            {/* Display Error Message */}
            {error && <p className="text-red-500 text-center w-full">{error}</p>}

            {/* Login Form */}
            <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {/* 🔹 Show 2FA Input if Required */}
                {show2FA && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      2FA Code
                    </label>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400"
                      placeholder="Enter your 2FA code"
                      required
                    />
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-yellow-500"
                    />
                    <label className="ml-2 block text-sm text-white">
                      Remember me
                    </label>
                  </div>
                  <a
                    href="/ResetPasswordEmail"
                    className="text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute w-full border-t border-yellow-500">
                  <div className="relative px-4 my-2 mb-2 text-sm text-white flex justify-center">
                    Or continue with
                  </div>
                </div>
              </div>

              <GoogleAuthButton />

              {/* Submit Button */}
              <Button
                className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 mt-6"
                type="submit"
              >
                Sign in
              </Button>
            </form>
          </div>

          {/* Sign up link */}
          <div className="text-center mt-4">
            <span className="text-white">Don't have an account? </span>
            <a
              href="/register"
              className="text-yellow-500 hover:text-yellow-400 font-medium"
            >
              Create one
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Login;
