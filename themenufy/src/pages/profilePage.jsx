import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Edit3 } from "lucide-react"; // Icônes
import BlurContainer from "../components/blurContainer"; // Réutilisation du composant
import Button from "../components/button"; // Bouton stylisé
import Footer from "../components/footer"; // Footer

const Profile = () => {
  const [user, setUser] = useState(null); // Start with null for loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get JWT Token
        if (!token) throw new Error("No authentication token found!");

        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        setUser(data); // Set profile data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Profile.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <BlurContainer className="w-[450px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl text-white">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={50} className="text-gray-700" />
            </div>

            <h1 className="text-3xl font-bold">
              {user.firstName} {user.lastName}
            </h1>

            {/* Profile Info */}
            <div className="space-y-6 w-full">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Mail className="text-yellow-500" size={20} />
                <p>{user.email}</p>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Lock className="text-yellow-500" size={20} />
                <p>{user.password}</p>
              </div>
            </div>

            {/* Edit Button */}
            <Link to="/EditProfile">
              <Button className="bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center space-x-2">
                <Edit3 size={18} />
                <span>Edit Profile</span>
              </Button>
            </Link>
          </div>
        </BlurContainer>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
