import type { AppProps } from "next/app";
import { ChakraProvider, Toast } from "@chakra-ui/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { extendTheme } from "@chakra-ui/react";

import { AuthProvider } from '../context/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Component {...pageProps} />
        <ToastContainer autoClose={1200} position="top-center" />
      </AuthProvider>
    </ChakraProvider>
  );
}
