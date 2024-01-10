import React from 'react';
import Head from 'next/head'

import '../../globals.css';
import { Layout } from '../components';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Trample</title>
        <meta name="title" content="Trample" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="description" content="A daily word game for you and your friends! No logins, no sign-ups, no ads. How may words can you make?" />

        {/* OG/facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://playtrample.com/" />
        <meta property="og:title" content="Trample" />
        <meta property="og:description" content="A daily word game for you and your friends! No logins, no sign-ups, no ads. How may words can you make?" />
        {/* <meta property="og:image" content="https://playtrample.com/images/meta-tags.png" /> */}
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://playtrample.com/" />
        <meta property="twitter:title" content="Trample" />
        <meta property="twitter:description" content="A daily word game for you and your friends! No logins, no sign-ups, no ads. How may words can you make?" />
        {/* <meta property="twitter:image" content="https://playtrample.com/images/meta-tags.png" /> */}

      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
