
// src/pages/Home.jsx (Updated with Application Technical Features Title)
import React from "react";
import Header from "../home/Header";
import Footer from "../home/Footer";
import FeatureCard from "../home/FeaturesCards";
import Spotlight from "../home/Spotlight";
import CTA from "../home/CTA";
import Heroo from "../home/Heroo";
import BlogPage from "../pages/BlogPage";
import { FaBriefcase, FaHeartbeat, FaUserShield } from "react-icons/fa";

export default function Home() {
  const applicationFeatures = [
    {
      title: "Career & Ambition",
      desc: "Your ambition, professional rhythm and long-term direction shape the kind of partnership that actually works.",
      icon: <FaBriefcase className="text-3xl text-[#4D6D9E]" />,
     img:<img src="/images/5.jpg.jpg" alt="" />,
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    {
      title: "Lifestyle & Balance",
      desc: "Daily habits, energy levels, social preferences and how you choose to live outside of work matter more than people admit.",
      icon: <FaHeartbeat className="text-3xl text-[#FF66CC]" />,
           img:<img src="/images/8.jpg.jpg" alt="" />,
      color: "from-pink-50 to-pink-100",
      borderColor: "border-pink-200"
    },
    {
      title: "Character & Values",
      desc: "Values, emotional temperament, communication style and how someone shows up consistently over time.",
      icon: <FaUserShield className="text-3xl text-[#808C82]" />,
     img:<img src="/images/9.jpg.jpg" alt="" />,
      color: "from-green-50 to-green-100",
      borderColor: "border-green-200"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-0">
        
        {/* 1. Hero Section */}
        <Heroo />

        {/* 2. APPLICATION FEATURES */}
        <section className="py-9">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-4">
              Compatibility is more than attraction
            </h2>
            <p className="text-lg text-[#546E7A] max-w-3xl mx-auto">
              Real connection depends on how two lives align, not just how two people look or feel in a moment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {applicationFeatures.map((feature, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${feature.color} p-6 rounded-xl border ${feature.borderColor} shadow-md hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm">
                    {feature.img}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#2C3E50] mb-3 text-center">
                  {feature.title}
                </h3>

                <p className="text-[#546E7A] text-center text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CHOICE WITHOUT PRESSURE SECTION */}
        <section className="py-9">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  // src="/images/main.jpg"
                  src="/images/7.jpg.jpg"
                  alt="People exploring connections without pressure"
                  className="w-full h-[350px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-4">
                Choice works better without pressure
              </h2>
              <p className="text-lg text-[#546E7A] leading-relaxed">
                Explore the entire community. No swipes, no rankings, no artificial urgency. 
                You explore and connect when it feels right.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-gradient-to-r from-[#4D6D9E] to-[#3A5A8F] p-6 rounded-xl text-white shadow-lg">
                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  When connection aligns, life feels lighter
                </h3>
                <p className="text-base leading-relaxed">
                  When a connection resonates with who you are and how you live, 
                  conversations flow naturally and relationships fit into your life 
                  instead of disrupting it.
                </p>
              </div>
            </div>

            <div>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="/images/4.jpg.jpg"
                  alt="Happy couple enjoying meaningful connection"
                  className="w-full h-[350px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. APPLICATION TECHNICAL FEATURES TITLE SECTION */}
        <section className="py-5">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-[#2C3E50] mb-2">
              Application Technical Features
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#4D6D9E] to-[#FF66CC] mx-auto mb-5"></div>
            <p className="text-lg text-[#546E7A] max-w-3xl mx-auto">
              Advanced features designed to enhance your experience and ensure safety
            </p>
          </div>
        </section>

        {/* 5. THE COGNITIVE SAFETY SHIELD SECTION */}
        <section className="py-8 bg-gradient-to-b from-[#F8F9FA] to-[#E3F2FD] rounded-2xl px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-4">
              The Cognitive Safety Shield
            </h2>
            <p className="text-lg text-[#546E7A] max-w-3xl mx-auto">
              Designed to protect your mental peace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Privacy Shield Card */}
            <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-[#2C3E50]">THE PRIVACY SHIELD</h3>
              </div>
              <p className="text-[#546E7A] mb-3 font-medium">Where privacy matters</p>
              <p className="text-sm text-[#546E7A]">
                Control your profile visibility with precision, tailored to the circles you trust.
              </p>
            </div>

            {/* Identity Shield Card */}
            <div className="bg-white p-6 rounded-xl border border-green-200 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">🆔</span>
                </div>
                <h3 className="text-xl font-bold text-[#2C3E50]">THE IDENTITY SHIELD</h3>
              </div>
              <p className="text-[#546E7A] mb-3 font-medium">Built on clarity and accountability</p>
              <p className="text-sm text-[#546E7A]">
                Profile verification with Two-factor Authentication.
              </p>
            </div>

            {/* Behavioral Shield Card */}
            <div className="bg-white p-6 rounded-xl border border-purple-200 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-[#2C3E50]">THE BEHAVIOURAL SHIELD</h3>
              </div>
              <p className="text-[#546E7A] mb-3 font-medium">Intelligent Behavioural Insights</p>
              <p className="text-sm text-[#546E7A]">
                <span className="font-bold">Pattern Sense™</span> observes subtle patterns of pace, consistency, and reciprocity in interactions offering quiet awareness while keeping every decision human.
              </p>
            </div>
          </div>
        </section>

      </main>
     
    </div>
  );
}


// -------------------------------------------//

// old code 
// // src/pages/Home.jsx
// import React from "react";
// import Header from "../home/Header";
// import Footer from "../home/Footer";
// import FeatureCard from "../home/FeaturesCards";
// import Spotlight from "../home/Spotlight";
// import CTA from "../home/CTA";
// import Heroo from "../home/Heroo";
// import BlogPage from "../pages/BlogPage"

// // Use local images from public/images folder
// const cards = [
//   {
//     title: "Verified Profiles",
//     desc: "Screened members you can trust.",
//     icon: "🛡️",
//     img: "/images/home.jpg", // public/images/card1.jpg
//   },
//   {
//     title: "Private Messaging",
//     desc: "Secure one-on-one chats.",
//     icon: "💬",
//     img: "/images/two.jpg",
//   },
//   {
//     title: "Video Introductions",
//     desc: "Meet virtually before meeting.",
//     icon: "🎥",
//     img: "/images/meet.jpg",
//   },
//   {
//     title: "Smart Matchmaking",
//     desc: "Matches based on interests.",
//     icon: "🎯",
//     img: "/images/four.jpg",
//   },
//   {
//     title: "Events & Groups",
//     desc: "Join local activities and clubs.",
//     icon: "💌",
//     img: "/images/one.jpg",
//   },
//   {
//     title: "Easy Interface",
//     desc: "Designed for comfort and clarity.",
//     icon: "✨",
//     img: "/images/interface.jpg",
//   },
// ];

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-white text-amber-900">
//       {/* <Header /> */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 mt-5">
//         <Heroo />

//         {/* Feature Cards */}
//         <section className="space-y-10">
//           <h3 className="text-3xl font-bold mb-6 text-center">
//             What Makes MingleHub Different
//           </h3>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {cards.map((c, i) => (
//               <FeatureCard key={i} {...c} />
//             ))}
//           </div>
//         </section>

//         {/* Spotlight */}
//         <Spotlight img="/images/main.jpg" />
//         <BlogPage/>

//         {/* Call-to-Action */}
//         <CTA />
//       </main>
//       {/* <Footer /> */}
//     </div>
//   );
// }

