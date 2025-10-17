// src/pages/Home.jsx
import React from "react";
import Header from "../home/Header";
import Footer from "../home/Footer";
import FeatureCard from "../home/FeaturesCards";
import Spotlight from "../home/Spotlight";
import CTA from "../home/CTA";
import Heroo from "../home/Heroo";

// Use local images from public/images folder
const cards = [
  {
    title: "Verified Profiles",
    desc: "Screened members you can trust.",
    icon: "🛡️",
    img: "/images/home.jpg", // public/images/card1.jpg
  },
  {
    title: "Private Messaging",
    desc: "Secure one-on-one chats.",
    icon: "💬",
    img: "/images/two.jpg",
  },
  {
    title: "Video Introductions",
    desc: "Meet virtually before meeting.",
    icon: "🎥",
    img: "/images/meet.jpg",
  },
  {
    title: "Smart Matchmaking",
    desc: "Matches based on interests.",
    icon: "🎯",
    img: "/images/four.jpg",
  },
  {
    title: "Events & Groups",
    desc: "Join local activities and clubs.",
    icon: "💌",
    img: "/images/one.jpg",
  },
  {
    title: "Easy Interface",
    desc: "Designed for comfort and clarity.",
    icon: "✨",
    img: "/images/interface.jpg",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-amber-900">
      {/* <Header /> */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 mt-5">
        <Heroo />

        {/* Feature Cards */}
        <section className="space-y-10">
          <h3 className="text-3xl font-bold mb-6 text-center">
            What Makes MingleHub Different
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((c, i) => (
              <FeatureCard key={i} {...c} />
            ))}
          </div>
        </section>

        {/* Spotlight */}
        <Spotlight img="/images/main.jpg" />

        {/* Call-to-Action */}
        <CTA />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

