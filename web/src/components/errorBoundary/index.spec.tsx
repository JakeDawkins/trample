import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '.';

describe('ErrorBoundary', () => {
  it.skip('catches errors in children', () => {
    const ErroringComponent = () => {
      throw new Error('manually thrown');
    };

    render(
      <ErrorBoundary>
        <ErroringComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Go Home')).toBeVisible();
  });
});
