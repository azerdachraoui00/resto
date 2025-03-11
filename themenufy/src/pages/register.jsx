import React, { useState } from "react";
import axios from "axios";
import Button from "../components/button";
import Footer from "../components/footer";
import GoogleAuthButton from "../components/GoogleAuthButton";
import BlurContainer from "../components/blurContainer";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Split fullName into firstName and lastName
    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "Unknown"; // If no last name, default to "Unknown"

    if (!firstName || lastName === "Unknown") {
      setError("Please enter both first and last name.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.termsAccepted) {
      setError("You must accept the terms and conditions.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Account created successfully!");
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
    {/* Background */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
      style={{
        backgroundImage: "url('/login1.jpg')",
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
      }}
    />
  
    {/* Main Content */}
    <main className="relative flex-grow flex justify-start">
      {/* Formulaire avec largeur augmentée */}
      <div
        className="min-h-screen bg-white/ backdrop-blur-lg px-10 py-10 relative"
        style={{
          width: '50%', // Largeur augmentée du formulaire
          clipPath: "polygon(0% 0%, 80% 0%, 100% 100%, 0% 100%)",
          zIndex: 20, // Assurez-vous que le formulaire est devant les éléments de texte
        }}
      >
  <h1 className="text-3xl font-bold text-white mb-10 text-center mx-auto" style={{ marginLeft: '-60px' }}>
  Create an account
</h1>




        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
  
        {/* Formulaire */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="flex flex-col items-start max-w-md ml-10">
            <label className="text-white text-sm font-medium mb-1 text-left">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              className="w-full p-3 rounded border border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-white/60"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
  
          {/* Email */}
          <div className="flex flex-col items-start max-w-md ml-10">
            <label className="text-white text-sm font-medium mb-1 text-left">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-3 rounded border border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-white/60"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
  
          {/* Password */}
          <div className="flex flex-col items-start max-w-md ml-10">
            <label className="text-white text-sm font-medium mb-1 text-left">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full p-3 rounded border border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-white/60"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
  
          {/* Confirm Password */}
          <div className="flex flex-col items-start max-w-md ml-10">
            <label className="text-white text-sm font-medium mb-1 text-left">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full p-3 rounded border border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-white/60"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
  
          {/* Checkbox Terms */}
          <div className="flex items-center max-w-md ml-10">
            <input
              id="terms"
              type="checkbox"
              name="termsAccepted"
              className="h-4 w-4 text-yellow-500 focus:ring-yellow-500"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-white">
              I agree to the{" "}
              <a href="#" className="text-yellow-500 hover:text-yellow-400">
                Terms and Conditions
              </a>
            </label>
          </div>
  
          {/* Bouton légèrement décalé vers la gauche */}
          <div className="flex justify-start ml-10">
            <Button className="w-full max-w-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded transition">
              Create Account
            </Button>
          </div>
  
          {/* Lien vers connexion */}
          <div className="flex items-start mt-4 ml-10">
            <span className="text-white">Already have an account? </span>
            <a href="/login" className="text-yellow-500 hover:text-yellow-400 font-medium ml-2">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </main>
  
   {/* Partie avec le texte stylisé et titre */}
   <div className="absolute inset-0 flex justify-end items-center bg-transparent z-10">
  {/* Conteneur pour le texte avec une largeur de 50% */}
  <div className="flex flex-col justify-center items-center text-center w-1/2 pr-30">
    {/* Titre "The Menufy" avec un espacement large et un effet fluide */}
    <h1 className="text-6xl font-extrabold text-white transform motion-safe:animate-slide-in-right mb-2 leading-tight" style={{ fontFamily: "'Indie Flower', cursive" }}>
      The Menufy
    </h1>


    {/* Description avec marges et style moderne */}
    <p className="text-lg text-white transform motion-safe:animate-slide-in-right" style={{ fontFamily: "'Marker Felt', cursive" }}>
      Sign up now to explore our healthy, personalized meal kits tailored to your needs!
    </p>
  </div>
</div>


  
    {/* Pied de page */}
    <Footer />
  </div>
  
  
  );
}

export default Register;
