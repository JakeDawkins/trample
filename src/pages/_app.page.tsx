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
        <link rel="shortcut icon" href="/static/favicon.ico" />

        <meta name="description" content="How many words can you make before you get trampled? A daily word game. No logins, no sign-ups, no ads. A new word and a new chance every day!" />

        {/* OG/facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://playtrample.com/" />
        <meta property="og:title" content="Trample" />
        <meta property="og:description" content="How many words can you make before you get trampled? A daily word game. No logins, no sign-ups, no ads. A new word and a new chance every day!" />
        <meta property="og:image" content="https://playtrample.com/trample-og-2.png" />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://playtrample.com/" />
        <meta property="twitter:title" content="Trample" />
        <meta property="twitter:description" content="How many words can you make before you get trampled? A daily word game. No logins, no sign-ups, no ads. A new word and a new chance every day!" />
        <meta property="twitter:image" content="https://playtrample.com/trample-twitter-2.png" />

      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
