import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Web3 CAPTCHA</h3>
            <p className="text-gray-400 text-sm">
              Solusi verifikasi kemanusiaan terdesentralisasi menggunakan
              blockchain dan teknologi zero-knowledge proof.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Link Cepat</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/">
                  <span className="hover:text-white transition duration-300 cursor-pointer">
                    Beranda
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="hover:text-white transition duration-300 cursor-pointer">
                    Tentang
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/docs">
                  <span className="hover:text-white transition duration-300 cursor-pointer">
                    Dokumentasi
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Sumber Daya</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a
                  href="https://github.com/your-username/web3-captcha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition duration-300"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://ethereum.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition duration-300"
                >
                  Ethereum
                </a>
              </li>
              <li>
                <a
                  href="https://solidity.readthedocs.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition duration-300"
                >
                  Solidity
                </a>
              </li>
              <li>
                <a
                  href="https://zk-learning.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition duration-300"
                >
                  zk-SNARKs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Komunitas</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition duration-300"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition duration-300"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition duration-300"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} Web3 CAPTCHA. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
