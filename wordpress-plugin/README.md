# Web3 CAPTCHA untuk WordPress

Plugin Web3 CAPTCHA memungkinkan Anda mengintegrasikan sistem CAPTCHA terdesentralisasi berbasis blockchain ke dalam situs WordPress Anda untuk melindungi dari spam, bot, dan serangan otomatis. Setiap verifikasi yang berhasil akan memberikan token hadiah kepada pengguna.

## Fitur

- **Proteksi CAPTCHA Terdesentralisasi**: Melindungi form WordPress Anda dengan CAPTCHA berbasis blockchain untuk keamanan yang lebih baik.
- **Sistem Hadiah Token**: Pengguna mendapatkan token ERC-20 sebagai hadiah saat berhasil memverifikasi CAPTCHA.
- **Beberapa Jenis Puzzle**: Dukungan untuk berbagai jenis CAPTCHA (gambar, matematika, teks, audio).
- **Integrasi Fleksibel**: Tambahkan ke form login, registrasi, komentar, checkout WooCommerce, dan lainnya.
- **Verifikasi Zero-Knowledge**: Gunakan teknologi zk-SNARKs untuk memverifikasi pengguna secara privat.
- **Sepenuhnya Dapat Dikustomisasi**: Atur tema, ukuran, tingkat kesulitan, dan banyak lagi.
- **Dukungan Shortcode**: Tambahkan Web3 CAPTCHA ke mana saja di situs Anda menggunakan shortcode.
- **Kompatibel dengan Multisite**: Bekerja dengan konfigurasi WordPress multisite.

## Persyaratan

- WordPress 5.5 atau lebih tinggi
- PHP 7.4 atau lebih tinggi
- Mendukung browser modern (Chrome, Firefox, Safari, Edge)
- Koneksi internet aktif
- (Untuk fungsionalitas hadiah token) MetaMask atau wallet Web3 lainnya

## Dependensi Teknologi

Plugin ini menggunakan beberapa teknologi berikut:

- **Web3.js/Ethers.js**: Untuk interaksi dengan blockchain (disertakan dalam plugin)
- **Smart Contracts**: Kontrak ERC-20 untuk token hadiah dan kontrak CAPTCHA
- **Zero-Knowledge Proofs**: Implementasi zk-SNARKs untuk verifikasi privat

## Persiapan Blockchain (Untuk Fitur Hadiah Token)

Sebelum mengaktifkan fitur hadiah token, pastikan Anda telah:

