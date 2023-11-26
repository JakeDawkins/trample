import {
  type CountriesListQuery,
} from '../__generated__/graphql';

// { __typename?: 'Country', code: string }
export const mockCountryList: Pick<CountriesListQuery, 'countries'> = {
  countries: [
    { __typename: 'Country', code: 'HI'},
  ],
};
