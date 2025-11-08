// src/components/Hero.jsx
// src/components/Hero.jsx
import React, { useEffect } from "react";
// import "aos/dist/aos.css";
import AOS from "aos";
// import AOS from ''

export default function Heroo() {
  const heroImage = "/images/ok.jpg"; // place your image in public/images

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="relative w-full h-[700px] md:h-[750px] lg:h-[800px] rounded-3xl overflow-hidden shadow-lg">
      {/* Background image */}
      <img
        src={heroImage}
        alt="Friendly couple walking in a park"
        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 ease-in-out hover:scale-105"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-transparent backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-start h-full max-w-4xl px-6 md:px-12 lg:px-16">
        {/* Welcome Badge */}
        <span
          data-aos="fade-up"
          className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full mb-4 font-medium text-sm shadow-sm"
        >
          Welcome to MingleHub
        </span>

        {/* Headline */}
        <h1
          data-aos="fade-up"
          data-aos-delay="150"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-amber-900 leading-tight mb-6 drop-shadow-md"
        >
          Find Friendship and Companionship
        </h1>

        {/* Subtext */}
        <p
          data-aos="fade-up"
          data-aos-delay="300"
          className="text-amber-800/90 text-lg md:text-xl mb-8 drop-shadow-sm"
        >
          MingleHub is a safe, trusted space where people can meet, connect,
          and rediscover the joy of meaningful relationships.
        </p>

        {/* CTA Buttons */}
        <div data-aos="fade-up" data-aos-delay="450" className="flex flex-wrap gap-4">
          <a
            href="#join"
            className="px-8 py-4 bg-amber-700 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition-all"
          >
            Join Free Today
          </a>
          <a
            href="#how"
            className="px-8 py-4 ring-1 ring-amber-200 text-amber-900 font-semibold rounded-xl bg-white hover:bg-amber-50 transition-all"
          >
            See How It Works
          </a>
        </div>

        {/* Bottom Info Cards */}
        <div className="mt-12 grid grid-cols-3 gap-4 w-full">
          <div
            data-aos="zoom-in"
            data-aos-delay="600"
            className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow"
          >
            <div className="text-amber-700 font-bold text-lg">50+</div>
            <div className="text-xs text-amber-600">Designed for</div>
          </div>
          <div
            data-aos="zoom-in"
            data-aos-delay="750"
            className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow"
          >
            <div className="text-amber-700 font-bold text-lg">100%</div>
            <div className="text-xs text-amber-600">Privacy Focus</div>
          </div>
          <div
            data-aos="zoom-in"
            data-aos-delay="900"
            className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow"
          >
            <div className="text-amber-700 font-bold text-lg">Local & Virtual</div>
            <div className="text-xs text-amber-600">Ways to meet</div>
          </div>
        </div>
      </div>
    </section>
  );
}



