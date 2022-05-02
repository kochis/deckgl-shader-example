import Head from 'next/head';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="App">
      <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" crossOigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp
