
// // src/components/Hero.jsx (Optimized for Mobile & Desktop)
import React, { useEffect, useState } from "react";
import AOS from "aos";
import { FaBullseye, FaShieldAlt, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";
import { showMaintenanceModal } from "../../utils/maintenanceModal";

export default function Heroo() {
  const bannerImage = "/images/4.jpg.jpg";

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (

    <section className="relative w-full min-h-[800px] md:min-h-[750px] lg:min-h-[750px] rounded-3xl overflow-hidden shadow-lg bg-gradient-to-r from-[#F8F9FA] to-[#E3F2FD]">
      {/* Container with flex layout */}
      <div className="relative  h-full flex flex-col lg:flex-row">
        {/* MOBILE: Image First (LG se pehle) */}
        <div className="lg:hidden h-[350px] md:h-[400px] w-full">
          {" "}
          {/* Increased height */}
          <div className="relative h-full w-full">
            <img
              src={bannerImage}
              alt="Connection Banner"
              className="w-full h-full object-cover"
            />
            {/* Overlay for mobile */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          </div>
        </div>

        {/* LEFT SIDE: Content (50%) */}
        <div className="lg:w-1/2 h-full flex flex-col justify-center px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-12 lg:pt-0">
          {" "}
          {/* Reduced padding */}
          {/* Main Content */}
          <div className="max-w-2xl mx-auto w-full">


            {/* Main Headline - Smaller fonts */}
            <h1
              data-aos="fade-up"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#2C3E50] leading-tight mb-4 md:mb-6"
            >

              Where connection fits your life
            </h1>

            {/* Subtitle - Smaller */}
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-base sm:text-lg md:text-xl text-[#546E7A] mb-6 md:mb-8 max-w-xl"
            >
              A platform designed around real-life compatibility, not endless
              swiping or surface-level attraction.
            </p>

            {/* Description - Smaller */}
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-sm sm:text-base text-[#546E7A] mb-8 md:mb-10 max-w-xl"
            >
              Built for adults who value ambition, personal balance and
              meaningful connection and want the freedom to explore openly and
              decide for themselves.
            </p>



            {/* Pillars of Compatibility - Premium Highlight Cards */}
            <div data-aos="fade-up" data-aos-delay="300" className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
              <div className="group bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-gray-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-start gap-4 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200/50 transition-all duration-300">
                <div className="p-3 bg-[#E3F2FD] text-[#1E88E5] rounded-xl group-hover:bg-[#1E88E5] group-hover:text-white transition-colors duration-300">
                  <FaBullseye size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#2C3E50] text-sm mb-1 uppercase tracking-wide">Compatibility</h3>
                  <p className="text-xs text-[#607D8B] leading-relaxed font-medium">Built around personality traits, life values, and ambitions instead of superficial matches.</p>
                </div>
              </div>

              <div className="group bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-gray-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-start gap-4 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-pink-200/50 transition-all duration-300">
                <div className="p-3 bg-[#FCE4EC] text-[#D81B60] rounded-xl group-hover:bg-[#D81B60] group-hover:text-white transition-colors duration-300">
                  <FaShieldAlt size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#2C3E50] text-sm mb-1 uppercase tracking-wide">Privacy</h3>
                  <p className="text-xs text-[#607D8B] leading-relaxed font-medium">Control exactly who sees your profile, keeping your peace of mind intact.</p>
                </div>
              </div>

              <div className="group bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-gray-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-start gap-4 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-purple-200/50 transition-all duration-300 col-span-1 sm:col-span-2">
                <div className="p-3 bg-[#F3E5F5] text-[#8E24AA] rounded-xl group-hover:bg-[#8E24AA] group-hover:text-white transition-colors duration-300">
                  <FaComments size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#2C3E50] text-sm mb-1 uppercase tracking-wide">Connections</h3>
                  <p className="text-xs text-[#607D8B] leading-relaxed font-medium">Skip superficial swipes and transition into deep, intentional conversations that fit into your life.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP: Image Right Side (50%) - Increased height */}
        <div className="hidden lg:block lg:w-1/2 h-full">
          <div className="relative h-full w-full">
            <img
              src={bannerImage}
              alt="Connection Banner"
              className="w-full h-full object-cover object-center"
            />
            {/* Optional overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}




























































































































































































































