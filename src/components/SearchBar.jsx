import React from "react";

export default function SearchBar({ query, setQuery }) {
  return (
    <input
      type="text"
      aria-label="Search"
      placeholder="Search by item name..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full p-3 mb-6 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  );
}
