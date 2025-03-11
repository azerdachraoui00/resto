import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"; // Import des icônes

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content of the page */}
      <main className="flex-grow">
        {/* Le contenu de ta page ici */}
        {/* Exemple de contenu */}
      </main>

      {/* Footer Content */}
      <footer className="w-full text-white backdrop-blur-lg bg-black/30 text-center py-6">
        <div className="space-y-4">
          <p className="text-sm">© {currentYear} TheMenuFy. All rights reserved.</p>
          
          {/* Additional Links */}
          <div className="space-x-6">
            <Link to="/aboutus" className="text-white hover:text-yellow-500 transition">
              About Us
            </Link>
            <Link to="/services" className="text-white hover:text-yellow-500 transition">
              Services
            </Link>
            <Link to="/contact" className="text-white hover:text-yellow-500 transition">
              Contact
            </Link>
            <Link to="/privacy-policy" className="text-white hover:text-yellow-500 transition">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-white hover:text-yellow-500 transition">
              Terms of Service
            </Link>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6">
            <Link to="#" className="text-white hover:text-yellow-500 transition">
              <FaFacebook size={24} />
            </Link>
            <Link to="#" className="text-white hover:text-yellow-500 transition">
              <FaInstagram size={24} />
            </Link>
            <Link to="#" className="text-white hover:text-yellow-500 transition">
              <FaTwitter size={24} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
