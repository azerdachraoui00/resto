import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Edit3, Camera } from "lucide-react"; // Icônes
import Button from "../components/button"; // Bouton stylisé
import Footer from "../components/footer"; // Footer

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editable, setEditable] = useState(false); // Toggle for edit mode
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
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
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setEditable(!editable);
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Vérifier si l'image est de type valide (jpeg, png, webp)
    if (!file.type.match("image/jpeg") && !file.type.match("image/png") && !file.type.match("image/webp")) {
      setError("Seuls les formats JPEG, PNG et WebP sont autorisés.");
      return;
    }
  
    // Convertir l’image en Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
  
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ profilePic: base64Image }), // Envoie en JSON
        });
  
        if (response.ok) {
          const data = await response.json();
          setFormData((prev) => ({ ...prev, profilePic: data.profilePic }));
        } else {
          setError("Erreur lors de l'upload de l'image.");
        }
      } catch (err) {
        setError("Problème serveur, réessayez plus tard.");
      }
    };
  };
  
  

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
        <div className="w-full max-w-2xl px-6 py-8 rounded-2xl bg-white/20 backdrop-blur-lg text-white">
          <div className="flex flex-col items-center space-y-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                <User size={50} className="text-gray-700" />
              </div>
              <button
                className="absolute bottom-0 right-0 p-2 bg-yellow-500 rounded-full text-white hover:bg-yellow-600 transition-all"
                onClick={handleEditToggle}
              >
                <Camera size={20} />
                <img 
  src={user.profilePic || "/default-profile.jpg"} 
  alt="Profile" 
  className="w-32 h-32 rounded-full object-cover" 
/>

              </button>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold">
              {user.firstName} {user.lastName}
            </h1>

            {/* Profile Info */}
            <div className="space-y-6 w-full">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Mail className="text-yellow-500" size={20} />
                {editable ? (
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="bg-transparent text-white border-none focus:ring-2 focus:ring-yellow-500"
                  />
                ) : (
                  <p>{user.email}</p>
                )}
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Lock className="text-yellow-500" size={20} />
                {editable ? (
                  <input
                    type="password"
                    defaultValue={user.password}
                    className="bg-transparent text-white border-none focus:ring-2 focus:ring-yellow-500"
                  />
                ) : (
                  <p>********</p> // Mask password by default
                )}
              </div>

              {/* Add more fields like age, etc. */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <span className="text-yellow-500">Age:</span>
                <p>{user.age}</p>
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
