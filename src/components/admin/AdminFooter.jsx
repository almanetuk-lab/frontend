// src/components/AdminFooter.jsx
import React from "react";
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminFooter() {
  return (
    <footer className="mt-auto bg-gradient-to-b from-[#F8F9FA] to-[#E3F2FD] border-t border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {/* Footer Grid - 3 Columns */}
        <div className="grid md:grid-cols-3 gap-6 mb-4">
          {/* Column 1: Legal */}
          <div>
            <h3 className="text-sm font-bold text-[#2C3E50] mb-3 uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/coming-soon"
                  className="text-xs text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Privacy Notice
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/coming-soon"
                  className="text-xs text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Terms and Condition
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-sm font-bold text-[#2C3E50] mb-3 uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/about"
                  className="text-xs text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/contact"
                  className="text-xs text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Follow us */}
          <div>
            <h3 className="text-sm font-bold text-[#2C3E50] mb-3 uppercase tracking-wide">
              Follow us
            </h3>
            <div className="flex space-x-3">
              <Link
                to="/admin/linkedin"
                className="w-8 h-8 rounded-full bg-[#0077B5] flex items-center justify-center text-white hover:bg-[#0066a0] transition-colors"
                aria-label="LinkedIn"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaLinkedin size={16} />
              </Link>
              <Link
                to="/admin/facebook"
                className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:bg-[#1666d9] transition-colors"
                aria-label="Facebook"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaFacebook size={16} />
              </Link>
              <Link
                to="/admin/twitter"
                className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:bg-[#1a8cd9] transition-colors"
                aria-label="Twitter"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaTwitter size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-3"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-[#546E7A] mb-2 md:mb-0">
            © 2026 Connection Platform. Admin Panel
          </div>
          <div className="text-xs text-[#546E7A]">
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </footer>
  );
}