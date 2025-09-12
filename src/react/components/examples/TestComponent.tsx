import { useStore } from '@nanostores/react'
import { counterStore } from '@/store/index.ts'

const componentPath = '/src/react/components/examples/TestComponent.tsx';

function TestComponent() {
  const count = useStore(counterStore);
  
  // Get the current URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
      <h2 className="text-xl font-bold mb-4 text-foreground">Test Component React</h2>
      <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono overflow-x-auto">
        <div>Component path: {componentPath}</div>
        <div>Current URL: {currentUrl}</div>
      </div>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Contatore: {count}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => counterStore.set(count + 1)}
          className="btn-primary"
        >
          Incrementa
        </button>
        <button
          onClick={() => counterStore.set(0)}
          className="btn-secondary"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default TestComponent
