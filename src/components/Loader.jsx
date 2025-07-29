import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>Analyzing...</span>
    </div>
  );
}
