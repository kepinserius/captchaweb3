import { useState } from "react";
import Link from "next/link";

const Header = ({ isConnected, account, connectWallet }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Format alamat wallet untuk tampilan
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-xl font-bold text-blue-600 cursor-pointer">
              Web3 CAPTCHA
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <span className="text-gray-700 hover:text-blue-600 transition duration-300 cursor-pointer">
              Beranda
            </span>
          </Link>
          <Link href="/about">
            <span className="text-gray-700 hover:text-blue-600 transition duration-300 cursor-pointer">
              Tentang
            </span>
          </Link>
          <Link href="/docs">
            <span className="text-gray-700 hover:text-blue-600 transition duration-300 cursor-pointer">
              Dokumentasi
            </span>
          </Link>

          {isConnected ? (
            <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-800">
              {formatAddress(account)}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-300"
            >
              Hubungkan Wallet
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 px-4 py-2 bg-white border-t border-gray-200">
          <Link href="/">
            <div className="block py-2 text-gray-700 hover:text-blue-600 cursor-pointer">
              Beranda
            </div>
          </Link>
          <Link href="/about">
            <div className="block py-2 text-gray-700 hover:text-blue-600 cursor-pointer">
              Tentang
            </div>
          </Link>
          <Link href="/docs">
            <div className="block py-2 text-gray-700 hover:text-blue-600 cursor-pointer">
              Dokumentasi
            </div>
          </Link>

          {isConnected ? (
            <div className="py-2 text-sm font-medium text-gray-800">
              Terhubung: {formatAddress(account)}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition duration-300"
            >
              Hubungkan Wallet
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
