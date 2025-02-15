import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import Button from "../components/button";
import Footer from "../components/footer";
import BlurContainer from "../components/blurContainer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Handle errors
  const navigate = useNavigate(); // Use navigate to redirect after login

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store JWT token in localStorage
        localStorage.setItem("token", data.token);
        navigate("/"); // Redirect to dashboard or home page
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
            {error && (
              <p className="text-red-500 text-center w-full">{error}</p>
            )}

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
                    href="#"
                    className="text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

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
