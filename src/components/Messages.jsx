import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

// Module-level cache
let cachedMessages = null;

const Messages = () => {
  const [messages, setMessages] = useState(cachedMessages);
  const [selectedMessage, setSelectedMessage] = useState(null); // for modal
  const [loading, setLoading] = useState(!cachedMessages); // show loader if no cache
  const { isAuthenticated, admin, loading: authLoading } = useAuth();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://medicore-backend-sv2c.onrender.com/api/v1/message/",
        { withCredentials: true }
      );
      setMessages(data.messages || []);
      cachedMessages = data.messages || [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cachedMessages) fetchMessages();

    const handleUpdate = () => fetchMessages();
    window.addEventListener("messageUpdated", handleUpdate);
    return () => window.removeEventListener("messageUpdated", handleUpdate);
  }, []);

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this message?")) return;

  //   try {
  //     await axios.delete(
  //       `https://medicore-backend-sv2c.onrender.com/api/v1/message/${id}`,
  //       { withCredentials: true }
  //     );
  //     const updated = messages.filter((msg) => msg._id !== id);
  //     setMessages(updated);
  //     cachedMessages = updated;
  //     toast.success("Message deleted successfully!");
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Failed to delete message");
  //   }
  // };
  // const handleDelete = async (id, email) => {
  //   // prevent deleting demo message
  //   if (email === "demo@medicore.com") {
  //     toast.info("This is a demo message and cannot be deleted.");
  //     return;
  //   }

  //   if (!window.confirm("Are you sure you want to delete this message?")) return;

  //   try {
  //     await axios.delete(
  //       `https://medicore-backend-sv2c.onrender.com/api/v1/message/${id}`,
  //       { withCredentials: true }
  //     );
  //     const updated = messages.filter((msg) => msg._id !== id);
  //     setMessages(updated);
  //     cachedMessages = updated;
  //     toast.success("Message deleted successfully!");
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Failed to delete message");
  //   }
  // };
  const handleDelete = async () => {
    toast.info("Delete is disabled in demo mode. Messages cannot be deleted.");
  };


  return (
    <section className="p-6 min-h-screen bg-gray-100 py-20">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Messages</h1>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-16 h-16 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : messages && messages.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-gray-800">{`${msg.firstName} ${msg.lastName}`}</h4>
                <span
                  className={`w-3 h-3 rounded-full ${msg.read ? "bg-green-400" : "bg-yellow-400"}`}
                  title={msg.read ? "Read" : "Unread"}
                />
              </div>

              <div className="text-gray-700 space-y-1 mb-4 text-sm">
                <p><span className="font-medium">Email:</span> {msg.email}</p>
                <p><span className="font-medium">Phone:</span> {msg.phone}</p>
              </div>

              <div className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg flex-1">
                {msg.message.length > 150 ? `${msg.message.substring(0, 150)}...` : msg.message}
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm cursor-pointer"
                  onClick={() => setSelectedMessage(msg)}
                >
                  View
                </button>
                <button
                  className="px-3 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed hover:bg-gray-500 transition text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10 text-lg">No Messages Found!</p>
      )}

      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-11/12 max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setSelectedMessage(null)}
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              {selectedMessage.firstName} {selectedMessage.lastName}
            </h2>
            <div className="text-gray-700 space-y-2 mb-4">
              <p><span className="font-medium">Email:</span> {selectedMessage.email}</p>
              <p><span className="font-medium">Phone:</span> {selectedMessage.phone}</p>
            </div>
            <div className="text-gray-600 bg-gray-50 p-4 rounded-lg">
              {selectedMessage.message}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Messages;
