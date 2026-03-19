import React from "react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8" role="status">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="mt-3 text-sm text-gray-500">{message}</p>
    </div>
  );
}
