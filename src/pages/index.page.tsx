import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { type CountriesListQuery } from '../__generated__/graphql';

export const COUNTRIES_LIST_QUERY = gql`
  query CountriesList {
    countries {
      code
    }
  }
`;

function Home() {
  const { loading, data, error } =
    useQuery<CountriesListQuery>(COUNTRIES_LIST_QUERY);
  const countries = data?.countries;

  return (
    <>
      <h1 className="text-4xl font-bold">Next.js TS Apollo Template</h1>
      <p className="mt-8">
        This app is a template setup to quickly stand up a new app
      </p>
      <p className="mt-8">
        This component fetches data as an example of querying using Apollo,
        generating types, and running tests with mocked data:
      </p>
      <p className="mt-8">
        {loading
          ? 'Loading'
          : error != null || countries == null
          ? 'Error loading data'
          : `Loaded ${countries.length} countries`}
      </p>
    </>
  );
}

export default Home;
