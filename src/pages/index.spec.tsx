import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import HomePage from './index.page';

// if we needed to mock any useRouter usage
// import mockRouter from 'next-router-mock';
// jest.mock('next/router', () => require('next-router-mock'));

describe('HomePage', () => {
  // beforeEach(() => {
  //   mockRouter.setCurrentUrl('/');
  // });

  it('renders with loading indicator', () => {
    const mocks = [];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
    );

    expect(screen.getByText('Next.js TS Apollo Template')).toBeVisible();
    expect(screen.getByText('Loading')).toBeVisible();
  });
});
