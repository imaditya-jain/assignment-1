import "@/styles/globals.css";
import StoreProvider from "@/providers/store.provider";
import AuthInit from '@/providers/auth.init'
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <StoreProvider>
    <AuthInit />
    <Component {...pageProps} />
  </StoreProvider>
}
