import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import de useLocation
import { Search, User, Menu, X } from "lucide-react"; // Ajout de l'icône Hamburger

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation(); // Récupère l'URL actuelle

  // Conditionner l'affichage du navbar : si la page actuelle est 'Login', 'Register', ou 'Reset'
  if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/reset") {
    return null; // Ne pas afficher la navbar
  }

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("role");  // Remove role
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="fixed top-0 left-0 w-full px-6 md:px-12 py-4 flex items-center justify-between 
                    bg-amber-800/10 backdrop-blur-sm shadow-lg z-50 transition-all">
      {/* Logo Section */}
      <h1 className="text-2xl font-bold text-white">TheMenuFy</h1>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden text-white"
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
        <Link to="/" className="text-white hover:text-yellow-500 transition">
          Home
        </Link>
        <Link to="/aboutus" className="text-white hover:text-yellow-500 transition">
          About Us
        </Link>
        <Link to="/ourmenu" className="text-white hover:text-yellow-500 transition">
          Our Menu
        </Link>
        <Link to="/services" className="text-white hover:text-yellow-500 transition">
          Services
        </Link>
        <Link to="/contact" className="text-white hover:text-yellow-500 transition">
          Contact
        </Link>
      </div>

      {/* Right Section: Search Bar & Profile */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            className="bg-white/20 text-white px-4 py-1 rounded-full w-48 focus:outline-none 
                      focus:ring-2 focus:ring-yellow-500 transition-all placeholder-white/70"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-2 text-gray-300" size={20} />
        </div>

        {/* Profile Icon */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="relative w-9 h-9 flex items-center justify-center bg-white/20 rounded-full 
                      hover:ring-2 hover:ring-yellow-500 transition"
          >
            <User className="text-white" size={20} />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white/20 backdrop-blur-md shadow-lg rounded-lg py-2">
              <Link to="/EditProfile" className="block px-4 py-2 text-white hover:text-yellow-500">
                Profile
              </Link>
              <Link to="/settings" className="block px-4 py-2 text-white hover:text-yellow-500">
                Settings
              </Link>
              <Link to="/login" onClick={handleLogout} className="block px-4 py-2 text-white hover:text-yellow-500">
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/90 text-white flex flex-col items-center space-y-6 py-6">
          <Link to="/" className="text-lg hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/aboutus" className="text-lg hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>
            About Us
          </Link>
          <Link to="/ourmenu" className="text-lg hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>
            Our Menu
          </Link>
          <Link to="/services" className="text-lg hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>
            Services
          </Link>
          <Link to="/contact" className="text-lg hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
