import React from 'react';
import Head from 'next/head'

import '../../globals.css';
import { Layout } from '../components';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </>
  );
}
