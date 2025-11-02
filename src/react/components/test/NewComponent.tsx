import React from 'react';

interface NewComponentProps {
  title?: string;
  description?: string;
}

export default function NewComponent({ title = 'New Component', description = 'This component was created for dynamic loading tests.' }: NewComponentProps) {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="font-mono">src/react/components/test/new-component.tsx</div>
      </div>
    </div>
  );
}
