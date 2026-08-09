import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio hero content', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /front-end developer/i })
  ).toBeInTheDocument();
});
