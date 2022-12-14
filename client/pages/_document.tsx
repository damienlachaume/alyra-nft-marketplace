import { Head, Html, Main, NextScript } from 'next/document';

const MyDocument = () => {
  return (
    <Html>
      <Head>
        <title>
          Greenloop Trail Marketplace | Discover cities differently, explore
          cool places near you, support local economy
        </title>
        <link rel="icon" href="/images/greenloop-logo.png" />
      </Head>
      <body>
        <Main />
        <div id="__portal" />
        <NextScript />
      </body>
    </Html>
  );
};
export default MyDocument;
