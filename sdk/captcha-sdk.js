/**
 * Web3 CAPTCHA SDK
 * Pustaka JavaScript untuk mengintegrasikan Web3 CAPTCHA terdesentralisasi ke dalam aplikasi web
 */

import { ethers } from "ethers";
import snarkjs from "snarkjs";

// ABI kontrak (akan diimpor dari file yang dihasilkan oleh kompilasi)
const CaptchaABI = [];

class Web3Captcha {
  /**
   * Membuat instance Web3 CAPTCHA SDK.
   * @param {Object} options - Opsi konfigurasi
   * @param {string} options.contractAddress - Alamat kontrak DecentralizedCaptcha
   * @param {Object} options.provider - Provider web3 (ethers.js)
   * @param {string} options.network - Nama jaringan (mainnet, testnet, dll.)
   * @param {string} options.theme - Tema UI ('light' atau 'dark')
   * @param {number} options.puzzleType - Jenis puzzle yang diinginkan (0: Image, 1: Math, 2: Text, 3: Audio)
   */
  constructor(options = {}) {
    this.contractAddress = options.contractAddress;
    this.provider =
      options.provider ||
      (window.ethereum
        ? new ethers.providers.Web3Provider(window.ethereum)
        : null);
    this.network = options.network || "mainnet";
    this.theme = options.theme || "light";
    this.puzzleType = options.puzzleType || null;

    // Validasi konfigurasi
    if (!this.contractAddress) {
      throw new Error("Web3Captcha: Alamat kontrak harus disediakan");
    }

    if (!this.provider) {
      console.warn(
        "Web3Captcha: Provider tidak tersedia. Pastikan wallet terhubung untuk fungsi penuh."
      );
    }

    // Inisialisasi kontrak jika provider tersedia
    if (this.provider) {
      this.contract = new ethers.Contract(
        this.contractAddress,
        CaptchaABI,
        this.provider
      );
    }

    // Status saat ini
    this.currentPuzzle = null;
    this.currentSolution = null;
    this.verificationStatus = {
      verified: false,
      timestamp: null,
      proofSubmitted: false,
    };
  }

  /**
   * Mendapatkan puzzle CAPTCHA dari blockchain
   * @returns {Promise<Object>} Puzzle CAPTCHA
   */
  async getPuzzle() {
    if (!this.provider) {
      throw new Error(
        "Web3Captcha: Provider tidak tersedia. Hubungkan wallet terlebih dahulu."
      );
    }

    try {
      // Dapatkan signer untuk transaksi
      const signer = this.provider.getSigner();
      const connectedContract = this.contract.connect(signer);

      // Panggil kontrak untuk mendapatkan puzzle
      const puzzleData = await connectedContract.getCaptchaPuzzle();

      // Format response
      this.currentPuzzle = {
        id: puzzleData[0],
        type: puzzleData[1],
        data: puzzleData[2],
      };

      return this.currentPuzzle;
    } catch (error) {
      console.error("Web3Captcha: Error mendapatkan puzzle", error);
      throw error;
    }
  }

  /**
   * Memeriksa apakah solusi benar (tanpa mengirim bukti ke blockchain)
   * @param {string} puzzleId - ID puzzle
   * @param {string} solution - Solusi yang diajukan
   * @returns {Promise<boolean>} Hasil verifikasi
   */
  async verifySolution(puzzleId, solution) {
    if (!this.provider) {
      throw new Error(
        "Web3Captcha: Provider tidak tersedia. Hubungkan wallet terlebih dahulu."
      );
    }

    try {
      // Simpan solusi saat ini untuk nanti pembuatan bukti
      this.currentSolution = solution;

      // Panggil kontrak untuk verifikasi
      const isValid = await this.contract.checkSolution(puzzleId, solution);
      return isValid;
    } catch (error) {
      console.error("Web3Captcha: Error verifikasi solusi", error);
      throw error;
    }
  }

  /**
   * Menghasilkan bukti zero-knowledge dari solusi
   * @param {string} puzzleId - ID puzzle
   * @param {string} solution - Solusi puzzle
   * @returns {Promise<Object>} Bukti ZK
   */
  async generateProof(puzzleId, solution) {
    try {
      // Pada implementasi sebenarnya, ini akan menggunakan snarkjs atau pustaka zk lainnya
      // untuk menghasilkan bukti zero-knowledge

      /* Contoh generasi bukti dengan snarkjs (placeholder) */
      /*
      const input = {
        puzzleId: puzzleId,
        solution: solution,
        salt: Math.floor(Math.random() * 1000000)
      };
      
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        "circuit.wasm",
        "circuit_final.zkey"
      );
      
      return { proof, publicSignals };
      */

      // Untuk contoh, kita hanya mengembalikan data dummy
      console.log(
        "Menghasilkan bukti untuk puzzleId:",
        puzzleId,
        "dan solusi:",
        solution
      );

      const dummyProof = ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "string"],
        [puzzleId, solution]
      );

