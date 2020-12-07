import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../gral/icons';

// ================================================
// Component
// ================================================
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}

// ================================================
// Public
// ================================================
export default MyApp;
