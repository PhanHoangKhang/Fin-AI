import React from 'react';

export const NewsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-[#E8EDE0] p-5 overflow-hidden animate-pulse">
          {/* Top Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-3">
              <div className="h-5 w-20 bg-[#E8EDE0] rounded"></div>
              <div className="h-5 w-16 bg-[#F5F0E8] rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-5 w-12 bg-[#E8EDE0] rounded"></div>
              <div className="h-5 w-12 bg-[#E8EDE0] rounded"></div>
            </div>
          </div>

          {/* Title */}
          <div className="h-6 bg-[#E8EDE0] rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-[#E8EDE0] rounded w-1/2 mb-4"></div>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <div className="h-5 w-14 bg-[#F5F0E8] rounded-full"></div>
            <div className="h-5 w-16 bg-[#F5F0E8] rounded-full"></div>
            <div className="h-5 w-12 bg-[#F5F0E8] rounded-full"></div>
          </div>

          {/* AI Box */}
          <div className="bg-[#F5F8F0] rounded-xl p-4 mb-4">
            <div className="h-4 bg-[#E8EDE0] rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-[#E8EDE0] rounded w-full mb-2"></div>
            <div className="h-4 bg-[#E8EDE0] rounded w-5/6"></div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#E8EDE0]">
            <div className="h-4 w-24 bg-[#E8EDE0] rounded"></div>
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-[#E8EDE0] rounded"></div>
              <div className="h-4 w-24 bg-[#E8EDE0] rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsSkeleton;