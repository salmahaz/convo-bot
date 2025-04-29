import React from 'react';

export const ChatSkeleton = () => {
  return (
    <div className="self-start bg-blue-100 text-gray-800 p-2 sm:p-3 rounded-lg shadow-md max-w-[85%] sm:max-w-[75%] text-xs sm:text-sm">
      <div className="animate-pulse">
        <div className="h-4 w-16 bg-gray-300 rounded mb-2"></div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-300 rounded"></div>
          <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}; 