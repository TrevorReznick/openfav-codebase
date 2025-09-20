import React from 'react';

interface TestTrackerProps {
  title?: string;
  items?: Array<{ id: number | string; label: string; status?: 'open' | 'done' | 'in-progress' }>;
}

export default function TestTracker({
  title = 'Test Tracker',
  items = [
    { id: 1, label: 'Design wireframe', status: 'done' },
    { id: 2, label: 'Implement component', status: 'in-progress' },
    { id: 3, label: 'Write tests', status: 'open' },
  ],
}: TestTrackerProps) {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
            <span className="font-mono">{String(it.id)}</span>
            <span className="flex-1 px-3">{it.label}</span>
            <span
              className={
                it.status === 'done'
                  ? 'text-green-600'
                  : it.status === 'in-progress'
                  ? 'text-yellow-600'
                  : 'text-gray-500'
              }
            >
              {it.status ?? 'open'}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="font-mono">src/react/components/dashboard/TestTracker.tsx</div>
      </div>
    </div>
  );
}
