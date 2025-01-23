import React from "react";

const GroupLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="py-4">{children}</div>
      </div>
    </div>
  );
};

export default GroupLayout; 