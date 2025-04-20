# Web3 CAPTCHA Terdesentralisasi (Proof-of-Humanity)

Sistem CAPTCHA berbasis blockchain yang membuktikan seseorang adalah manusia tanpa menggunakan layanan terpusat seperti Google reCAPTCHA.

## Teknologi

- **Smart Contracts**: Ethereum (Solidity)
- **Validasi Terdesentralisasi**: zk-SNARKs (Zero-Knowledge Proofs)
- **Frontend**: React, Next.js, TailwindCSS
- **Web3 Integration**: ethers.js

## Fitur Unik

- CAPTCHA berbasis puzzle unik yang hanya bisa dipecahkan manusia
- Menggunakan zk-SNARKs untuk membuktikan seseorang adalah manusia tanpa membocorkan data pribadi
- Reward bagi pengguna yang berhasil memvalidasi CAPTCHA secara sah

## Struktur Proyek

```
captcha_web3/
├── contracts/               # Smart Contracts
│   ├── CaptchaGenerator.sol # Generator puzzle CAPTCHA
│   ├── CaptchaValidator.sol # Validator verifikasi dan reward
│   └── DecentralizedCaptcha.sol # Kontrak utama dengan integrasi zk-SNARK
├── frontend/                # Aplikasi Next.js
│   ├── public/              # Aset statis
│   └── src/                 # Kode sumber
│       ├── components/      # Komponen React
│       ├── pages/           # Halaman Next.js
│       ├── styles/          # Stylesheet
│       └── utils/           # Fungsi utilitas dan konfigurasi
├── scripts/                 # Script deployment dan testing
└── test/                    # Pengujian smart contract
```

## Cara Menjalankan

### Prerequisites

- Node.js (v16+)
- npm atau yarn
- Metamask atau wallet Ethereum lainnya

### Langkah Setup

1. Clone repositori

   ```
   git clone https://github.com/username/captcha_web3.git
   cd captcha_web3
   ```

2. Instal dependensi

   ```
   npm install
   ```

3. Compile smart contracts

   ```
   npm run compile
   ```

4. Jalankan node Hardhat lokal

   ```
   npm run node
   ```

5. Deploy kontrak ke jaringan lokal

   ```
   npm run deploy
   ```

6. Jalankan frontend

   ```
   npm run dev
   ```

7. Buka browser di `http://localhost:3000`

## Penggunaan

1. Hubungkan wallet Ethereum Anda ke aplikasi
2. Minta CAPTCHA baru
3. Selesaikan puzzle CAPTCHA
4. Kirim bukti penyelesaian ke blockchain
5. Terima verifikasi "Proof-of-Humanity" dan reward

## Pengembangan Lanjutan

- Integrasi dengan blockchain lain (Solana, Polkadot)
- Lebih banyak jenis puzzle CAPTCHA
- Implementasi zkSNARK yang lebih canggih
- Integrasi dengan layanan terdesentralisasi lainnya

## Lisensi

MIT
