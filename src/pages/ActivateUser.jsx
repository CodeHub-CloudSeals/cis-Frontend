import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { LiaUserCheckSolid } from "react-icons/lia";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API url", API_BASE_URL);

export default function ActivateUser() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        return;
      }

      const url = `${API_BASE_URL}/cloudseal/v1/api/user/${id}`;
      console.log("Fetching from:", url);

      try {
        const res = await axios.get(url);
        setUser(res.data);
      } catch (err) {
        console.error("User not found:", err);
        setUser(null); // just set user as null
      }
    };

    fetchUser();
  }, [id]);

  return (
    <div className="p-6 justify-center items-center mt-20 bg-opacity-50 bg-white">
      {user ? (
        <div className="space-y-2 text-gray-800 text-sm">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.status}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(user.createdAt).toLocaleString()}
          </p>
          <hr className="my-3" />
          <h2 className="font-semibold text-md">Organization Info</h2>
          <p>
            <strong>Org Name:</strong> {user.organizations?.name}
          </p>
          <p>
            <strong>Domain:</strong> {user.organizations?.domain}
          </p>
          <p>
            <strong>Org Created:</strong>{" "}
            {new Date(user.organizations?.createdAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <div className="text-center justify-center items-center mt-15">
          <div className="flex justify-center mb-4">
            <LiaUserCheckSolid className="text-green-600 text-8xl" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Your account has been successfully activated!
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
      )}
    </div>
  );
}
