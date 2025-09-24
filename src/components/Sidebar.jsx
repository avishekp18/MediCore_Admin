import React, { useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null; // don't show navbar if not logged in

  const menuItems = [
    { label: "Home", icon: <TiHome size={20} />, path: "/" },
    { label: "Doctors", icon: <FaUserDoctor size={20} />, path: "/doctors" },
    { label: "Add Admin", icon: <MdAddModerator size={20} />, path: "/admin/addnew" },
    { label: "Add Doctor", icon: <IoPersonAddSharp size={20} />, path: "/doctor/addnew" },
    { label: "Messages", icon: <AiFillMessage size={20} />, path: "/messages" },
  ];

  const handleLogout = async () => {
    try {
      await logout(); // clears auth state
      toast.success("Logged out successfully!");
      navigate("/login", { replace: true }); // immediate redirect
    } catch (err) {
      toast.error("Logout failed!");
    }
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
              <span className="text-xl font-bold">MediCore</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-1 hover:text-indigo-300 transition"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-red-400 transition"
              >
                <RiLogoutBoxFill size={20} />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <GiHamburgerMenu
                size={28}
                className="cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-indigo-700 text-white z-40 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-indigo-500">
          <span
            className="text-xl font-bold cursor-pointer"
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
          >
            MediCore
          </span>
          <button className="text-white focus:outline-none" onClick={() => setMenuOpen(false)}>
            ✕
          </button>
        </div>

        <div className="flex flex-col mt-4 space-y-2 px-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
              className="flex items-center space-x-2 hover:bg-indigo-600 px-3 py-2 rounded transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-400 hover:text-red-200 px-3 py-2 rounded transition mt-2"
          >
            <RiLogoutBoxFill size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