1. **Menyiapkan Smart Contract**:

   - Deploy kontrak ERC-20 untuk token hadiah (contoh kontrak tersedia di [contoh/CaptchaToken.sol](https://github.com/web3captcha/captcha-token/blob/main/contracts/CaptchaToken.sol))
   - Deploy kontrak CAPTCHA untuk verifikasi dan distribusi token

2. **Mendapatkan Provider RPC**:

   - Daftar akun di [Infura](https://infura.io/) atau [Alchemy](https://www.alchemy.com/)
   - Buat project dan dapatkan URL endpoint RPC

3. **Mengisi Token**:
   - Pastikan kontrak token memiliki saldo cukup untuk hadiah

## Instalasi

### Metode 1: Instalasi Melalui WordPress

1. Masuk ke dashboard admin WordPress Anda
2. Buka menu "Plugin" > "Tambah Baru"
3. Klik tombol "Unggah Plugin" di bagian atas
4. Pilih file zip plugin Web3 CAPTCHA yang telah diunduh
5. Klik "Instal Sekarang"
6. Setelah terinstal, klik "Aktifkan Plugin"

### Metode 2: Instalasi Manual

1. Unduh plugin dari [web3captcha.com](https://web3captcha.com) atau melalui repositori plugin WordPress
2. Ekstrak file zip ke folder `/wp-content/plugins/` di situs WordPress Anda
3. Aktifkan plugin melalui menu 'Plugin' di WordPress

### Metode 3: Instalasi dari GitHub

1. Clone repositori GitHub:
   ```
   git clone https://github.com/web3captcha/wordpress-plugin.git wp-content/plugins/web3-captcha
   ```
2. Masuk ke direktori plugin:
   ```
   cd wp-content/plugins/web3-captcha
   ```
3. Aktifkan plugin melalui Dashboard WordPress

## Konfigurasi Detail

### 1. Pengaturan Blockchain

Setelah mengaktifkan plugin, buka halaman pengaturan di `Web3 CAPTCHA` di menu admin WordPress:

1. **Alamat Kontrak CAPTCHA**: Masukkan alamat kontrak Web3 CAPTCHA Anda

   - Format: `0x...` (alamat Ethereum 42 karakter)
   - Contoh: `0x1234567890123456789012345678901234567890`

2. **Alamat Kontrak Token**: Masukkan alamat kontrak ERC-20 untuk hadiah token

   - Format: `0x...` (alamat Ethereum 42 karakter)

3. **Pilih Jaringan Blockchain**:

   - Ethereum Mainnet: Untuk produksi
   - Jaringan Testnet (Goerli, Sepolia): Untuk pengujian
   - Polygon/Mumbai: Untuk biaya transaksi lebih rendah

4. **URL Provider RPC** (opsional):

   - URL endpoint dari Infura/Alchemy
   - Format: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`

5. **Jumlah Token Hadiah**: Tentukan jumlah token yang diberikan untuk setiap verifikasi berhasil

### 2. Pengaturan CAPTCHA

1. **Jenis Puzzle CAPTCHA**:

   - Gambar: Pengguna memasukkan teks dari gambar
   - Matematika: Pengguna menyelesaikan soal matematika
   - Teks: Pengguna menjawab pertanyaan teks
   - Audio: Pengguna mengetik kata yang diucapkan

2. **Tingkat Kesulitan**:

   - Mudah: Untuk situs dengan pengguna umum
   - Sedang: Keseimbangan keamanan dan pengalaman pengguna
   - Sulit: Untuk keamanan maksimal

3. **Tema dan Tampilan**:
   - Tema: Terang, Gelap, atau Otomatis (mengikuti tema WordPress)
   - Ukuran: Kompak, Normal, atau Besar

### 3. Integrasi Form

Pilih di mana Web3 CAPTCHA akan ditampilkan:

- Form Login WordPress
- Form Pendaftaran Pengguna
- Form Komentar
- Form Reset Password
- Halaman Checkout WooCommerce

## Panduan Penggunaan

### Penggunaan untuk Pengguna Situs

Pengguna situs yang mengunjungi halaman dengan Web3 CAPTCHA akan:

1. Melihat widget CAPTCHA pada form yang dikonfigurasi
2. Menyelesaikan puzzle yang ditampilkan (memasukkan teks, menjawab pertanyaan, dll.)
3. Mengklik tombol "Verifikasi"
4. Jika menggunakan fitur hadiah token:
   - Pengguna akan diminta menghubungkan wallet (MetaMask atau wallet Web3 lainnya)
   - Setelah verifikasi berhasil, token hadiah akan dikirim ke alamat wallet mereka

### Penggunaan untuk Admin WordPress

Sebagai admin situs WordPress, Anda dapat:

1. **Pantau Statistik CAPTCHA**:

   - Jumlah verifikasi berhasil/gagal
   - Token yang telah didistribusikan

2. **Gunakan Shortcode untuk Penempatan Kustom**:

   - Dasar: `[web3_captcha]`
   - Dengan atribut: `[web3_captcha theme="dark" size="compact" puzzle_type="math"]`

3. **Mengintegrasikan dengan Plugin Lain**:
   - Formulir kontak
   - Sistem pendaftaran keanggotaan
   - Plugin e-commerce

### Integrasi Programatik

Untuk developer yang ingin mengintegrasikan secara programatik:

1. **Tampilkan CAPTCHA**:

   ```php
   <?php if (function_exists('web3_captcha_display')) {
       web3_captcha_display();
   } ?>
   ```

2. **Verifikasi CAPTCHA**:

   ```php
   <?php
   if (function_exists('web3_captcha_verify')) {
       $is_human = web3_captcha_verify();
       if ($is_human) {
           // Lanjutkan pemrosesan form
       } else {
           // Tampilkan pesan error
       }
   }
   ?>
   ```

3. **Hook WordPress**:

   ```php
   // Contoh: Tambahkan CAPTCHA ke form kustom
   add_action('my_custom_form', 'web3_captcha_display');

   // Contoh: Verifikasi CAPTCHA pada form submission
   add_action('my_form_submission', function($data) {
       if (!function_exists('web3_captcha_verify') || !web3_captcha_verify()) {
           wp_die('CAPTCHA verification failed');
       }
       // Proses data form
   });
   ```

## Metode Pembayaran Hadiah Token

Web3 CAPTCHA menggunakan metode berikut untuk mendistribusikan token hadiah:

1. **Model Klaim Pengguna**: Pengguna mengklaim token mereka dengan mengirimkan bukti ke kontrak pintar.
2. **Distribusi Otomatis**: Token dikirim langsung ke dompet pengguna setelah verifikasi berhasil.

### Biaya Gas

Perhatikan bahwa distribusi token memerlukan biaya gas blockchain:

- **Pengirim Token**: Secara default, kontrak CAPTCHA membayar biaya gas
- **Jumlah Gas**: Bergantung pada jaringan dan kondisi pasar
- **Optimisasi**: Pertimbangkan menggunakan jaringan seperti Polygon untuk biaya gas lebih rendah

## Pemecahan Masalah

### CAPTCHA Tidak Muncul

- Periksa Konsol Browser (F12) untuk pesan error JavaScript
- Pastikan semua aset JavaScript dan CSS dimuat dengan benar
- Periksa pengaturan plugin dan alamat kontrak

### Verifikasi Gagal

- Pastikan solusi yang dimasukkan benar
- Periksa koneksi blockchain dapat diakses
- Verifikasi bahwa kontrak memiliki token yang cukup untuk hadiah

### Masalah Koneksi Wallet

- Pastikan MetaMask atau wallet Web3 lainnya terinstal dan terbuka
- Verifikasi wallet terhubung ke jaringan yang benar (sesuai pengaturan plugin)
- Periksa apakah wallet memiliki ETH cukup untuk biaya gas (jika menggunakan model klaim pengguna)

### Masalah Token Tidak Diterima

- Periksa alamat kontrak token dalam pengaturan
- Verifikasi saldo kontrak token
- Periksa log transaksi di explorer blockchain

## Pertimbangan Keamanan

- **Admin Dashboard**: Selalu tetap perbarui WordPress ke versi terbaru
- **Kontrak Token**: Gunakan kontrak yang sudah diaudit keamanannya
- **Private Keys**: Jangan pernah menyimpan private key di server
- **Rate Limiting**: Aktifkan pembatasan upaya pengisian form untuk mencegah abuse

## Changelog

### Versi 1.0.0

- Rilis awal plugin

## Dukungan

Jika Anda mengalami masalah atau memiliki pertanyaan:

- Kunjungi [dokumentasi online](https://web3captcha.com/docs)
- Buka [forum dukungan](https://web3captcha.com/support)
- Kontak langsung melalui email: support@web3captcha.com

## Lisensi

Plugin Web3 CAPTCHA dilisensikan di bawah [Lisensi GPLv2 atau lebih baru](https://www.gnu.org/licenses/gpl-2.0.html).

## Informasi Pengembang

Dikembangkan oleh Tim Web3 CAPTCHA. Jika Anda tertarik untuk berkontribusi pada plugin, kunjungi [repositori GitHub](https://github.com/web3captcha/wordpress-plugin) kami.
