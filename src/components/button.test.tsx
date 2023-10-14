import { render, screen } from '../utils/test-utils';
import Button from './Button';

describe('Button', () => {
  it('renders the correct text', () => {
    render(<Button>Test Button</Button>);
    const buttonElement = screen.getByText(/Test Button/i);
    expect(buttonElement).toBeInTheDocument();
  });
});