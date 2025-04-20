import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";

// Import ABI (akan dihasilkan setelah kompilasi kontrak)
// import DecentralizedCaptchaABI from '../artifacts/contracts/DecentralizedCaptcha.sol/DecentralizedCaptcha.json';
// import contractAddresses from '../utils/contractAddresses.json';

const CaptchaWidget = ({ account, onVerificationSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaData, setCaptchaData] = useState(null);
  const [solution, setSolution] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [puzzleType, setPuzzleType] = useState(0); // 0: IMAGE, 1: MATH, 2: TEXT, 3: AUDIO

  const puzzleTypes = ["Gambar", "Matematika", "Teks", "Audio"];

  // Fungsi untuk mendapatkan CAPTCHA dari blockchain
  const fetchCaptcha = async () => {
    setIsLoading(true);
    setError("");
    setSolution("");

    try {
      // Untuk saat ini, kita gunakan dummy CAPTCHA
      // Pada implementasi sesungguhnya, ini akan memanggil kontrak

      // Tampilkan dummy CAPTCHA berdasarkan jenis puzzle acak
      const randomType = Math.floor(Math.random() * 3); // 0-2 (tipe puzzle)
      setPuzzleType(randomType);

      // Contoh data CAPTCHA dummy berdasarkan tipe
      let dummyData;

      if (randomType === 0) {
        // IMAGE
        dummyData = {
          id: "0x" + Math.random().toString(16).substr(2, 40),
          data: "https://via.placeholder.com/300x100.png?text=CAPTCHA+Image",
          instruction: "Ketik teks yang ditampilkan pada gambar",
        };
      } else if (randomType === 1) {
        // MATH
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        dummyData = {
          id: "0x" + Math.random().toString(16).substr(2, 40),
          data: `${num1} + ${num2} = ?`,
          instruction: "Selesaikan perhitungan matematika",
        };
      } else {
        // TEXT
        dummyData = {
          id: "0x" + Math.random().toString(16).substr(2, 40),
          data: "Berapa hasil 3 pangkat 2 ditambah 5?",
          instruction: "Jawab pertanyaan",
        };
      }

      setCaptchaData(dummyData);
    } catch (err) {
      console.error("Error fetching CAPTCHA:", err);
      setError("Gagal mendapatkan CAPTCHA. Silakan coba lagi.");
    }

    setIsLoading(false);
  };

  // Fungsi untuk memverifikasi solusi CAPTCHA
  const verifySolution = async () => {
    if (!solution) {
      setError("Silakan masukkan solusi");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Pada implementasi sesungguhnya, ini akan memanggil smart contract
      // dan memverifikasi solusi, kemudian menghasilkan bukti ZK-SNARK

      // Contoh verifikasi sederhana untuk demo
      let isCorrect = false;

      if (puzzleType === 0) {
        // IMAGE
        // Untuk demo, anggap solusi benar jika panjangnya > 3
        isCorrect = solution.length > 3;
      } else if (puzzleType === 1) {
        // MATH
        // Untuk MATH, cek apakah jawaban benar
        const equation = captchaData.data.split(" = ?")[0];
        const correctAnswer = eval(equation).toString();
        isCorrect = solution === correctAnswer;
      } else {
        // TEXT
        // Untuk TEXT, cek spesifik jawaban
        isCorrect = solution === "14";
      }

      if (isCorrect) {
        // Buat bukti ZK-SNARK (pada implementasi sebenarnya)
        // dan kirim ke blockchain

        setSuccess(
          "Verifikasi berhasil! Anda adalah manusia. Mengirim bukti ke blockchain..."
        );

        // Dalam implementasi nyata, ini akan mengirim transaksi ke blockchain
        setTimeout(() => {
          // Kirim callback ke parent component
          onVerificationSuccess();
        }, 2000);
      } else {
        setError("Solusi salah. Silakan coba lagi.");
        // Reset captcha
        fetchCaptcha();
      }
    } catch (err) {
      console.error("Error verifying solution:", err);
      setError("Gagal memverifikasi solusi. Silakan coba lagi.");
    }

    setIsLoading(false);
  };

  // Memuat CAPTCHA saat komponen dimuat
  useEffect(() => {
    if (account) {
      fetchCaptcha();
    }
  }, [account]);

  // Mendapatkan konten CAPTCHA berdasarkan jenis
  const renderCaptchaContent = () => {
    if (!captchaData) return null;

    switch (puzzleType) {
      case 0: // IMAGE
        return (
          <div className="w-full flex justify-center mb-4">
            <img
              src={captchaData.data}
              alt="CAPTCHA"
              className="border border-gray-300 rounded"
              width={300}
              height={100}
            />
          </div>
        );
      case 1: // MATH
      case 2: // TEXT
        return (
          <div className="w-full p-4 mb-4 bg-gray-100 rounded-lg text-center">
            <p className="text-lg font-medium">{captchaData.data}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
        Verifikasi Anda Adalah Manusia
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : captchaData ? (
        <div>
          <div className="mb-4 p-2 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Tipe:</span>{" "}
              {puzzleTypes[puzzleType]}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              <span className="font-semibold">Instruksi:</span>{" "}
              {captchaData.instruction}
            </p>
          </div>

          {renderCaptchaContent()}

          <div className="mb-4">
            <label
              htmlFor="solution"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Solusi
            </label>
            <input
              id="solution"
              type="text"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan solusi Anda"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={verifySolution}
              disabled={isLoading || !solution}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Verifikasi
            </button>
            <button
              onClick={fetchCaptcha}
              disabled={isLoading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <button
            onClick={fetchCaptcha}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Muat CAPTCHA
          </button>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>
          Web3 CAPTCHA menggunakan teknologi zk-SNARKs untuk memverifikasi
          kemanusiaan Anda tanpa membocorkan data pribadi.
        </p>
      </div>
    </div>
  );
};

export default CaptchaWidget;
