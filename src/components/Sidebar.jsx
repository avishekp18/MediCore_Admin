import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const menuItems = [
    { label: "Home", icon: <TiHome size={20} />, path: "/" },
    { label: "Doctors", icon: <FaUserDoctor size={20} />, path: "/doctors" },
    { label: "Add Admin", icon: <MdAddModerator size={20} />, path: "/admin/addnew" },
    { label: "Add Doctor", icon: <IoPersonAddSharp size={20} />, path: "/doctor/addnew" },
    { label: "Messages", icon: <AiFillMessage size={20} />, path: "/messages" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed!");
    }
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md fixed w-full z-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <div
              className="flex items-center cursor-pointer space-x-2"
            >
              <div className="md:hidden flex items-center cursor-pointer">
                <GiHamburgerMenu
                  size={24}
                  className="cursor-pointer"
                  onClick={() => setMenuOpen(!menuOpen)}
                />
              </div>
              <span
                onClick={() => navigate("/")}
                className="text-2xl font-bold select-none">MediCore</span>
              <svg
                className="w-5 h-5 text-yellow-400 -translate-y-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c1 0 2 .5 2 1.5s-1 1.5-2 1.5-2-.5-2-1.5S11 2 12 2zM6 9c1-1 4-1 4-1s3 0 4 1c0 0 0 2-4 2s-4-2-4-2zM2 18c1-3 6-6 10-6s9 3 10 6H2z" />
              </svg>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              {menuItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded cursor-pointer transition-colors duration-200 ${isActive
                      ? "border-b-2 border-yellow-400 text-yellow-300"
                      : "hover:text-yellow-200"
                      }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded hover:text-red-400 cursor-pointer transition"
              >
                <RiLogoutBoxFill size={20} />
                <span>Logout</span>
              </button>
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
          <button className="text-white cursor-pointer focus:outline-none" onClick={() => setMenuOpen(false)}>
            ✕
          </button>
        </div>

        <div className="flex flex-col mt-4 space-y-2 px-4">
          {menuItems.map(item => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded cursor-pointer transition ${location.pathname === item.path ? "bg-yellow-500 text-white" : "hover:bg-indigo-600"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 rounded text-red-400 cursor-pointer hover:text-red-200 hover:bg-indigo-600 transition mt-2"
          >
            <RiLogoutBoxFill size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0  bg-opacity-30 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
