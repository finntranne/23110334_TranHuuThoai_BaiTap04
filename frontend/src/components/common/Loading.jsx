import React from 'react';

/**
 * Loading component
 */
const Loading = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const spinner = (
    <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-8">
      {spinner}
    </div>
  );
};

export default Loading;
