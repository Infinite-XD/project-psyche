import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import "../styles/globals.css";

const SettingsPage = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/me", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setEmail(data.email);
      }
    } catch (err) {
      setError("Failed to fetch user data");
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/update-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      if (response.ok) {
        setSuccess("Email updated successfully");
      } else {
        setError("Failed to update email");
      }
    } catch (err) {
      setError("Error updating email");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
        credentials: "include",
      });

      if (response.ok) {
        setSuccess("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      } else {
        setError("Failed to change password");
      }
    } catch (err) {
      setError("Error changing password");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await fetch("/api/delete-account", {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          handleLogout();
        } else {
          setError("Failed to delete account");
        }
      } catch (err) {
        setError("Error deleting account");
      }
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Settings</h1>

        <div className="max-w-md mx-auto space-y-6">
          {/* Email Update Form */}
          <form onSubmit={handleEmailUpdate} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Update Email</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Update Email
            </button>
          </form>

          {/* Password Change Form */}
          <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Current Password"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Change Password
            </button>
          </form>

          {/* Account Deletion */}
          <div className="bg-red-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Delete Account
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>}
          {success && <div className="text-green-500 p-4 bg-green-50 rounded-lg">{success}</div>}
        </div>

        <Navigation />
      </div>
    </div>
  );
};

export default SettingsPage;