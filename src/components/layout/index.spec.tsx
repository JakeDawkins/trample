import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '.';

jest.mock('next/router', () => require('next-router-mock'));

describe('Layout', () => {
  it('renders content and nav', () => {
    render(
      <Layout>
        <p>Main Content</p>
      </Layout>,
    );

    expect(screen.getByText('Main Content')).toBeVisible();
  });
});
