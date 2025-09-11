import { useStore } from '@nanostores/react'
import { counterStore } from '@/store/index.ts'

function TestComponent() {
  const count = useStore(counterStore)

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
      <h2 className="text-xl font-bold mb-4 text-foreground">Test Component React</h2>
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
