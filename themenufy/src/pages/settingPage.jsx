import React, { useState } from "react";
import { Sun, Moon, Bell, Globe } from "lucide-react"; // Icônes
import BlurContainer from "../components/blurContainer"; // Conteneur avec effet blur
import Button from "../components/button"; // Bouton stylisé
import Footer from "../components/footer"; // Footer
import { useNavigate } from "react-router-dom";


const Settings = () => {
    const navigate = useNavigate(); 
  
  // États pour les préférences
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");

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
          <h1 className="text-3xl font-bold text-center mb-6">Settings</h1>

          <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <Moon className="text-yellow-500" size={22} />
                ) : (
                  <Sun className="text-yellow-500" size={22} />
                )}
                <span className="text-white">Dark Mode</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  darkMode ? "bg-yellow-500" : "bg-gray-500"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform ${
                    darkMode ? "translate-x-6" : "translate-x-0"
                  } transition`}
                />
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="text-yellow-500" size={22} />
                <span className="text-white">Notifications</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  notifications ? "bg-yellow-500" : "bg-gray-500"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform ${
                    notifications ? "translate-x-6" : "translate-x-0"
                  } transition`}
                />
              </button>
            </div>

            <div 
  className="flex items-center justify-between bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
  onClick={(e) => {
    if (!e.target.closest('button')) {
      navigate("/Settings/list");
    }
  }}
>
  <div className="flex items-center space-x-3">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="lucide lucide-list-collapse-icon lucide-list-collapse"
    >
      <path d="m3 10 2.5-2.5L3 5"/>
      <path d="m3 19 2.5-2.5L3 14"/>
      <path d="M10 6h11"/>
      <path d="M10 12h11"/>
      <path d="M10 18h11"/>
    </svg>
    <span className="text-white">Mes reviews</span>
  </div>
  <button
    onClick={(e) => {
      e.stopPropagation(); 
      navigate("/Settings/list");
    }}
    className="w-12 h-6 flex items-center justify-center rounded-full p-1 bg-white/10 hover:bg-white/20"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  </button>
</div>
         



<div 
  className="flex items-center justify-between bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
  onClick={(e) => {
    if (!e.target.closest('button')) {
      navigate("/Settings/CommentedReviews");
    }
  }}
>
  <div className="flex items-center space-x-3">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="lucide lucide-list-collapse-icon lucide-list-collapse"
    >
      <path d="m3 10 2.5-2.5L3 5"/>
      <path d="m3 19 2.5-2.5L3 14"/>
      <path d="M10 6h11"/>
      <path d="M10 12h11"/>
      <path d="M10 18h11"/>
    </svg>
    <span className="text-white"> Commented Reviews</span>
  </div>
  <button
    onClick={(e) => {
      e.stopPropagation(); 


      navigate("/Settings/CommentedReviews");
    }}
    className="w-12 h-6 flex items-center justify-center rounded-full p-1 bg-white/10 hover:bg-white/20"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  </button>
</div>


            {/* Language Selection */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="text-yellow-500" size={22} />
                <span className="text-white">Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
              >
                <option className="text-black" value="English">
                  English
                </option>
                <option className="text-black" value="Français">
                  Français
                </option>
                <option className="text-black" value="Español">
                  Español
                </option>
              </select>
            </div>

            {/* Save Button */}
            <Button className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300">
              Save Settings
            </Button>
          </div>
        </BlurContainer>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
