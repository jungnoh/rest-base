import 'react-app-polyfill/ie11';
import "core-js/stable/array";
import "core-js/stable/function";
import "core-js/stable/object";
import "core-js/stable/number";
import "core-js/stable/date";
import "core-js/stable/string";
import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import 'react-quill/dist/quill.snow.css';
import 'normalize.css';

class MyApp extends App {
  render() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {Component, pageProps} = this.props as any;
    return <>
      <Head>
        <title>{'title'}</title>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=GA_TAG`}></script>
        <script dangerouslySetInnerHTML={{__html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'GA_TAG');`}} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={'og:url'} />
        <meta property="og:title" content={'og:title'} />  
        <meta property="og:description" content={'og:description'} />
        <meta property="og:image" content={'og:image'} />
        <meta name="subject" content={'subject'} />
        <meta name="description" content={'desc'} />
        <meta name="tags" content={'tags'} />
        <link rel="shortcut icon" href={'favicon'} />
        <link rel="icon" href={'favicon'} />
      </Head>
      <Component {...pageProps} /> 
    </>;
  }
}

MyApp.getInitialProps = async (appContext) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appProps = await App.getInitialProps(appContext as any);
  return {...appProps};
}

export default MyApp;