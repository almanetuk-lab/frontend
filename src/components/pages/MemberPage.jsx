// MemberPage.jsx
import React, { useState } from 'react';

const MemberPage = () => {
  const [members] = useState([
    {
      id: 1,
      name: "Krish Ghosh",
      age: 29,
      gender: "Man",
      location: "Lakhimpur, India",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      profileUrl: "https://wpmatrimony.wpdating.com/profile/KrishGhosh",
      profession: "Software Engineer",
      education: "BTech Computer Science"
    },
    {
      id: 2,
      name: "Pihu Malik",
      age: 26,
      gender: "Woman",
      location: "Delhi, India",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      profileUrl: "#",
      profession: "Marketing Manager",
      education: "MBA"
    },
    {
      id: 3,
      name: "Rahul Sharma",
      age: 31,
      gender: "Man",
      location: "Mumbai, India",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      profileUrl: "#",
      profession: "Business Analyst",
      education: "MTech"
    },
    {
      id: 4,
      name: "Priya Singh",
      age: 27,
      gender: "Woman",
      location: "Bangalore, India",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      profileUrl: "#",
      profession: "Doctor",
      education: "MBBS, MD"
    },
    {
      id: 5,
      name: "Amit Patel",
      age: 32,
      gender: "Man",
      location: "Ahmedabad, India",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      profileUrl: "#",
      profession: "Architect",
      education: "BArch"
    },
    {
      id: 6,
      name: "Neha Gupta",
      age: 28,
      gender: "Woman",
      location: "Kolkata, India",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
      profileUrl: "#",
      profession: "Fashion Designer",
      education: "BDes"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('All');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.profession.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = selectedGender === 'All' || member.gender === selectedGender;
    
    return matchesSearch && matchesGender;
  });

  return (
    <div className="min-h-screen bg-gray-50">
   

      {/* Search Section */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search Members by name, location or profession..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="w-full md:w-48">
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    <option value="All">All Genders</option>
                    <option value="Man">Men</option>
                    <option value="Woman">Women</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-center text-gray-600">
                Showing {filteredMembers.length} of {members.length} members
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="container mx-auto px-4 py-12">
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map(member => (
              <div
                key={member.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
              >
                {/* Member Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-pink-600 bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center">
                    <a
                      href={member.profileUrl}
                      className="bg-white text-pink-600 px-6 py-3 rounded-full font-semibold transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50 hover:scale-105"
                    >
                      View Full Profile
                    </a>
                  </div>

                  {/* Age Badge */}
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                    {member.age} years
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                    {member.name}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {member.location}
                    </p>
                    
                    <p className="text-gray-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {member.profession}
                    </p>
                    
                    <p className="text-gray-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
                      </svg>
                      {member.education}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl">
                      Connect
                    </button>
                    <button className="flex-1 border-2 border-pink-600 text-pink-600 py-3 rounded-xl font-semibold hover:bg-pink-600 hover:text-white transform hover:-translate-y-1 transition-all duration-200">
                      Shortlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No members found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Footer
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 WP Matrimony. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Find your perfect match with us</p>
        </div>
      </footer> */}
    </div>
  );
};

export default MemberPage;