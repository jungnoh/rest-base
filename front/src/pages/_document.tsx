/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
// Import styled components ServerStyleSheet
import { ServerStyleSheet } from 'styled-components';

interface Props {
  styleTags: any;
}

export default class MyDocument extends Document<Props> {
  static getInitialProps({ renderPage }: any) {
    const sheet = new ServerStyleSheet();
    const page = renderPage((App: any) => (props: any) =>
      sheet.collectStyles(<App {...props} />),
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        <Head>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}