# Web3 CAPTCHA SDK

SDK JavaScript untuk mengintegrasikan verifikasi kemanusiaan terdesentralisasi berbasis blockchain ke dalam aplikasi web.

## Fitur

- Integrasi mudah dengan aplikasi web modern
- Dukungan untuk berbagai jenis puzzle CAPTCHA (gambar, matematika, teks, audio)
- Verifikasi zero-knowledge dengan zk-SNARKs
- Widget UI yang dapat disesuaikan (light/dark mode)
- Support untuk semua browser modern

## Instalasi

```bash
npm install web3-captcha-sdk
```

atau

```bash
yarn add web3-captcha-sdk
```

## Penggunaan Dasar

```javascript
import { createCaptchaInstance } from "web3-captcha-sdk";

// Inisialisasi SDK
const captcha = createCaptchaInstance({
  contractAddress: "0xYourContractAddress", // Alamat kontrak DecentralizedCaptcha
  network: "testnet", // atau 'mainnet'
});

// Render widget CAPTCHA
captcha.render("#captcha-container", {
  theme: "light", // atau 'dark'
  callback: (success) => {
    if (success) {
      console.log("Verifikasi berhasil!");
      // Lakukan sesuatu setelah verifikasi berhasil
    } else {
      console.log("Verifikasi gagal");
    }
  },
});
```

## Opsi Konfigurasi

```javascript
// Opsi lengkap
const captcha = createCaptchaInstance({
  contractAddress: "0xYourContractAddress", // Alamat kontrak DecentralizedCaptcha (wajib)
  provider: customProvider, // Provider ethers.js kustom (opsional)
  network: "testnet", // 'mainnet', 'testnet', 'localhost' (default: 'mainnet')
  theme: "light", // 'light' atau 'dark' (default: 'light')
  puzzleType: 1, // Jenis puzzle: 0: Image, 1: Math, 2: Text, 3: Audio (opsional)
});
```

## API

### Metode Utama

#### `getPuzzle()`

Mendapatkan puzzle CAPTCHA dari blockchain.

```javascript
const puzzle = await captcha.getPuzzle();
console.log(puzzle); // { id: '0x...', type: 1, data: '0x...' }
```

#### `verifySolution(puzzleId, solution)`

Memeriksa apakah solusi benar tanpa mengirim bukti ke blockchain.

```javascript
const isValid = await captcha.verifySolution(puzzleId, solution);
```

#### `generateAndSubmitProof(puzzleId, solution)`

Menghasilkan bukti zero-knowledge dan mengirimkannya ke blockchain.

```javascript
const tx = await captcha.generateAndSubmitProof(puzzleId, solution);
```

#### `checkHumanStatus(address)`

Memeriksa apakah alamat wallet sudah terverifikasi sebagai manusia.

```javascript
const isHuman = await captcha.checkHumanStatus("0xYourAddress");
```

#### `render(container, options)`

Merender widget CAPTCHA di dalam container.

```javascript
captcha.render("#captcha-container", {
  theme: "dark",
  autoLoad: true, // Otomatis memuat puzzle
  callback: (success) => {
    // Handler sukses/gagal
  },
  puzzleType: 0, // Jenis puzzle yang diinginkan
});
```

## Contoh Kode

### Contoh React

```jsx
import { useState, useEffect } from "react";
import { createCaptchaInstance } from "web3-captcha-sdk";

function CaptchaComponent() {
  const [isVerified, setIsVerified] = useState(false);
  const [captcha, setCaptcha] = useState(null);

  useEffect(() => {
    // Inisialisasi SDK saat komponen dimuat
    const captchaInstance = createCaptchaInstance({
      contractAddress: "0xYourContractAddress",
      network: "testnet",
    });

    setCaptcha(captchaInstance);

    // Render widget setelah inisialisasi
    captchaInstance.render("#captcha-container", {
      theme: "light",
      callback: (success) => {
        setIsVerified(success);
      },
    });
  }, []);

  return (
    <div>
      <h2>Verifikasi Kemanusiaan</h2>
      <div id="captcha-container"></div>
      {isVerified && (
        <div className="success-message">
          Terima kasih! Anda telah terverifikasi.
        </div>
      )}
    </div>
  );
}
```

### Contoh Vue.js

```vue
<template>
  <div>
    <h2>Verifikasi Kemanusiaan</h2>
    <div id="captcha-container"></div>
    <div v-if="isVerified" class="success-message">
      Terima kasih! Anda telah terverifikasi.
    </div>
  </div>
</template>

<script>
import { createCaptchaInstance } from "web3-captcha-sdk";

export default {
  data() {
    return {
      isVerified: false,
      captcha: null,
    };
  },
  mounted() {
    // Inisialisasi SDK saat komponen dimuat
    this.captcha = createCaptchaInstance({
      contractAddress: "0xYourContractAddress",
      network: "testnet",
    });

    // Render widget
    this.captcha.render("#captcha-container", {
      theme: "light",
      callback: (success) => {
        this.isVerified = success;
      },
    });
  },
};
</script>
```

## Kustomisasi CSS

Widget menggunakan class CSS yang dapat Anda timpa dengan style kustom:

```css
/* Contoh kustomisasi */
.web3-captcha-widget {
  /* Kustomisasi container */
}

.captcha-header {
  /* Kustomisasi header */
}

.captcha-submit-btn {
  /* Kustomisasi tombol */
}
```

## Integrasi dengan Backend

Anda dapat memverifikasi status kemanusiaan pengguna di server backend:

```javascript
// Contoh Node.js dengan Express
const { ethers } = require("ethers");
const DecentralizedCaptchaABI = require("./DecentralizedCaptchaABI.json");

app.post("/api/verify-human", async (req, res) => {
  try {
    const { userAddress } = req.body;

    // Inisialisasi provider
    const provider = new ethers.providers.JsonRpcProvider(
      "https://your-rpc-endpoint"
    );

    // Inisialisasi kontrak
    const contract = new ethers.Contract(
      "0xYourContractAddress",
      DecentralizedCaptchaABI,
      provider
    );

    // Cek status kemanusiaan
    const isHuman = await contract.isHuman(userAddress);

    res.json({ isHuman });
  } catch (error) {
    console.error("Error verifying human status:", error);
    res.status(500).json({ error: "Failed to verify human status" });
  }
});
```

## Plugin WordPress

Untuk mengintegrasikan dengan WordPress, lihat plugin terpisah kami:
[Web3 CAPTCHA WordPress Plugin](https://github.com/username/web3-captcha-wordpress)

## Lisensi

MIT
