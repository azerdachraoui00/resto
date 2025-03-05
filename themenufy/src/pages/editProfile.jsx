import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";
import BlurContainer from "../components/blurContainer";
import Button from "../components/button";
import Footer from "../components/footer";

const EditProfile = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [userId, setUserId] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state
  const [isModalCompleted, setIsModalCompleted] = useState(false); // Track if the modal is completed

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
          setTwoFactorEnabled(data.twoFactorEnabled);
          setUserId(data._id);
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

  const setup2FA = async () => {
    const response = await fetch("http://localhost:5000/api/users/setup-2fa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    if (data.qrCodeDataUrl) {
      setQrCode(data.qrCodeDataUrl);
      setShowModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent form submission if 2FA modal is still active and not completed
    if (showModal && !isModalCompleted) {
      setError("Please complete 2FA setup before submitting.");
      return;
    }

    if (isSubmitting) {
      return; // Prevent double submission
    }

    setIsSubmitting(true); // Set submitting state

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("All fields are required!");
      setIsSubmitting(false);
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
          password: formData.password || undefined,
        }),
      });

      if (response.ok) {
        navigate("/profilePage");
      } else {
        setError("Update failed. Try again.");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    } finally {
      setIsSubmitting(false); // Reset the submitting state
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          localStorage.removeItem("token");
          navigate("/Register");
        } else {
          setError("Failed to delete account.");
        }
      } catch (err) {
        setError("Server error, please try again later.");
      }
    }
  };

  const handleToggle2FA = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/toggle-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: userId,
          enabled: !twoFactorEnabled,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTwoFactorEnabled(data.twoFactorEnabled);

        if (data.twoFactorEnabled) {
          setup2FA();
        }
      }
    } catch (error) {
      console.error("Failed to update 2FA settings", error);
    }
  };

  const handleNext = () => {
    setIsScanning(false);
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalCompleted(true); // Mark 2FA modal as completed
        setShowModal(false);
        setTwoFactorEnabled(true);
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
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
        <BlurContainer className="fixed inset-x-auto items-center justify-center p-8 rounded-2xl bg-white/10 backdrop-blur-xl text-white">
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

              <div className="mt-4 flex items-center space-x-4">
                <label className="text-white">Enable Two-Factor Authentication</label>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={handleToggle2FA}
                    className="opacity-0 absolute w-0 h-0"
                  />
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                      twoFactorEnabled ? "bg-green-500" : "bg-gray-300"
                    }`}
                    onClick={handleToggle2FA}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full transition-all ${
                        twoFactorEnabled ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {showModal && (
              <BlurContainer className="fixed inset-y-0 flex items-center justify-center w-[315px] rounded-2xl bg-black/70 backdrop-blur-xl text-white">
                <div className=" p-8 rounded-xl shadow-lg">
                  <h2 className="text-2xl mb-4">
                    {isScanning ? "Scan the QR Code" : "Enter the Verification Code"}
                  </h2>
                  {isScanning ? (
                    <div className="text-center">
                      <img
                        src={qrCode}
                        alt="QR Code"
                        className="w-48 h-48 mx-auto mb-4"
                      />
                      <button
                        onClick={handleNext}
                        className="w-full bg-yellow-500 text-white font-semibold py-3 px-6 rounded-full"
                      >
                        Next
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Enter the verification code"
                      />
                      <button
                        onClick={handleVerify}
                        className="mt-4 w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-full"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                </div>
              </BlurContainer>
            )}

            <Button
              type="submit"
              className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
              disabled={isSubmitting || showModal || !isModalCompleted} // Disable until modal is completed
            >
              Save Changes
            </Button>
            <Button
              onClick={handleDelete}
              type="button"
              className="w-full bg-transparent hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              Delete Account
            </Button>
          </form>
        </BlurContainer>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;
