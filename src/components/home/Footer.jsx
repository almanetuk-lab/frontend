// src/home/Footer.jsx (Compact Version)
import React from "react";
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#F8F9FA] to-[#E3F2FD] border-t border-gray-200 mt-10"> {/* mt-20 se mt-10 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> {/* py-12 se py-8 */}
        
        {/* Main Footer Grid - 3 Columns */}
        <div className="grid md:grid-cols-3 gap-8 mb-8"> {/* gap-10 se gap-8, mb-12 se mb-8 */}
          
          {/* Column 1: Legal */}
          <div>
            <h3 className="text-base font-bold text-[#2C3E50] mb-4 uppercase tracking-wide"> {/* text-lg se text-base, mb-6 se mb-4 */}
              Legal
            </h3>
            <div className="grid grid-cols-2 gap-4"> {/* gap-6 se gap-4 */}
              {/* Sub-column 1 */}
              <div>
                <ul className="space-y-2"> {/* space-y-3 se space-y-2 */}
                  <li>
                    <a 
                      href="#" 
                      className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors" /* text-sm added */
                    >
                      Legal notice
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                    >
                      Terms and Condition
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Sub-column 2 */}
              <div>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="#" 
                      className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                    >
                      Privacy Notice
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                    >
                      Cookie Settings
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Additional Legal Items */}
            <div className="mt-4 space-y-2"> {/* mt-6 se mt-4 */}
              <div>
                <a 
                  href="#" 
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                >
                  Trust and Safety
                </a>
              </div>
              <div>
                <a 
                  href="#" 
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                >
                  Community Code of Conduct
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-base font-bold text-[#2C3E50] mb-4 uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-3"> {/* space-y-4 se space-y-3 */}
              <li>
                <a 
                  href="/about" 
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors" /* text-lg se text-sm */
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Follow us */}
          <div>
            <h3 className="text-base font-bold text-[#2C3E50] mb-4 uppercase tracking-wide">
              Follow us
            </h3>
            <div className="flex space-x-4"> {/* space-x-6 se space-x-4 */}
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center text-white hover:bg-[#0066a0] transition-colors" /* w-12,h-12 se w-10,h-10 */
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} /> {/* size={24} se size={20} */}
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:bg-[#1666d9] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:bg-[#1a8cd9] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
            </div>
            <p className="text-xs text-[#546E7A] mt-4"> {/* text-sm se text-xs, mt-6 se mt-4 */}
              Stay connected with us for updates and community news.
            </p>
          </div>
        </div>

        {/* Divider - Thinner and less margin */}
        <div className="border-t border-gray-300 my-4"></div> {/* my-8 se my-4 */}

        {/* Bottom Section with Logo - Compact */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2"> {/* Added py-2 */}
          {/* Logo - Smaller */}
          <div className="mb-4 md:mb-0">
            <div className="text-2xl font-bold text-[#4D6D9E] tracking-wider"> {/* text-3xl se text-2xl */}
              {/* <img src={logo} alt="logo" size={15} /> */} 
            </div>
          </div>

          {/* Copyright - Smaller text */}
          <div className="text-xs text-[#546E7A]"> {/* text-sm se text-xs */}
            © 2025 Connection Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}









// /* Footer component code */
// import React from "react";
// import logo from "../../assets/logo.png"

// export default function Footer() {
//   return (
//     <footer className="mt-12 bg-[#4D6D9E] border-t border-[#8F8DA5]">
//       <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-[#FF66CC] flex items-center justify-center text-[#F5F5F5] font-bold">
//             IC
//           </div>
//           <div>
//             <div className="font-semibold text-[#F5F5F5]">
//               <img
//                 src={logo}
//                 alt="Logo"
//                 className="h-14 sm:h-16 w-auto object-contain"
//               />
//             </div>
//             <div className="text-sm text-[#BFBFBF]">
//               © 2025 Intentional Connetion. All rights reserved.
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-6 text-sm">
//           <nav className="flex gap-3">
//             <a
//               href="#"
//               className="text-[#F5F5F5] hover:text-[#FF66CC] transition-colors duration-200"
//             >
//               Home
//             </a>
//             <a
//               href="#about"
//               className="text-[#F5F5F5] hover:text-[#FF66CC] transition-colors duration-200"
//             >
//               About
//             </a>
//             <a
//               href="#"
//               className="text-[#F5F5F5] hover:text-[#FF66CC] transition-colors duration-200"
//             >
//               Safety Tips
//             </a>
//             <a
//               href="#blog"
//               className="text-[#F5F5F5] hover:text-[#FF66CC] transition-colors duration-200"
//             >
//               Blog
//             </a>
//             <a
//               href="#"
//               className="text-[#F5F5F5] hover:text-[#FF66CC] transition-colors duration-200"
//             >
//               Contact
//             </a>
//             <a
//               href="#"
//               className="text-[#F5F5F5] hover:text-[#FF66CC] transition-colors duration-200"
//             >
//               FAQs
//             </a>
//           </nav>
//           <div className="flex items-center gap-3">
//             {/* <a href="#" aria-label="facebook" className="text-[#F5F5F5] hover:text-[#FF66CC]">FB</a>
// <a href="#" aria-label="instagram" className="text-[#F5F5F5] hover:text-[#FF66CC]">IG</a>
// <a href="#" aria-label="linkedin" className="text-[#F5F5F5] hover:text-[#FF66CC]">LI</a> */}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// /* Footer component code */
// import React from 'react';

// export default function Footer(){
// return (
// <footer className="mt-12 bg-white border-t border-amber-50">
// <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// <div className="flex items-center gap-3">
// <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">M</div>
// <div>
// <div className="font-semibold">MingleHub</div>
// <div className="text-sm text-amber-700/80">© 2025 MingleHub. All rights reserved.</div>
// </div>
// </div>

// <div className="flex items-center gap-6 text-sm">
// <nav className="flex gap-3">
// <a href="#">Home</a>
// <a href="#about">About</a>
// <a href="#">Safety Tips</a>
// <a href="#blog">Blog</a>
// <a href="#">Contact</a>
// <a href="#">FAQs</a>
// </nav>
// <div className="flex items-center gap-3">
// {/* <a href="#" aria-label="facebook">FB</a>
// <a href="#" aria-label="instagram">IG</a>
// <a href="#" aria-label="linkedin">LI</a> */}
// </div>
// </div>
// </div>
// </footer>
// );
// }
