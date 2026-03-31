import React from "react";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import logoIme from "../assets/logo/logo-img.png"; // Default logo
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-sky-400 text-white py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Section */}
        <div>
          <Link to={"/"} className="flex items-center space-x-3">
            <img
              src={logoIme}
              alt="Logo"
              className="w-92"
            />
           
          </Link>
        </div>

        {/* Middle Section - Useful Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Useful Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-gray-200">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-200">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section - Menu */}
        <div>
          <div className="flex items-center justify-between md:justify-start md:space-x-4 mb-4">
            <h2 className="text-xl font-semibold">Menu</h2>
            <Link to="/admin/login">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-sm font-medium px-4 py-2 rounded shadow flex items-center gap-2">
                <MdEmail /> Login Admin
              </button>
            </Link>
          </div>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-gray-200">Home</a></li>
            <li><a href="#" className="hover:text-gray-200">About</a></li>
            <li><a href="#" className="hover:text-gray-200">Properties</a></li>
            <li><a href="#" className="hover:text-gray-200">Specials</a></li>
            <li><a href="#" className="hover:text-gray-200">Activities</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-white/30 pt-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-center md:text-left">
          2025 Copyright © & Powered by
        </p>
        <div className="flex space-x-4 mt-3 md:mt-0">
          <a
            href="#"
            className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all"
          >
            <FaFacebookF />
          </a>
          <a
            href="#"
            className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
