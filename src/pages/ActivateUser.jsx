import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { LiaUserCheckSolid } from "react-icons/lia";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ActivateUser() {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isActivated, setIsActivated] = useState(false);
  const [error, setError] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");

  useEffect(() => {
    const activateUser = async () => {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/cloudseal/v1/api/user/status`,
          null,
          {
            params: {
              userId: userId,
              status: "active",
            },
          }
        );
        setUsername(response.data.username);
        setEmail(response.data.email);
        setIsActivated(true);
      } catch (err) {
        setError("Failed to activate user. Please try again.");
        console.error(err);
      }
    };

    if (userId) {
      activateUser();
    } else {
      setError("Invalid or missing userId in URL.");
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
        {isActivated ? (
          <>
            <div className="text-center justify-center items-center mt-15">
              <div className="flex justify-center mb-4">
                <LiaUserCheckSolid className="text-green-600 text-8xl" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Hi {username}, your account ({email}) has been successfully
                activated!
              </h2>

              <p className="text-gray-600 mb-6">
                You can now log in to your account.
              </p>

              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </>
        ) : (
          <>
            {error ? (
              <p className="text-red-400 text-lg">{error}</p>
            ) : (
              <p className="text-white">Activating user...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
