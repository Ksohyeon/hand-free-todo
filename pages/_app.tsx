import "@/styles/globals.css";
import Footer from "@/src/component/Footer";
import Header from "@/src/component/Header";
import type { AppProps } from "next/app";
import { ReduxProviders } from "../src/redux/reduxProvider";
import ThemeWrapper from "./ThemeWrapper";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ReduxProviders>
        <ThemeWrapper>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </ThemeWrapper>
      </ReduxProviders>
    </>
  );
}
