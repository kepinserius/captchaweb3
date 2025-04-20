import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

export default function About() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Mohon instal MetaMask untuk menggunakan aplikasi ini!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Tentang - Web3 CAPTCHA</title>
        <meta
          name="description"
          content="Informasi tentang proyek Web3 CAPTCHA dan teknologi dibaliknya"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        isConnected={isConnected}
        account={account}
        connectWallet={connectWallet}
      />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 md:p-8 my-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Tentang Web3 CAPTCHA
          </h1>

          <div className="prose lg:prose-lg mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
              Apa itu Web3 CAPTCHA?
            </h2>
            <p className="text-gray-700 mb-4">
              Web3 CAPTCHA adalah sistem verifikasi kemanusiaan
              terdesentralisasi berbasis blockchain yang menggunakan teknologi
              zero-knowledge proof (ZK-SNARKs) untuk membuktikan bahwa seseorang
              adalah manusia tanpa perlu mengandalkan layanan terpusat seperti
              Google reCAPTCHA.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
              Mengapa Ini Penting?
            </h2>
            <p className="text-gray-700 mb-4">
              Solusi CAPTCHA tradisional mengandalkan server terpusat untuk
              validasi, mengumpulkan data pengguna, dan sering memunculkan
              masalah privasi. Web3 CAPTCHA mengatasi masalah ini dengan:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                Terdesentralisasi - tidak ada otoritas tunggal yang
                mengendalikan validasi
              </li>
              <li>
                Privasi - ZK-SNARKs memungkinkan verifikasi tanpa mengungkapkan
                data sebenarnya
              </li>
              <li>
                Insentif - pengguna mendapatkan reward saat berhasil membuktikan
                kemanusiaannya
              </li>
              <li>
                Web3-native - terintegrasi dengan blockchain untuk aplikasi
                terdesentralisasi
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
              Teknologi yang Digunakan
            </h2>
            <p className="text-gray-700 mb-4">
              Proyek ini dibangun menggunakan beberapa teknologi terkini:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                <strong>Smart Contracts:</strong> Solidity pada blockchain
                Ethereum
              </li>
              <li>
                <strong>Zero-Knowledge Proofs:</strong> Implementasi zk-SNARKs
              </li>
              <li>
                <strong>Frontend:</strong> React dengan Next.js dan TailwindCSS
              </li>
              <li>
                <strong>Web3 Integration:</strong> Ethers.js untuk interaksi
                dengan blockchain
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="text-gray-700 mb-4">Proses kerja Web3 CAPTCHA:</p>
            <ol className="list-decimal pl-6 mb-4 text-gray-700">
              <li>Pengguna meminta CAPTCHA puzzle dari blockchain</li>
              <li>
                Smart contract menghasilkan puzzle unik secara terdesentralisasi
              </li>
              <li>Pengguna menyelesaikan puzzle di browser mereka</li>
              <li>
                Bukti zero-knowledge dibuat untuk memverifikasi solusi tanpa
                mengungkapkannya
              </li>
              <li>
                Bukti dikirim ke blockchain untuk validasi dan mendapatkan
                status "terverifikasi sebagai manusia"
              </li>
              <li>
                Jika berhasil, pengguna menerima reward token sebagai insentif
              </li>
            </ol>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
