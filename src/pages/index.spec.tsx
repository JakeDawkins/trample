import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import HomePage, { COUNTRIES_LIST_QUERY } from './index.page';
import { mockCountryList } from '../utils/mockData';

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

  it('renders with data after loading', async () => {
    const mocks = [
      {
        request: {
          query: COUNTRIES_LIST_QUERY,
        },
        result: {
          data: {
            countries: mockCountryList.countries,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
    );

    expect(screen.getByText('Loading')).toBeVisible();
    expect(await screen.findByText(`Loaded 1 countries`)).toBeVisible();
  });

  it('renders network error message', async () => {
    const mocks = [
      {
        request: {
          query: COUNTRIES_LIST_QUERY,
        },
        error: new Error('a fake network error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
    );

    expect(screen.getByText('Loading')).toBeVisible();
    expect(await screen.findByText('Error loading data')).toBeVisible();
  });

  it('renders graphql error message', async () => {
    const mocks = [
      {
        request: {
          query: COUNTRIES_LIST_QUERY,
        },
        result: {
          errors: [new GraphQLError('Error!')],
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
    );

    expect(screen.getByText('Loading')).toBeVisible();
    expect(await screen.findByText('Error loading data')).toBeVisible();
  });
});
