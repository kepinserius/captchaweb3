import { useState, useEffect } from "react";
import Head from "next/head";
import CaptchaWidget from "../components/CaptchaWidget";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ethers } from "ethers";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // Set state
        setAccount(accounts[0]);
        setIsConnected(true);

        // Check if user is already verified
        checkVerificationStatus(accounts[0]);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Mohon instal MetaMask untuk menggunakan aplikasi ini!");
    }
  };

  // Check if user is verified
  const checkVerificationStatus = async (address) => {
    try {
      // Ini akan diimplementasikan nanti untuk memanggil kontrak
      // dan memeriksa apakah pengguna sudah terverifikasi

      // Mock implementation for now
      setIsVerified(false);
    } catch (error) {
      console.error("Error checking verification status:", error);
    }
  };

  // Effect to check wallet connection on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            checkVerificationStatus(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkVerificationStatus(accounts[0]);
        } else {
          setAccount("");
          setIsConnected(false);
          setIsVerified(false);
        }
      });
    }

    return () => {
      // Clean up event listener
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Web3 CAPTCHA - Bukti Kemanusiaan Terdesentralisasi</title>
        <meta
          name="description"
          content="Sistem CAPTCHA berbasis blockchain yang membuktikan seseorang adalah manusia tanpa menggunakan layanan terpusat"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        isConnected={isConnected}
        account={account}
        connectWallet={connectWallet}
      />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Web3 CAPTCHA Terdesentralisasi
          </h1>

          <p className="text-gray-700 text-center mb-8">
            Verifikasi bahwa Anda manusia melalui blockchain tanpa data pribadi,
            dan dapatkan reward untuk partisipasi Anda!
          </p>

          {!isConnected ? (
            <div className="text-center p-8">
              <p className="mb-4 text-lg">
                Silakan hubungkan wallet Anda untuk memulai
              </p>
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
              >
                Hubungkan Wallet
              </button>
            </div>
          ) : isVerified ? (
            <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="text-xl font-semibold text-green-600 mb-2">
                ✅ Anda Sudah Terverifikasi Sebagai Manusia!
              </h2>
              <p className="text-gray-700">
                Alamat wallet Anda telah terverifikasi di blockchain sebagai
                milik manusia.
              </p>
            </div>
          ) : (
            <CaptchaWidget
              account={account}
              onVerificationSuccess={() => setIsVerified(true)}
            />
          )}

          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-800 mb-2">
              Keunggulan Web3 CAPTCHA:
            </h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Verifikasi tanpa server terpusat</li>
              <li>Bukti zero-knowledge melindungi privasi Anda</li>
              <li>Dapatkan reward token untuk verifikasi</li>
              <li>Lindungi website dari bot dengan cara modern</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
