/**
 * Web3 CAPTCHA - JavaScript Frontend
 *
 * File JavaScript utama untuk Web3 CAPTCHA di WordPress
 */

(function ($) {
  "use strict";

  // Class utama untuk Web3 CAPTCHA
  class Web3CaptchaHandler {
    /**
     * Konstruktor
     */
    constructor() {
      // Inisialisasi variabel
      this.puzzleId = null;
      this.isSolved = false;
      this.isLoading = false;
      this.walletAddress = null;
      this.isWalletConnected = false;
      this.provider = null;

      // Inisialisasi Web3 CAPTCHA pada semua container
      this.init();
    }

    /**
     * Inisialisasi CAPTCHA
     */
    init() {
      // Mencari semua container CAPTCHA
      const containers = $('.web3-captcha-container div[id^="web3-captcha-"]');
      if (containers.length === 0) return;

      // Inisialisasi setiap container
      containers.each((index, container) => {
        this.initContainer(container);
      });

      // Tambahkan event listener untuk form submission
      this.setupFormListeners();
    }

    /**
     * Inisialisasi container CAPTCHA
     *
     * @param {HTMLElement} container - Container CAPTCHA
     */
    initContainer(container) {
      const $container = $(container);
      const containerId = $container.attr("id");

      // Dapatkan setting dari data attributes atau dari global config
      const theme = $container.data("theme") || web3CaptchaParams.theme;
      const size = $container.data("size") || web3CaptchaParams.size;
      const puzzleType =
        $container.data("puzzle-type") || web3CaptchaParams.puzzleType;

      // Tambahkan kelas tema
      $container.addClass("web3-captcha");
      $container.addClass("web3-captcha-theme-" + theme);
      $container.addClass("web3-captcha-size-" + size);

      // Buat struktur HTML
      this.renderCaptchaUI($container, puzzleType);

      // Load puzzle
      this.loadPuzzle($container, puzzleType);
    }

    /**
     * Render UI CAPTCHA
     *
     * @param {jQuery} $container - Container CAPTCHA
     * @param {string} puzzleType - Tipe puzzle
     */
    renderCaptchaUI($container, puzzleType) {
      const html = `
                <div class="web3-captcha-header">
                    <h3>${web3CaptchaParams.i18n.verifyHuman}</h3>
                </div>
                <div class="web3-captcha-body">
                    <div class="web3-captcha-puzzle-area">
                        <div class="web3-captcha-instruction"></div>
                        <div class="web3-captcha-puzzle"></div>
                    </div>
                    <div class="web3-captcha-input-area">
                        <input type="text" class="web3-captcha-solution" placeholder="${web3CaptchaParams.i18n.enterSolution}" />
                        <button type="button" class="web3-captcha-verify-btn">${web3CaptchaParams.i18n.verify}</button>
                    </div>
                    <div class="web3-captcha-wallet-status"></div>
                </div>
                <div class="web3-captcha-footer">
                    ${web3CaptchaParams.i18n.poweredBy}
                </div>
            `;

      $container.html(html);

      // Event listener untuk tombol verifikasi
      $container.find(".web3-captcha-verify-btn").on("click", () => {
        this.verifyPuzzle($container);
      });

      // Event listener untuk input (Enter key)
      $container.find(".web3-captcha-solution").on("keypress", (e) => {
        if (e.which === 13) {
          this.verifyPuzzle($container);
        }
      });
    }

    /**
     * Loading puzzle dari server
     *
     * @param {jQuery} $container - Container CAPTCHA
     * @param {string} puzzleType - Tipe puzzle
     */
    loadPuzzle($container, puzzleType) {
      // Tampilkan loading
      $container
        .find(".web3-captcha-puzzle")
        .html(`<p>${web3CaptchaParams.i18n.loadingPuzzle}</p>`);
      this.isLoading = true;

      // Request puzzle dari server
      $.ajax({
        url: web3CaptchaParams.ajaxurl,
        type: "POST",
        data: {
          action: "web3_captcha_get_puzzle",
          nonce: this.createNonce(),
          type: puzzleType,
        },
        dataType: "json",
        success: (response) => {
          this.isLoading = false;

          if (response.success && response.data.puzzle) {
            this.displayPuzzle($container, response.data.puzzle);
            this.puzzleId = response.data.puzzle.id;
          } else {
            $container
              .find(".web3-captcha-puzzle")
              .html("<p>Error loading puzzle. Please reload.</p>");
          }
        },
        error: () => {
          this.isLoading = false;
          $container
            .find(".web3-captcha-puzzle")
            .html("<p>Error loading puzzle. Please reload.</p>");
        },
      });
    }

    /**
     * Menampilkan puzzle ke UI
     *
     * @param {jQuery} $container - Container CAPTCHA
     * @param {Object} puzzle - Data puzzle
     */
    displayPuzzle($container, puzzle) {
      // Tampilkan instruksi
      $container.find(".web3-captcha-instruction").text(puzzle.instruction);

      // Tampilkan konten puzzle berdasarkan tipe
      const $puzzleArea = $container.find(".web3-captcha-puzzle");

      switch (parseInt(puzzle.type)) {
        case 0: // Image
          $puzzleArea.html(
            `<img src="${puzzle.data}" class="web3-captcha-image" alt="CAPTCHA Image" />`
          );
          break;

        case 1: // Math
          $puzzleArea.html(
            `<div class="web3-captcha-math-equation">${puzzle.data}</div>`
          );
          break;

        case 2: // Text
          $puzzleArea.html(
            `<div class="web3-captcha-text-question">${puzzle.data}</div>`
          );
          break;

        case 3: // Audio
          $puzzleArea.html(`
                        <audio controls class="web3-captcha-audio">
                            <source src="${puzzle.data}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    `);
          break;

        default:
          $puzzleArea.html(`<p>Unsupported puzzle type</p>`);
      }

      // Reset input
      $container.find(".web3-captcha-solution").val("").focus();
    }

    /**
     * Verifikasi solusi puzzle
     *
     * @param {jQuery} $container - Container CAPTCHA
     */
    verifyPuzzle($container) {
      if (this.isLoading || this.isSolved) return;

      const solution = $container.find(".web3-captcha-solution").val();

      if (!solution) {
        this.showMessage(
          $container,
          web3CaptchaParams.i18n.invalidCaptcha,
          false
        );
        return;
      }

      this.isLoading = true;
      $container.find(".web3-captcha-verify-btn").prop("disabled", true);

      // Prepare data
      const data = {
        action: "web3_captcha_verify",
        nonce: this.createNonce(),
        puzzleId: this.puzzleId,
        solution: solution,
      };

      // Tambahkan wallet address jika tersedia
      if (this.isWalletConnected && this.walletAddress) {
        data.walletAddress = this.walletAddress;
      }

      // Kirim ke server untuk verifikasi
      $.ajax({
        url: web3CaptchaParams.ajaxurl,
        type: "POST",
        data: data,
        dataType: "json",
        success: (response) => {
          this.isLoading = false;
          $container.find(".web3-captcha-verify-btn").prop("disabled", false);

          if (response.success) {
            this.isSolved = true;
            this.showSuccess($container, response.data.message);
            this.markAsVerified();

            // Jika wallet terhubung dan reward diberikan
            if (response.data.rewardProcessed) {
              this.showRewardSuccess($container);
            }
          } else {
            this.showError(
              $container,
              response.data.message || web3CaptchaParams.i18n.verificationFailed
            );
          }
        },
        error: () => {
          this.isLoading = false;
          $container.find(".web3-captcha-verify-btn").prop("disabled", false);
          this.showError($container, web3CaptchaParams.i18n.verificationFailed);
        },
      });
    }

    /**
     * Menampilkan pesan sukses
     *
     * @param {jQuery} $container - Container CAPTCHA
     * @param {string} message - Pesan sukses
     */
    showSuccess($container, message) {
      const $body = $container.find(".web3-captcha-body");
      $body.html(`
                <div class="web3-captcha-success">
                    <svg width="50" height="50" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="11" fill="#4CAF50" stroke="none" />
                        <path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="2" fill="none" />
                    </svg>
                    <p>${message}</p>
                </div>
            `);
    }

    /**
     * Menampilkan pesan error
     *
     * @param {jQuery} $container - Container CAPTCHA
     * @param {string} message - Pesan error
     */
    showError($container, message) {
      const $body = $container.find(".web3-captcha-body");
      $body.html(`
                <div class="web3-captcha-error">
                    <svg width="50" height="50" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="11" fill="#F44336" stroke="none" />
                        <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2" />
                    </svg>
                    <p>${message}</p>
                    <button type="button" class="web3-captcha-reload-btn">Try Again</button>
                </div>
            `);

      $container.find(".web3-captcha-reload-btn").on("click", () => {
        this.initContainer($container[0]);
      });
    }

    /**
     * Menampilkan pesan
     *
     * @param {jQuery} $container - Container CAPTCHA
     * @param {string} message - Pesan
     * @param {boolean} isSuccess - Apakah sukses
     */
    showMessage($container, message, isSuccess = true) {
      const $messageEl = $("<div>").addClass("web3-captcha-message");
      $messageEl.addClass(
        isSuccess
          ? "web3-captcha-message-success"
          : "web3-captcha-message-error"
      );
      $messageEl.text(message);

      $container.find(".web3-captcha-input-area").after($messageEl);

      // Hapus pesan setelah beberapa detik
      setTimeout(() => {
        $messageEl.fadeOut(300, function () {
          $(this).remove();
        });
      }, 3000);
    }

    /**
     * Menampilkan pesan sukses hadiah
     *
     * @param {jQuery} $container - Container CAPTCHA
     */
    showRewardSuccess($container) {
      // Implementasi visual notifikasi reward jika diperlukan
    }

    /**
     * Menandai CAPTCHA telah diverifikasi
     */
    markAsVerified() {
      // Tambahkan input tersembunyi untuk menandai form telah diverifikasi
      if ($('input[name="web3_captcha_verified"]').length === 0) {
        $("body").append(
          '<input type="hidden" name="web3_captcha_verified" value="true">'
        );
      } else {
        $('input[name="web3_captcha_verified"]').val("true");
      }
    }

    /**
     * Setup listener untuk form submission
     */
    setupFormListeners() {
      // Menangani form submission
      $("form").on("submit", (e) => {
        // Cek apakah form memiliki CAPTCHA
        const hasCaptcha =
          $(e.target).find(".web3-captcha-container").length > 0;

        if (hasCaptcha && !this.isSolved) {
          e.preventDefault();
          alert(web3CaptchaParams.i18n.invalidCaptcha);
          return false;
        }
      });
    }

    /**
     * Koneksi ke wallet Ethereum
     *
     * @param {jQuery} $container - Container CAPTCHA
     */
    async connectWallet($container) {
      if (typeof window.ethereum === "undefined") {
        this.showMessage(
          $container,
          "MetaMask or Ethereum wallet not detected",
          false
        );
        return;
      }

      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts && accounts.length > 0) {
          this.walletAddress = accounts[0];
          this.isWalletConnected = true;

          // Tampilkan status wallet
          this.showWalletStatus($container);

          // Tambahkan event listener untuk perubahan account
          window.ethereum.on("accountsChanged", (newAccounts) => {
            if (newAccounts.length === 0) {
              this.isWalletConnected = false;
              this.walletAddress = null;
            } else {
              this.walletAddress = newAccounts[0];
            }
            this.showWalletStatus($container);
          });
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        this.showMessage($container, "Failed to connect wallet", false);
      }
    }

    /**
     * Menampilkan status wallet
     *
     * @param {jQuery} $container - Container CAPTCHA
     */
    showWalletStatus($container) {
      const $walletStatus = $container.find(".web3-captcha-wallet-status");

      if (this.isWalletConnected) {
        const shortAddress =
          this.walletAddress.substring(0, 6) +
          "..." +
          this.walletAddress.substring(this.walletAddress.length - 4);
        $walletStatus.html(`<p>Connected: ${shortAddress}</p>`);
      } else {
        $walletStatus.html(`
                    <div class="web3-captcha-wallet-required">
                        <p>${web3CaptchaParams.i18n.walletRequired}</p>
                        <button type="button" class="web3-captcha-connect-btn">${web3CaptchaParams.i18n.connectWallet}</button>
                    </div>
                `);

        $container.find(".web3-captcha-connect-btn").on("click", () => {
          this.connectWallet($container);
        });
      }
    }

    /**
     * Membuat nonce untuk keamanan AJAX
     *
     * @returns {string} Nonce
     */
    createNonce() {
      // Dalam implementasi produksi, gunakan nonce dari WordPress
      // Untuk demo, kita generate dummy nonce
      return "web3_captcha_" + Math.random().toString(36).substring(2, 15);
    }
  }

  // Inisialisasi Web3 CAPTCHA ketika DOM ready
  $(document).ready(function () {
    new Web3CaptchaHandler();
  });
})(jQuery);
