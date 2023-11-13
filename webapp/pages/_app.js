import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/config/theme";
import createEmotionCache from "../src/config/createEmotionCache";
import { StoreContext } from "../src/hooks/storeContext";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "../src/hooks/storeProvider";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [state, dispatch] = StoreProvider();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Laboratorio Remoto</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SessionProvider session={pageProps.session}>
          <StoreContext.Provider value={[state, dispatch]}>
            <Component {...pageProps} />
          </StoreContext.Provider>
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
