import FullScreenWrapper from "@/components/layouts/FullScreenWrapper";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <FullScreenWrapper>
        <Component {...pageProps} />
      </FullScreenWrapper>
      <Toaster />
    </QueryClientProvider>
  );
}
