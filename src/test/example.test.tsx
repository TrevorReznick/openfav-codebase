import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';

// Example test component
function TestComponent() {
  return (
    <div>
      <h1>Test Component</h1>
      <button>Click me</button>
    </div>
  );
}

describe('Example Test Suite', () => {
  it('renders the test component', () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: /test component/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});
