import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as nanostoresReact from '@nanostores/react';
import { testUsername, theme } from '@/store';
import Welcome from '../welcome';

// Mock the nanostores
vi.mock('@/store', () => ({
  testUsername: {
    get: vi.fn(),
    set: vi.fn(),
    subscribe: vi.fn(),
    listen: vi.fn(() => () => {})
  },
  theme: {
    get: vi.fn(),
    set: vi.fn(),
    subscribe: vi.fn(),
    listen: vi.fn(() => () => {})
  }
}));

// Mock the useStore hook
vi.mock('@nanostores/react', () => ({
  useStore: vi.fn()
}));

describe('Welcome Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock the store values
    vi.mocked(testUsername.get).mockReturnValue('Test User');
    vi.mocked(theme.get).mockReturnValue('light');
    
    // Set up the default mock implementation for useStore
    vi.mocked(nanostoresReact.useStore).mockImplementation((store: any) => {
      if (store === testUsername) return 'Test User';
      if (store === theme) return 'light';
      return null;
    });
  });

  it('renders welcome message with username', () => {
    render(<Welcome />);
    // The text is split across multiple elements, so we need to check for the container
    const welcomeMessage = screen.getByText(/Ciao/).closest('p');
    expect(welcomeMessage).toHaveTextContent('Ciao Test User');
  });

  it('toggles theme when theme button is clicked', () => {
    render(<Welcome />);
    
    // Find and click the theme toggle button
    const themeButton = screen.getByRole('button', { name: /light|dark/i });
    fireEvent.click(themeButton);
    
    // Verify theme.set was called with 'dark'
    expect(theme.set).toHaveBeenCalledWith('dark');
    
    // Simulate theme change
    vi.mocked(nanostoresReact.useStore).mockImplementation((store: any) => {
      if (store === theme) return 'dark';
      if (store === testUsername) return 'Test User';
      return null;
    });
    
    // Re-render with new theme
    render(<Welcome />);
    
    // Now the button should show 'light' since we're in dark mode
    expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument();
  });

  it('displays correct icon based on theme', () => {
    // Test light theme
    const { rerender } = render(<Welcome />);
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    
    // Change to dark theme
    vi.mocked(nanostoresReact.useStore).mockImplementation((store: any) => {
      if (store === theme) return 'dark';
      if (store === testUsername) return 'Test User';
      return null;
    });
    
    // Re-render with new theme
    rerender(<Welcome />);
    
    // Should show sun icon in dark mode
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });
});
