import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

// Module-level cache
let cachedMessages = null;

const Messages = () => {
  const [messages, setMessages] = useState(cachedMessages);
  const { isAuthenticated, admin, loading: authLoading } = useAuth();

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        "https://medicore-backend-sv2c.onrender.com/api/v1/message/",
        { withCredentials: true }
      );
      setMessages(data.messages || []);
      cachedMessages = data.messages || [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    }
  };

  useEffect(() => {
    if (!cachedMessages) fetchMessages();

    // Listen for global updates
    const handleUpdate = () => fetchMessages();
    window.addEventListener("messageUpdated", handleUpdate);

    return () => window.removeEventListener("messageUpdated", handleUpdate);
  }, []);

  if (authLoading) return null; // do not block UI
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <section className="p-6 min-h-screen bg-gray-100 py-20">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Messages</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
            >
              <h4 className="text-lg font-semibold mb-2">{`${msg.firstName} ${msg.lastName}`}</h4>
              <div className="text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Email:</span> {msg.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {msg.phone}
                </p>
                <p>
                  <span className="font-medium">Message:</span> {msg.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <h2 className="text-gray-500 col-span-full text-center mt-10 text-lg">
            No Messages Found!
          </h2>
        )}
      </div>
    </section>
  );
};

export default Messages;
