import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

export default function Docs() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [activeTab, setActiveTab] = useState("penggunaan");

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
        <title>Dokumentasi - Web3 CAPTCHA</title>
        <meta
          name="description"
          content="Dokumentasi teknis dan panduan penggunaan untuk Web3 CAPTCHA"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        isConnected={isConnected}
        account={account}
        connectWallet={connectWallet}
      />

      <main className="flex-grow flex flex-col items-center p-4">
        <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-6 md:p-8 my-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Dokumentasi Web3 CAPTCHA
          </h1>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex flex-wrap -mb-px">
              <button
                className={`inline-block p-4 rounded-t-lg border-b-2 mr-2 ${
                  activeTab === "penggunaan"
                    ? "text-blue-600 border-blue-600"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("penggunaan")}
              >
                Panduan Penggunaan
              </button>
              <button
                className={`inline-block p-4 rounded-t-lg border-b-2 mr-2 ${
                  activeTab === "developers"
                    ? "text-blue-600 border-blue-600"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("developers")}
              >
                Untuk Developers
              </button>
              <button
                className={`inline-block p-4 rounded-t-lg border-b-2 mr-2 ${
                  activeTab === "api"
                    ? "text-blue-600 border-blue-600"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("api")}
              >
                API Referensi
              </button>
              <button
                className={`inline-block p-4 rounded-t-lg border-b-2 ${
                  activeTab === "faq"
                    ? "text-blue-600 border-blue-600"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("faq")}
              >
                FAQ
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="prose lg:prose-lg max-w-none">
            {/* Panduan Penggunaan */}
            {activeTab === "penggunaan" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Panduan Penggunaan
                </h2>
                <p className="text-gray-700 mb-6">
                  Berikut adalah langkah-langkah untuk menggunakan Web3 CAPTCHA
                  dalam memverifikasi kemanusiaan Anda:
                </p>

                <div className="space-y-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">
                      1. Persiapan Wallet
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Sebelum mulai, pastikan Anda memiliki wallet Ethereum
                      (seperti MetaMask) yang terpasang di browser Anda dan
                      memiliki sedikit ETH untuk biaya transaksi.
                    </p>
                    <ul className="list-disc pl-6 text-gray-700">
                      <li>
                        Instal ekstensi MetaMask (atau wallet Ethereum lainnya)
                      </li>
                      <li>Buat atau impor akun Ethereum</li>
                      <li>
                        Pastikan wallet Anda terhubung ke jaringan yang sesuai
                        (Ropsten/Rinkeby testnet)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">
                      2. Hubungkan Wallet
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Klik tombol "Hubungkan Wallet" di halaman utama aplikasi
                      dan berikan izin saat diminta oleh wallet Anda.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">
                      3. Minta CAPTCHA Puzzle
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Setelah wallet terhubung, Anda akan melihat widget
                      CAPTCHA. Klik "Muat CAPTCHA" untuk mendapatkan puzzle acak
                      dari blockchain.
                    </p>
                    <ul className="list-disc pl-6 text-gray-700">
                      <li>
                        Anda mungkin akan diminta untuk mengonfirmasi transaksi
                        (meskipun ini biasanya gratis)
                      </li>
                      <li>
                        Puzzle akan dimuat di layar - bisa berupa gambar,
                        matematika, atau teks
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">
                      4. Selesaikan Puzzle
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Selesaikan puzzle yang ditampilkan dan masukkan solusi
                      Anda di kotak yang tersedia.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">
                      5. Kirim Bukti
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Klik tombol "Verifikasi" untuk mengirimkan bukti Anda. Di
                      belakang layar:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700">
                      <li>
                        Aplikasi akan menghasilkan bukti zero-knowledge dari
                        solusi Anda
                      </li>
                      <li>
                        Bukti ini menunjukkan bahwa Anda mengetahui solusi tanpa
                        mengungkapkannya
                      </li>
                      <li>
                        Wallet Anda akan meminta konfirmasi untuk transaksi
                        pengiriman bukti
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">
                      6. Dapatkan Verifikasi & Reward
                    </h3>
                    <p className="text-gray-700 mb-2">Jika bukti Anda valid:</p>
                    <ul className="list-disc pl-6 text-gray-700">
                      <li>
                        Wallet Anda akan ditandai sebagai "Terverifikasi
                        Manusia" di blockchain
                      </li>
                      <li>Anda akan menerima reward token sebagai insentif</li>
                      <li>
                        Status ini bisa digunakan untuk mengakses layanan yang
                        memerlukan verifikasi manusia
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Untuk Developers */}
            {activeTab === "developers" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Untuk Developers
                </h2>
                <p className="text-gray-700 mb-6">
                  Cara mengintegrasikan Web3 CAPTCHA ke dalam aplikasi
                  terdesentralisasi (dApp) Anda:
                </p>

                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    Integrasi Smart Contract
                  </h3>
                  <p className="text-gray-700">
                    Untuk mengintegrasikan Web3 CAPTCHA ke dalam dApp Anda, Anda
                    perlu berinteraksi dengan smart contract kami:
                  </p>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mt-2">
                    {`// Contoh penggunaan dengan ethers.js
const { ethers } = require("ethers");

// Alamat kontrak (ganti dengan alamat aktual)
const contractAddress = "0x...";

// ABI dari kontrak DecentralizedCaptcha
const abi = [...]; // Import dari artifacts

async function checkIfHuman(userAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  
  // Cek apakah alamat terverifikasi sebagai manusia
  const isHuman = await contract.isHuman(userAddress);
  return isHuman;
}`}
                  </pre>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    Integrasi Frontend
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Anda juga dapat menyematkan komponen Web3 CAPTCHA ke dalam
                    aplikasi web Anda:
                  </p>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mt-2">
                    {`// React component integration
import { Web3CaptchaWidget } from 'web3-captcha';

function MyProtectedComponent() {
  const [isVerifiedHuman, setIsVerifiedHuman] = useState(false);
  
  // Callback untuk saat verifikasi berhasil
  const handleVerificationSuccess = () => {
    setIsVerifiedHuman(true);
  };
  
  return (
    <div>
      {!isVerifiedHuman ? (
        <Web3CaptchaWidget 
          onVerificationSuccess={handleVerificationSuccess}
          theme="light"
        />
      ) : (
        <div>
          {/* Konten yang dilindungi untuk manusia terverifikasi */}
          <h2>Selamat Datang, Manusia!</h2>
          <p>Anda sekarang bisa mengakses konten ini.</p>
        </div>
      )}
    </div>
  );
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    Konfigurasi dan Parameter
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Beberapa opsi konfigurasi yang tersedia:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>
                      <code className="bg-gray-100 px-1">network</code>:
                      Jaringan Ethereum (mainnet, ropsten, etc.)
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1">puzzleType</code>:
                      Jenis puzzle yang diinginkan
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1">theme</code>: Tema UI
                      ('light', 'dark')
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1">customProvider</code>:
                      Provider ethers.js kustom
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* API Referensi */}
            {activeTab === "api" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  API Referensi
                </h2>

                <div className="mb-8">
                  <h3 className="text-xl font-medium text-gray-800 mb-3">
                    Smart Contract: DecentralizedCaptcha
                  </h3>
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      getCaptchaPuzzle()
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Mendapatkan puzzle CAPTCHA acak dari blockchain.
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Returns:</strong>
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 text-sm">
                      <li>
                        <code>bytes32 puzzleId</code>: ID unik dari puzzle
                      </li>
                      <li>
                        <code>uint8 puzzleType</code>: Jenis puzzle (0: Image,
                        1: Math, 2: Text, 3: Audio)
                      </li>
                      <li>
                        <code>bytes data</code>: Data puzzle (tergantung tipe)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      checkSolution(bytes32 _puzzleId, string memory _solution)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Memeriksa apakah solusi benar (view function, tidak
                      menulis ke blockchain).
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Parameters:</strong>
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 text-sm mb-2">
                      <li>
                        <code>_puzzleId</code>: ID puzzle yang diperiksa
                      </li>
                      <li>
                        <code>_solution</code>: Solusi yang diusulkan
                      </li>
                    </ul>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Returns:</strong>
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 text-sm">
                      <li>
                        <code>bool isValid</code>: True jika solusi benar
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      generateZkProof(bytes32 _puzzleId, string memory
                      _solution)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Menghasilkan bukti zero-knowledge (fungsi off-chain).
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Parameters:</strong>
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 text-sm mb-2">
                      <li>
                        <code>_puzzleId</code>: ID puzzle yang diselesaikan
                      </li>
                      <li>
                        <code>_solution</code>: Solusi untuk puzzle
                      </li>
                    </ul>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Returns:</strong>
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 text-sm">
                      <li>
                        <code>bytes proof</code>: Bukti ZK-SNARK
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      submitProof(bytes memory _proof)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Mengirimkan bukti ZK untuk verifikasi dan mendapatkan
                      reward.
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Parameters:</strong>
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 text-sm">
                      <li>
                        <code>_proof</code>: Bukti ZK yang dihasilkan
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-3">
                    JavaScript SDK
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Web3 CAPTCHA juga menyediakan SDK JavaScript untuk
                    memudahkan integrasi:
                  </p>

                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      createCaptchaInstance(options)
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Membuat instance baru dari Web3 CAPTCHA yang terhubung ke
                      blockchain.
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Options:</strong>
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 text-sm">
                      <li>
                        <code>provider</code>: Web3 provider
                      </li>
                      <li>
                        <code>contractAddress</code>: Alamat kontrak
                      </li>
                      <li>
                        <code>network</code>: ID jaringan Ethereum
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Metode Instance
                    </h4>
                    <ul className="list-disc pl-6 text-gray-600 text-sm">
                      <li>
                        <code>getPuzzle()</code>: Mendapatkan puzzle CAPTCHA
                      </li>
                      <li>
                        <code>verifySolution(puzzleId, solution)</code>: Cek
                        solusi
                      </li>
                      <li>
                        <code>generateAndSubmitProof(puzzleId, solution)</code>:
                        Generate dan submit bukti
                      </li>
                      <li>
                        <code>checkHumanStatus(address)</code>: Cek status
                        kemanusiaan alamat
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ */}
            {activeTab === "faq" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Pertanyaan Umum (FAQ)
                </h2>

                <div className="space-y-6">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Apa itu zk-SNARKs dan bagaimana kaitannya dengan Web3
                      CAPTCHA?
                    </h3>
                    <p className="text-gray-700">
                      zk-SNARKs (Zero-Knowledge Succinct Non-Interactive
                      Arguments of Knowledge) adalah metode kriptografi yang
                      memungkinkan seseorang membuktikan bahwa mereka memiliki
                      informasi tertentu tanpa mengungkapkan informasi itu
                      sendiri. Dalam Web3 CAPTCHA, zk-SNARKs memungkinkan
                      pengguna membuktikan bahwa mereka telah menyelesaikan
                      puzzle dengan benar tanpa mengungkapkan solusi sebenarnya
                      ke blockchain.
                    </p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Apakah saya perlu ETH untuk menggunakan Web3 CAPTCHA?
                    </h3>
                    <p className="text-gray-700">
                      Ya, Anda memerlukan sedikit ETH untuk membayar biaya gas
                      transaksi saat berinteraksi dengan blockchain. Namun,
                      jumlahnya relatif kecil, dan jika jaringan tidak terlalu
                      sibuk, biaya gas bisa sangat rendah. Selain itu, Anda akan
                      mendapatkan reward token setelah verifikasi yang dapat
                      menutupi sebagian biaya ini.
                    </p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Berapa lama status verifikasi kemanusiaan saya berlaku?
                    </h3>
                    <p className="text-gray-700">
                      Status verifikasi kemanusiaan berlaku selama periode
                      tertentu (biasanya 30 hari) dan kemudian Anda perlu
                      memverifikasi ulang. Hal ini membantu memastikan bahwa
                      verifikasi tetap valid dan akurat dari waktu ke waktu.
                    </p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Bagaimana Web3 CAPTCHA mencegah bot dan serangan otomatis?
                    </h3>
                    <p className="text-gray-700">
                      Web3 CAPTCHA menggunakan kombinasi dari puzzle yang
                      dirancang untuk manusia, verifikasi blockchain, dan
                      periode cooldown untuk mencegah serangan bot. Puzzle
                      dibuat lebih sulit untuk diselesaikan oleh bot daripada
                      manusia, dan sistem blockchain memungkinkan pelacakan dan
                      pembatasan yang lebih baik daripada sistem terpusat.
                    </p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Apa perbedaan Web3 CAPTCHA dengan reCAPTCHA atau hCaptcha?
                    </h3>
                    <p className="text-gray-700">
                      Perbedaan utama adalah desentralisasi dan privasi.
                      reCAPTCHA dan hCaptcha menggunakan server terpusat yang
                      dikontrol oleh satu perusahaan. Web3 CAPTCHA sepenuhnya
                      terdesentralisasi di blockchain, tanpa otoritas tunggal,
                      dan menggunakan zk-SNARKs untuk melindungi data pengguna.
                      Selain itu, Web3 CAPTCHA memberikan reward kepada
                      pengguna, menciptakan insentif ekonomi untuk
                      berpartisipasi.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
