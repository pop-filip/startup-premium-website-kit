import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// ============================================================
// EXAMPLE COMPONENT TESTS
// Place in: src/__tests__/components/Button.test.tsx
// ============================================================

// --- Example Button component (replace with your actual component) ---
function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      data-variant={variant}
      style={{ minHeight: '44px', minWidth: '44px' }}
    >
      {loading ? 'Učitavanje...' : children}
    </button>
  );
}
// --- End example component ---


describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click</Button>);
    
    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    
    expect(screen.getByText('Učitavanje...')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('has correct variant attribute', () => {
    render(<Button variant="danger">Delete</Button>);
    
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'danger');
  });

  it('meets minimum touch target size (44x44px)', () => {
    render(<Button>Tap</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveStyle({ minHeight: '44px', minWidth: '44px' });
  });
});


// ============================================================
// EXAMPLE: Testing a form component
// ============================================================

function ContactForm({ onSubmit }: { onSubmit: (data: { name: string; email: string }) => void }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Ime je obavezno'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Email nije validan'); return; }
    setError('');
    onSubmit({ name, email });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Contact form">
      <label htmlFor="name">Ime</label>
      <input id="name" value={name} onChange={(e) => setName(e.target.value)} />

      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      {error && <p role="alert">{error}</p>}

      <button type="submit">Pošalji</button>
    </form>
  );
}

describe('ContactForm', () => {
  it('renders all fields', () => {
    render(<ContactForm onSubmit={vi.fn()} />);
    
    expect(screen.getByLabelText('Ime')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pošalji' })).toBeInTheDocument();
  });

  it('shows error for empty name', async () => {
    render(<ContactForm onSubmit={vi.fn()} />);
    
    await userEvent.click(screen.getByRole('button', { name: 'Pošalji' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Ime je obavezno');
  });

  it('shows error for invalid email', async () => {
    render(<ContactForm onSubmit={vi.fn()} />);
    
    await userEvent.type(screen.getByLabelText('Ime'), 'Marko');
    await userEvent.type(screen.getByLabelText('Email'), 'not-valid');
    await userEvent.click(screen.getByRole('button', { name: 'Pošalji' }));
    
    expect(screen.getByRole('alert')).toHaveTextContent('Email nije validan');
  });

  it('submits valid form data', async () => {
    const handleSubmit = vi.fn();
    render(<ContactForm onSubmit={handleSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Ime'), 'Marko');
    await userEvent.type(screen.getByLabelText('Email'), 'marko@test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Pošalji' }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Marko',
      email: 'marko@test.com',
    });
  });

  it('clears error after valid submission', async () => {
    render(<ContactForm onSubmit={vi.fn()} />);
    
    // First submit with error
    await userEvent.click(screen.getByRole('button', { name: 'Pošalji' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Fix and resubmit
    await userEvent.type(screen.getByLabelText('Ime'), 'Marko');
    await userEvent.type(screen.getByLabelText('Email'), 'marko@test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Pošalji' }));
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
