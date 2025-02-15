import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import BlurContainer from "../components/blurContainer";
import Button from "../components/button";
import Footer from "../components/footer";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            password: "",
          });
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (err) {
        setError("Server error, please try again later.");
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password || undefined, // Don't send if empty
        }),
      });

      if (response.ok) {
        navigate("/profilePage");
      } else {
        setError("Update failed. Try again.");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Profile.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <BlurContainer className="w-[450px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl text-white">
          <h1 className="text-3xl font-bold text-center mb-6">Edit Profile</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <User className="text-yellow-500" size={20} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="First Name"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <User className="text-yellow-500" size={20} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="Last Name"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Mail className="text-yellow-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Lock className="text-yellow-500" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="New Password (optional)"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              Save Changes
            </Button>
          </form>
        </BlurContainer>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;
