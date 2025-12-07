import React from 'react';

const SayHello: React.FC = () => {
  return (
    <div className="p-6 bg-green-100 dark:bg-green-900 rounded-lg">
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
        Hello from React!
      </h2>
      <p className="text-green-700 dark:text-green-300">
        This is a simple React component loaded dynamically in Astro.
      </p>
    </div>
  );
};

export default SayHello;
