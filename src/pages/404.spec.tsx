import React from 'react';
import { render, screen } from '@testing-library/react';
import Page404 from './404.page';

import mockRouter from 'next-router-mock';
jest.mock('next/router', () => require('next-router-mock'));

describe('Page404', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/incorrect-url');
  });

  it('renders without error', () => {
    render(<Page404 />);
    expect(screen.getByText('Back to Home')).toBeVisible();
  });
});
