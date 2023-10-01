import * as React from 'react'
import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react';

import Game from './Game';

test('renders react component', () => {
  render(<Game />);
  const el = screen.getByLabelText(/beginner/i);
  expect(el).toBeInTheDocument();
});