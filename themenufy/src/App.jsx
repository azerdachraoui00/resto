import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/homePage";
import Login from "./pages/login";
import Reset from "./pages/resetPassword";
import Register from "./pages/register";
import ResetPasswordEmail from "./pages/resetPasswordEmail";
import ProfilePage from "./pages/profilePage";
import EditProfile from "./pages/editProfile";
import Settings from "./pages/settingPage";
import Navbar from "./components/navBar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "./components/footer";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyCode from "./pages/VerifyCode";
import Test from "./pages/test";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import ReviewsPage from "./pages/ReviewsPage";
const App = () => {
  const location = useLocation(); // Get the current route

  // Define paths where Navbar should be hidden
  const hiddenNavbarRoutes = ["/Login", "/Register"];

  return (
    <>
      <GoogleOAuthProvider clientId="361184163851-pve81gsol6s8uuqr0hijoqjgi9gib0jc.apps.googleusercontent.com">
        {/* Render Navbar only if the current route is NOT in hiddenNavbarRoutes */}
        {!hiddenNavbarRoutes.includes(location.pathname) && <Navbar />}
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Reset" element={<Reset />} />
          <Route path="/ResetPasswordEmail" element={<ResetPasswordEmail />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/code" element={<VerifyCode />} />
          <Route path="/test" element={<Test />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                {/* <AdminDashboard /> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute requiredRole="superadmin">
                {/* <SuperAdminPanel /> */}
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Render Footer only if the current route is NOT in hiddenNavbarRoutes */}
        {!hiddenNavbarRoutes.includes(location.pathname) && <Footer />}
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
