// src/home/Footer.jsx (Compact Version)
import React from "react";
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#F8F9FA] to-[#E3F2FD] border-t border-gray-200 ">
      {" "}
      {/* mt-20 se mt-10 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {" "}
        {/* py-12 se py-8 */}
        {/* Main Footer Grid - 3 Columns */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {" "}
          {/* gap-10 se gap-8, mb-12 se mb-8 */}
          {/* Column 1: Legal */}
          <div>
            <h3 className="text-base font-bold text-[#2C3E50] mb-4 uppercase tracking-wide">
              {" "}
              {/* text-lg se text-base, mb-6 se mb-4 */}
              Important Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {" "}
              {/* gap-6 se gap-4 */}
              {/* Sub-column 1 */}
              <div>
                <ul className="space-y-2">
                  {" "}
                  {/* space-y-3 se space-y-2 */}
                  <li>
                       <Link
                  onClick={() => window.scrollTo(0, 0)}
                  to="/coming-soon"
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                >
                  Pricecy Noice
                </Link>


                
                    {/* <a
                      href="#"
                      className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors" /* text-sm added /
                    >
                      Pricecy Notice
                    </a> */}

                  </li>
                  <li>
                    <Link
                      to="/coming-soon"
                      className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      Terms And Condition
                    </Link>

                    {/* <a
                      href="#"
                      className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                    >
                      Terms and Condition
                    </a> */}
                  </li>
                </ul>
              </div>
            </div>

            {/* Additional Legal Items */}
            <div className="mt-4 space-y-2">
              <div>
                <Link
                  to="/coming-soon"
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Trust and Safety
                </Link>
              </div>
              <div>
                <Link
                  to="/coming-soon"
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Community Code of Conduct
                </Link>
              </div>
            </div>
          </div>
          {/* Column 2: Company */}
          <div>
            <h3 className="text-base font-bold text-[#2C3E50] mb-4 uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  onClick={() => window.scrollTo(0, 0)}
                  to="/about"
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => window.scrollTo(0, 0)}
                  to="/contact"
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 3: Follow us */}
          <div>
            <h3 className="text-base font-bold text-[#2C3E50] mb-4 uppercase tracking-wide">
              Follow us
            </h3>
            <div className="flex space-x-4">
              {/* LinkedIn Link */}
              <Link
                to="/linkedin"
                className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center text-white hover:bg-[#0066a0] transition-colors"
                aria-label="LinkedIn"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaLinkedin size={20} />
              </Link>

              {/* Facebook Link */}
              <Link
                to="/facebook"
                className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:bg-[#1666d9] transition-colors"
                aria-label="Facebook"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaFacebook size={20} />
              </Link>

              {/* Twitter Link */}
              <Link
                to="/twitter"
                className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:bg-[#1a8cd9] transition-colors"
                aria-label="Twitter"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaTwitter size={20} />
              </Link>
            </div>
            <p className="text-xs text-[#546E7A] mt-4">
              Stay connected with us for updates and community news.
            </p>
          </div>
        </div>
        {/* Divider - Thinner and less margin */}
        <div className="border-t border-gray-300 my-4"></div>{" "}
        {/* my-8 se my-4 */}
        {/* Bottom Section with Logo - Compact */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2">
          {" "}
          {/* Added py-2 */}
          {/* Logo - Smaller */}
          <div className="mb-4 md:mb-0">
            <div className="text-2xl font-bold text-[#4D6D9E] tracking-wider">
              {" "}
              {/* text-3xl se text-2xl */}
              {/* <img src={logo} alt="logo" size={15} /> */}
            </div>
          </div>
          {/* Copyright - Smaller text */}
          <div className="text-xs text-[#546E7A]">
            {" "}
            {/* text-sm se text-xs */}© 2026 Connection Platform. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
