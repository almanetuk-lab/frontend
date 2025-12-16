import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ a }) {
  const id = a.id || a._id;
  return (
    <Link to={`/article/${id}`} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition block">
      {a.cover_image && <img src={a.cover_image} alt={a.title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h2 className="text-lg font-semibold">{a.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{a.subtitle}</p>
        <div className="mt-3 text-xs text-gray-400">{new Date(a.created_at || a.createdAt).toLocaleDateString()}</div>
      </div>
    </Link>
  );
}
