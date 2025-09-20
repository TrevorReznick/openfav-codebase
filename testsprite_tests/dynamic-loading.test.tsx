import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import DynamicWrapper from '@/react/wrappers/dynamicWrapper'

// NOTE: These are integration-style unit tests that exercise the dynamic loader
// (getDynamicComponent via DynamicWrapper) inside Vitest + Vite environment.
// They validate that Vite's import.meta.glob registry can discover components
// under /src/react/components and that Suspense/Error states work as expected.

describe('Dynamic component loading via DynamicWrapper', () => {
  it('loads and renders the Home component (directory index) when using bare name', async () => {
    render(<DynamicWrapper componentPath="home" debug={false} />)

    // Then the Home dashboard content should render
    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Vendite totali/i)).toBeInTheDocument()
  })

  it('loads and renders the TestTracker component with explicit base + PascalCase', async () => {
    render(<DynamicWrapper componentPath="dashboard/TestTracker" debug={false} />)

    // Component content
    expect(await screen.findByText(/Test Tracker/i)).toBeInTheDocument()
    expect(screen.getByText(/Write tests/i)).toBeInTheDocument()
  })

  it('shows error UI when the component does not exist', async () => {
    render(<DynamicWrapper componentPath="examples/DefinitelyMissingComponent" debug={false} />)

    // Error UI from DynamicWrapper
    await waitFor(async () => {
      expect(await screen.findByText(/Error loading component/i)).toBeInTheDocument()
    })
  })

  it('loads and renders the NewComponent under test/ (kebab filename in UI text)', async () => {
    render(
      <DynamicWrapper
        componentPath="test/NewComponent"
        debug={false}
        props={{ title: 'New Component', description: 'This component was created for dynamic loading tests.' }}
      />
    )
    // Assert the specific text from src/react/components/test/NewComponent.tsx
    expect(await screen.findByText(/New Component/i)).toBeInTheDocument()
    expect(screen.getByText(/This component was created for dynamic loading tests\./i)).toBeInTheDocument()
  })
})
