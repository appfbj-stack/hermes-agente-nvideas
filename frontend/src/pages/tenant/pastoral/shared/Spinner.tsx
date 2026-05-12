import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-600 border-t-teal-500 rounded-full animate-spin-fast"></div>
    </div>
  );
};

export default Spinner;