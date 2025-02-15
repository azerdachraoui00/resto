import React from "react";

const Footer = () => {
  return (
    <footer className="bg-transparent text-white text-center p-4 relative bottom-0 w-full">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} TheMenuFy. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
