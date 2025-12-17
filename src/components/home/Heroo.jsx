// src/components/Hero.jsx
import React, { useEffect } from "react";
import AOS from "aos";

export default function Heroo() {
  const heroImage = "/images/ok.jpg"; 

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="relative w-full h-[700px] md:h-[750px] lg:h-[800px] rounded-3xl overflow-hidden shadow-lumira">
      {/* Background image */}
      <img
        src={heroImage}
        alt="Friendly couple walking in a park"
        className="absolute inset-0 w-full h-full object-cover transform transition-lumira hover:scale-105"
      />

      {/* Overlay gradient - Using Lumira gradient colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4D6D9E]/80 via-[#8F8DA5]/40 to-transparent backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-start h-full max-w-4xl px-6 md:px-12 lg:px-16">
        {/* Welcome Badge */}
        <span
          data-aos="fade-up"
          className="bg-[#FF66CC] text-[#F5F5F5] px-4 py-1 rounded-full mb-4 font-medium text-sm shadow-sm"
        >
          Welcome to Intentional Connection
        </span>

        {/* Headline */}
        <h1
          data-aos="fade-up"
          data-aos-delay="150"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#F5F5F5] leading-tight mb-6 drop-shadow-md"
        >
          Find Friendship and Companionship
        </h1>

        {/* Subtext */}
        <p
          data-aos="fade-up"
          data-aos-delay="300"
          className="text-[hsl(180,3%,94%)] text-lg md:text-xl mb-8 drop-shadow-sm"
        >
          Intentional Connection is a safe, trusted space where people can meet, connect,
          and rediscover the joy of meaningful relationships.
        </p>

        {/* CTA Buttons */}
        <div data-aos="fade-up" data-aos-delay="450" className="flex flex-wrap gap-4">
          <a
            href="#join"
            className="px-8 py-4 bg-[#FF66CC] text-[#F5F5F5] font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-[#ff4dc2] transform transition-lumira"
          >
            Join Free Today
          </a>
          <a
            href="#how"
            className="px-8 py-4 ring-1 ring-[#8F8DA5] text-[#F5F5F5] font-semibold rounded-xl bg-[#4D6D9E]/80 hover:bg-[#8F8DA5]/50 transition-lumira"
          >
            See How It Works
          </a>
        </div>

        {/* Bottom Info Cards */}
        <div className="mt-12 grid grid-cols-3 gap-4 w-full">
          <div
            data-aos="zoom-in"
            data-aos-delay="600"
            className="bg-[#4D6D9E]/90 backdrop-blur-sm p-4 rounded-xl shadow-md text-center hover:shadow-xl transition-lumira border border-[#8F8DA5]"
          >
            <div className="text-[#FF66CC] font-bold text-lg">50+</div>
            <div className="text-xs text-[#BFBFBF]">Designed for</div>
          </div>
          <div
            data-aos="zoom-in"
            data-aos-delay="750"
            className="bg-[#4D6D9E]/90 backdrop-blur-sm p-4 rounded-xl shadow-md text-center hover:shadow-xl transition-lumira border border-[#8F8DA5]"
          >
            <div className="text-[#FF66CC] font-bold text-lg">100%</div>
            <div className="text-xs text-[#BFBFBF]">Privacy Focus</div>
          </div>
          <div
            data-aos="zoom-in"
            data-aos-delay="900"
            className="bg-[#4D6D9E]/90 backdrop-blur-sm p-4 rounded-xl shadow-md text-center hover:shadow-xl transition-lumira border border-[#8F8DA5]"
          >
            <div className="text-[#FF66CC] font-bold text-lg">Local & Virtual</div>
            <div className="text-xs text-[#BFBFBF]">Ways to meet</div>
          </div>
        </div>
      </div>
    </section>
  );
}
























