import React from 'react';

import '../../globals.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Layout } from '../components';

const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com/',
  cache: new InMemoryCache(),
});

// eslint-disable-next-line react/prop-types
export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}
