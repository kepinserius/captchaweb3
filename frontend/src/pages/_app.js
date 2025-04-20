import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Web3 CAPTCHA - Bukti Kemanusiaan Terdesentralisasi</title>
        <meta
          name="description"
          content="Sistem CAPTCHA berbasis blockchain yang membuktikan seseorang adalah manusia tanpa menggunakan layanan terpusat"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