      return dummyProof;
    } catch (error) {
      console.error("Web3Captcha: Error menghasilkan bukti", error);
      throw error;
    }
  }

  /**
   * Mengirimkan bukti ke blockchain untuk verifikasi
   * @param {Object} proof - Bukti ZK
   * @returns {Promise<Object>} Hasil transaksi
   */
  async submitProof(proof) {
    if (!this.provider) {
      throw new Error(
        "Web3Captcha: Provider tidak tersedia. Hubungkan wallet terlebih dahulu."
      );
    }

    try {
      // Dapatkan signer
      const signer = this.provider.getSigner();
      const connectedContract = this.contract.connect(signer);

      // Kirim transaksi
      const tx = await connectedContract.submitProof(proof);
      await tx.wait();

      // Update status
      this.verificationStatus = {
        verified: true,
        timestamp: Date.now(),
        proofSubmitted: true,
      };

      return tx;
    } catch (error) {
      console.error("Web3Captcha: Error mengirim bukti", error);
      throw error;
    }
  }

  /**
   * Proses lengkap verifikasi: Menghasilkan dan mengirimkan bukti
   * @param {string} puzzleId - ID puzzle
   * @param {string} solution - Solusi yang diajukan
   * @returns {Promise<Object>} Hasil verifikasi
   */
  async generateAndSubmitProof(puzzleId, solution) {
    // 1. Verifikasi solusi terlebih dahulu
    const isValid = await this.verifySolution(puzzleId, solution);

    if (!isValid) {
      throw new Error("Web3Captcha: Solusi tidak valid");
    }

    // 2. Hasilkan bukti
    const proof = await this.generateProof(puzzleId, solution);

    // 3. Kirim bukti
    return await this.submitProof(proof);
  }

  /**
   * Cek apakah alamat wallet sudah terverifikasi sebagai manusia
   * @param {string} address - Alamat wallet yang akan dicek
   * @returns {Promise<boolean>} Status verifikasi
   */
  async checkHumanStatus(address) {
    if (!this.provider) {
      throw new Error(
        "Web3Captcha: Provider tidak tersedia. Hubungkan wallet terlebih dahulu."
      );
    }

    try {
      // Panggil fungsi isHuman dari kontrak
      const isHuman = await this.contract.isHuman(address);
      return isHuman;
    } catch (error) {
      console.error("Web3Captcha: Error mengecek status manusia", error);
      throw error;
    }
  }

  /**
   * Render widget CAPTCHA di dalam container yang ditentukan
   * @param {string|HTMLElement} container - Selector atau elemen container
   * @param {Object} options - Opsi konfigurasi tambahan
   */
  render(container, options = {}) {
    // Temukan elemen container
    const containerElement =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    if (!containerElement) {
      throw new Error("Web3Captcha: Container tidak ditemukan");
    }

    // Opsi widget
    const widgetOptions = {
      theme: options.theme || this.theme,
      autoLoad: options.autoLoad !== undefined ? options.autoLoad : true,
      callback: options.callback || null,
      puzzleType: options.puzzleType || this.puzzleType,
    };

    // Buat elemen widget
    const widget = document.createElement("div");
    widget.className = `web3-captcha-widget theme-${widgetOptions.theme}`;
    widget.innerHTML = `
      <div class="captcha-container">
        <div class="captcha-header">
          <h3>Verifikasi Anda Adalah Manusia</h3>
        </div>
        <div class="captcha-content">
          <div class="captcha-puzzle-area">
            <p>Memuat puzzle CAPTCHA...</p>
          </div>
          <div class="captcha-input-area">
            <input type="text" placeholder="Masukkan solusi" class="captcha-solution-input" />
            <button class="captcha-submit-btn">Verifikasi</button>
          </div>
        </div>
        <div class="captcha-footer">
          <span>Powered by Web3 CAPTCHA</span>
        </div>
      </div>
    `;

    // Tambahkan style
    const style = document.createElement("style");
    style.textContent = `
      .web3-captcha-widget {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
        font-family: sans-serif;
      }
      .web3-captcha-widget.theme-dark {
        background-color: #2a2a2a;
        color: #fff;
      }
      .web3-captcha-widget.theme-light {
        background-color: #fff;
        color: #333;
      }
      .captcha-header {
        padding: 10px;
        text-align: center;
        border-bottom: 1px solid #e0e0e0;
      }
      .captcha-content {
        padding: 15px;
      }
      .captcha-puzzle-area {
        min-height: 100px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .captcha-input-area {
        display: flex;
        gap: 10px;
      }
      .captcha-solution-input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .captcha-submit-btn {
        padding: 8px 16px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .captcha-footer {
        padding: 10px;
        text-align: center;
        font-size: 12px;
        border-top: 1px solid #e0e0e0;
      }
    `;

    // Tambahkan elemen ke DOM
    containerElement.appendChild(style);
    containerElement.appendChild(widget);

    // Referensi ke elemen UI
    const puzzleArea = widget.querySelector(".captcha-puzzle-area");
    const solutionInput = widget.querySelector(".captcha-solution-input");
    const submitButton = widget.querySelector(".captcha-submit-btn");

    // Auto-load puzzle jika diatur
    if (widgetOptions.autoLoad) {
      this.loadPuzzleIntoWidget(puzzleArea);
    }

    // Event handler untuk submit
    submitButton.addEventListener("click", async () => {
      if (!this.currentPuzzle) {
        alert("Mohon muat puzzle terlebih dahulu");
        return;
      }

      const solution = solutionInput.value.trim();
      if (!solution) {
        alert("Silakan masukkan solusi");
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Memverifikasi...";

      try {
        // Proses lengkap verifikasi
        await this.generateAndSubmitProof(this.currentPuzzle.id, solution);

        // Tampilkan sukses
        puzzleArea.innerHTML =
          '<div class="verification-success">✅ Verifikasi berhasil! Anda adalah manusia.</div>';
        solutionInput.disabled = true;

        // Panggil callback jika ada
        if (typeof widgetOptions.callback === "function") {
          widgetOptions.callback(true);
        }
      } catch (error) {
        console.error("Web3Captcha: Error verifikasi", error);
        puzzleArea.innerHTML =
          '<div class="verification-error">❌ Verifikasi gagal. Silakan coba lagi.</div>';

        // Panggil callback jika ada
        if (typeof widgetOptions.callback === "function") {
          widgetOptions.callback(false);
        }
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Verifikasi";
      }
    });

    // Simpan referensi ke elemen untuk penggunaan nanti
    this.widgetElements = {
      container: containerElement,
      widget,
      puzzleArea,
      solutionInput,
      submitButton,
    };

    return this;
  }

  /**
   * Memuat puzzle ke dalam widget
   * @param {HTMLElement} puzzleArea - Elemen area puzzle
   * @returns {Promise<void>}
   */
  async loadPuzzleIntoWidget(puzzleArea) {
    if (!puzzleArea) {
      puzzleArea = this.widgetElements?.puzzleArea;
    }

    if (!puzzleArea) {
      throw new Error("Web3Captcha: puzzleArea tidak ditemukan");
    }

    puzzleArea.innerHTML = "<p>Memuat puzzle...</p>";

    try {
      // Dapatkan puzzle dari blockchain
      const puzzle = await this.getPuzzle();

      // Tampilkan puzzle berdasarkan tipe
      switch (parseInt(puzzle.type)) {
        case 0: // IMAGE
          puzzleArea.innerHTML = `
            <div class="image-puzzle">
              <img src="${ethers.utils.toUtf8String(
                puzzle.data
              )}" alt="CAPTCHA" />
              <p>Ketik teks yang ditampilkan pada gambar</p>
            </div>
          `;
          break;
        case 1: // MATH
          puzzleArea.innerHTML = `
            <div class="math-puzzle">
              <p>Selesaikan perhitungan matematika:</p>
              <p class="math-equation">${ethers.utils.toUtf8String(
                puzzle.data
              )}</p>
            </div>
          `;
          break;
        case 2: // TEXT
          puzzleArea.innerHTML = `
            <div class="text-puzzle">
              <p>Jawab pertanyaan:</p>
              <p class="text-question">${ethers.utils.toUtf8String(
                puzzle.data
              )}</p>
            </div>
          `;
          break;
        case 3: // AUDIO
          puzzleArea.innerHTML = `
            <div class="audio-puzzle">
              <p>Dengarkan dan ketik kata yang diucapkan:</p>
              <audio controls src="${ethers.utils.toUtf8String(
                puzzle.data
              )}"></audio>
            </div>
          `;
          break;
        default:
          puzzleArea.innerHTML = "<p>Tipe puzzle tidak didukung</p>";
      }
    } catch (error) {
      console.error("Web3Captcha: Error memuat puzzle", error);
      puzzleArea.innerHTML = "<p>Error memuat puzzle. Silakan coba lagi.</p>";
    }
  }
}

// Factory function untuk membuat instance
export function createCaptchaInstance(options) {
  return new Web3Captcha(options);
}

export default Web3Captcha;
