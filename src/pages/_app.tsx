import type { AppProps } from "next/app";
import { AuthProvider } from "@/hooks/AuthProvider";
import "../styles/globals.css"; // Adjust path as needed
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
}

export default MyApp;
