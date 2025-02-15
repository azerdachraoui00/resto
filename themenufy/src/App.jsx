import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import Login from "./pages/login";
import Reset from "./pages/resetPassword";
import Register from "./pages/register";
import ResetPasswordEmail from "./pages/resetPasswordEmail";
import ProfilePage from "./pages/profilePage";
import EditProfile from "./pages/editProfile";
import Settings from "./pages/settingPage";
import Navbar from "./components/navBar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Reset" element={<Reset />} />
        <Route path="/ResetPasswordEmail" element={<ResetPasswordEmail />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/Settings" element={<Settings />} />
      </Routes>
    </>
  );
};

export default App;
