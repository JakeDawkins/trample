import React from 'react';
import Head from 'next/head'

import '../../globals.css';
import { Layout } from '../components';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
      <title>Trample</title>
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </>
  );
}
