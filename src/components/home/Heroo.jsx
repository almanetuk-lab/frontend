
// src/components/Hero.jsx (Light Theme)
import React, { useEffect } from "react";
import AOS from "aos";
import { FaLinkedin, FaApple, FaGoogle } from "react-icons/fa";

export default function Heroo() {
  const heroImage = "/images/0.jpg.jpg";

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="relative w-full min-h-[700px] md:min-h-[750px] lg:min-h-[800px] rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-[#E3F2FD] via-[#F8F9FA] to-[#FFEBEE]">
      
      {/* Background pattern (optional) */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#4D6D9E]/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-[#FF66CC]/10 blur-3xl"></div>
      </div>

      {/* Content Container - Light Theme */}
      <div className="relative z-10 flex flex-col justify-between h-full px-6 md:px-12 lg:px-20 py-12">
        
        {/* TOP: Logo
        <div data-aos="fade-down" className="flex justify-start">
          <div className="text-3xl font-bold text-[#4D6D9E] tracking-wider">
            LOGO
          </div>
        </div> */}

        {/* CENTER: Main Content */}
        <div className="max-w-3xl mt-12">
          {/* Main Headline */}
          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#2C3E50] leading-tight mb-6"
          >
            Where connection fits your life
          </h1>

          {/* Subtitle */}
          <p
            data-aos="fade-up"
            data-aos-delay="150"
            className="text-xl md:text-2xl text-[#546E7A] mb-10 max-w-2xl"
          >
            A platform designed around real-life compatibility, not endless swiping or surface-level attraction.
          </p>

          {/* Description */}
          <p
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-lg text-[#546E7A]/90 mb-12 max-w-2xl"
          >
            Built for adults who value ambition, personal balance and meaningful connection and want the freedom to explore openly and decide for themselves.
          </p>

          {/* Waitlist Section */}
          <div data-aos="fade-up" data-aos-delay="450" className="mb-12">
            <h3 className="text-[#2C3E50] text-xl mb-6 font-medium">
              Join the waitlist
            </h3>
            
            {/* Social Login Buttons - Light Theme */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button className="flex items-center gap-3 px-6 py-3 bg-[#0077B5] text-white rounded-xl font-medium hover:opacity-90 transition shadow-sm">
                <FaLinkedin size={20} />
                Continue with LinkedIn
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-[#000000] text-white rounded-xl font-medium hover:opacity-90 transition shadow-sm">
                <FaApple size={20} />
                Continue with Apple
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-white text-gray-800 rounded-xl font-medium hover:bg-gray-50 transition shadow-sm border border-gray-200">
                <FaGoogle size={20} />
                Continue with Google
              </button>
            </div>

            {/* OR Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Email Waitlist */}
            <div className="max-w-md">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6D9E] focus:border-transparent shadow-sm"
                />
                <button className="px-8 py-3 bg-[#4D6D9E] text-white font-semibold rounded-xl hover:bg-[#3A5A8F] transition shadow-sm">
                  Join Waitlist
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                We'll notify you when we launch. No spam, ever.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM: Private by design text */}
        <div 
          data-aos="fade-up"
          data-aos-delay="600"
          className="text-center pt-8 mt-8 border-t border-gray-200"
        >
          <p className="text-2xl md:text-3xl font-medium text-[#4D6D9E]">
            Private by design. Built for clarity, not chaos
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-r from-[#4D6D9E]/10 to-[#FF66CC]/10 rounded-full blur-2xl"></div>
      </div>
    </section>
  );
}
























// // src/components/Hero.jsx
// import React, { useEffect } from "react";
// import AOS from "aos";

// export default function Heroo() {
//   const heroImage = "/images/ok.jpg"; 

//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   return (
//     <section className="relative w-full h-[700px] md:h-[750px] lg:h-[800px] rounded-3xl overflow-hidden shadow-lumira">
//       {/* Background image */}
//       <img
//         src={heroImage}
//         alt="Friendly couple walking in a park"
//         className="absolute inset-0 w-full h-full object-cover transform transition-lumira hover:scale-105"
//       />

//       {/* Overlay gradient - Using Lumira gradient colors */}
//       <div className="absolute inset-0 bg-gradient-to-b from-[#4D6D9E]/80 via-[#8F8DA5]/40 to-transparent backdrop-blur-sm" />

//       {/* Content */}
//       <div className="relative z-10 flex flex-col justify-center items-start h-full max-w-4xl px-6 md:px-12 lg:px-16">
//         {/* Welcome Badge */}
//         <span
//           data-aos="fade-up"
//           className="bg-[#FF66CC] text-[#F5F5F5] px-4 py-1 rounded-full mb-4 font-medium text-sm shadow-sm"
//         >
//           Welcome to Intentional Connection
//         </span>

//         {/* Headline */}
//         <h1
//           data-aos="fade-up"
//           data-aos-delay="150"
//           className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#F5F5F5] leading-tight mb-6 drop-shadow-md"
//         >
//           Find Friendship and Companionship
//         </h1>

//         {/* Subtext */}
//         <p
//           data-aos="fade-up"
//           data-aos-delay="300"
//           className="text-[hsl(180,3%,94%)] text-lg md:text-xl mb-8 drop-shadow-sm"
//         >
//           Intentional Connection is a safe, trusted space where people can meet, connect,
//           and rediscover the joy of meaningful relationships.
//         </p>

//         {/* CTA Buttons */}
//         <div data-aos="fade-up" data-aos-delay="450" className="flex flex-wrap gap-4">
//           <a
//             href="#join"
//             className="px-8 py-4 bg-[#FF66CC] text-[#F5F5F5] font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-[#ff4dc2] transform transition-lumira"
//           >
//             Join Free Today
//           </a>
//           <a
//             href="#how"
//             className="px-8 py-4 ring-1 ring-[#8F8DA5] text-[#F5F5F5] font-semibold rounded-xl bg-[#4D6D9E]/80 hover:bg-[#8F8DA5]/50 transition-lumira"
//           >
//             See How It Works
//           </a>
//         </div>

//         {/* Bottom Info Cards */}
//         <div className="mt-12 grid grid-cols-3 gap-4 w-full">
//           <div
//             data-aos="zoom-in"
//             data-aos-delay="600"
//             className="bg-[#4D6D9E]/90 backdrop-blur-sm p-4 rounded-xl shadow-md text-center hover:shadow-xl transition-lumira border border-[#8F8DA5]"
//           >
//             <div className="text-[#FF66CC] font-bold text-lg">50+</div>
//             <div className="text-xs text-[#BFBFBF]">Designed for</div>
//           </div>
//           <div
//             data-aos="zoom-in"
//             data-aos-delay="750"
//             className="bg-[#4D6D9E]/90 backdrop-blur-sm p-4 rounded-xl shadow-md text-center hover:shadow-xl transition-lumira border border-[#8F8DA5]"
//           >
//             <div className="text-[#FF66CC] font-bold text-lg">100%</div>
//             <div className="text-xs text-[#BFBFBF]">Privacy Focus</div>
//           </div>
//           <div
//             data-aos="zoom-in"
//             data-aos-delay="900"
//             className="bg-[#4D6D9E]/90 backdrop-blur-sm p-4 rounded-xl shadow-md text-center hover:shadow-xl transition-lumira border border-[#8F8DA5]"
//           >
//             <div className="text-[#FF66CC] font-bold text-lg">Local & Virtual</div>
//             <div className="text-xs text-[#BFBFBF]">Ways to meet</div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
























