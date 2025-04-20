<?php
/**
 * Class Web3 CAPTCHA Validator
 * Kelas ini mengelola validasi dan verifikasi CAPTCHA
 */

// Keamanan: Mencegah akses langsung
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Web3_Captcha_Validator
 * 
 * Kelas ini bertanggung jawab untuk:
 * 1. Memverifikasi solusi CAPTCHA
 * 2. Menghasilkan dan memverifikasi bukti zero-knowledge
 * 3. Terhubung ke blockchain untuk validasi
 * 4. Mengelola transaksi hadiah token
 */
class Web3_Captcha_Validator {
    /**
     * Instance plugin (Singleton)
     *
     * @var Web3_Captcha_Validator
     */
    private static $instance = null;

    /**
     * Kontrak CAPTCHA
     *
     * @var string
     */
    private $captcha_contract;

    /**
     * Kontrak token
     *
     * @var string
     */
    private $token_contract;

    /**
     * Jaringan blockchain
     *
     * @var string
     */
    private $network;

    /**
     * URL provider RPC
     *
     * @var string
     */
    private $rpc_provider;

    /**
     * Pengaturan plugin
     *
     * @var array
     */
    private $settings;

    /**
     * Mendapatkan instance validator
     *
     * @return Web3_Captcha_Validator
     */
    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Konstruktor
     */
    private function __construct() {
        // Memuat pengaturan
        $this->settings = get_option('web3_captcha_settings', array());
        
        // Menyimpan alamat kontrak dan pengaturan network
        $this->captcha_contract = isset($this->settings['contract_address']) ? sanitize_text_field($this->settings['contract_address']) : '';
        $this->token_contract = isset($this->settings['token_contract_address']) ? sanitize_text_field($this->settings['token_contract_address']) : '';
        $this->network = isset($this->settings['network']) ? sanitize_text_field($this->settings['network']) : 'goerli';
        $this->rpc_provider = isset($this->settings['rpc_provider']) ? sanitize_text_field($this->settings['rpc_provider']) : '';
        
        // Mengatur hook untuk AJAX
        add_action('wp_ajax_web3_captcha_verify', array($this, 'ajax_verify_captcha'));
        add_action('wp_ajax_nopriv_web3_captcha_verify', array($this, 'ajax_verify_captcha'));
        
        add_action('wp_ajax_web3_captcha_get_puzzle', array($this, 'ajax_get_puzzle'));
        add_action('wp_ajax_nopriv_web3_captcha_get_puzzle', array($this, 'ajax_get_puzzle'));
        
        add_action('wp_ajax_web3_captcha_claim_reward', array($this, 'ajax_claim_reward'));
        add_action('wp_ajax_nopriv_web3_captcha_claim_reward', array($this, 'ajax_claim_reward'));
    }

    /**
     * Memverifikasi solusi CAPTCHA melalui AJAX
     */
    public function ajax_verify_captcha() {
        // Verifikasi nonce keamanan
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field($_POST['nonce']), 'web3_captcha_nonce')) {
            wp_send_json_error(array(
                'message' => __('Kesalahan keamanan. Silakan muat ulang halaman.', 'web3-captcha')
            ));
            exit;
        }
        
        // Memperoleh data dari request
        $puzzle_id = isset($_POST['puzzleId']) ? sanitize_text_field($_POST['puzzleId']) : '';
        $solution = isset($_POST['solution']) ? sanitize_text_field($_POST['solution']) : '';
        $wallet_address = isset($_POST['walletAddress']) ? sanitize_text_field($_POST['walletAddress']) : '';
        
        if (empty($puzzle_id) || empty($solution)) {
            wp_send_json_error(array(
                'message' => __('Data permintaan tidak lengkap.', 'web3-captcha')
            ));
            exit;
        }
        
        // Verifikasi solusi
        // Di implementasi produksi, di sini kita akan melakukan validasi ke blockchain
        // Untuk demonstrasi, kita melakukan verifikasi sederhana
        $verification_result = $this->verify_solution($puzzle_id, $solution);
        
        if ($verification_result['success']) {
            // Jika berhasil, kita dapat memproses hadiah token
            $reward_processed = false;
            
            if (!empty($wallet_address) && !empty($this->token_contract)) {
                $reward_processed = $this->process_token_reward($wallet_address);
            }
            
            wp_send_json_success(array(
                'message' => __('Verifikasi berhasil!', 'web3-captcha'),
                'rewardProcessed' => $reward_processed,
                'proof' => isset($verification_result['proof']) ? $verification_result['proof'] : null
            ));
        } else {
            wp_send_json_error(array(
                'message' => __('Verifikasi gagal. Solusi tidak valid.', 'web3-captcha')
            ));
        }
        
        exit; // Pastikan untuk keluar setelah mengirim respons JSON
    }
    
    /**
     * Memperoleh puzzle CAPTCHA melalui AJAX
     */
    public function ajax_get_puzzle() {
        // Verifikasi nonce keamanan
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field($_POST['nonce']), 'web3_captcha_nonce')) {
            wp_send_json_error(array(
                'message' => __('Kesalahan keamanan. Silakan muat ulang halaman.', 'web3-captcha')
            ));
            exit;
        }
        
        // Pengaturan untuk tipe dan tingkat kesulitan
        $puzzle_type = isset($this->settings['puzzle_type']) ? sanitize_text_field($this->settings['puzzle_type']) : 'image';
        $difficulty = isset($this->settings['difficulty']) ? sanitize_text_field($this->settings['difficulty']) : 'medium';
        
        // Type dari request (jika ada)
        if (isset($_POST['type']) && !empty($_POST['type'])) {
            $puzzle_type = sanitize_text_field($_POST['type']);
        }
        
        // Di implementasi produksi, di sini kita akan mendapatkan puzzle dari blockchain
        // Untuk demonstrasi, kita menghasilkan puzzle sederhana
        $puzzle = $this->generate_demo_puzzle($puzzle_type, $difficulty);
        
        wp_send_json_success(array(
            'puzzle' => $puzzle
        ));
        
        exit; // Pastikan untuk keluar setelah mengirim respons JSON
    }
    
    /**
     * Mengklaim hadiah token melalui AJAX
     */
    public function ajax_claim_reward() {
        // Verifikasi nonce keamanan
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field($_POST['nonce']), 'web3_captcha_nonce')) {
            wp_send_json_error(array(
                'message' => __('Kesalahan keamanan. Silakan muat ulang halaman.', 'web3-captcha')
            ));
            exit;
        }
        
        // Memperoleh data dari request
        $wallet_address = isset($_POST['walletAddress']) ? sanitize_text_field($_POST['walletAddress']) : '';
        $proof = isset($_POST['proof']) ? sanitize_text_field($_POST['proof']) : '';
        
        if (empty($wallet_address) || empty($proof)) {
            wp_send_json_error(array(
                'message' => __('Data permintaan tidak lengkap.', 'web3-captcha')
            ));
            exit;
        }
        
        // Di implementasi produksi, di sini kita akan melakukan transaksi blockchain
        // Untuk demonstrasi, kita hanya simulasikan pengiriman token
        $reward_result = $this->process_token_reward($wallet_address);
        
        if ($reward_result) {
            wp_send_json_success(array(
                'message' => __('Hadiah token berhasil diklaim!', 'web3-captcha')
            ));
        } else {
            wp_send_json_error(array(
                'message' => __('Gagal mengklaim hadiah token.', 'web3-captcha')
            ));
        }
        
        exit; // Pastikan untuk keluar setelah mengirim respons JSON
    }
    
    /**
     * Verifikasi solusi CAPTCHA
     *
     * @param string $puzzle_id ID puzzle
     * @param string $solution Solusi yang dimasukkan pengguna
     * @return array Hasil verifikasi
     */
    private function verify_solution($puzzle_id, $solution) {
        // Di implementasi produksi, ini akan terkoneksi ke blockchain
        // Untuk demonstrasi, kita gunakan logika sederhana
        
        // Memeriksa apakah puzzle ID dimulai dengan:
        // 'pm' = math puzzle, solusi tepat
        // 'pt' = text puzzle, solusi tepat
        // 'pi' = image puzzle, minimal 4 karakter
        // 'pa' = audio puzzle, minimal 3 karakter
        
        $puzzle_type = substr($puzzle_id, 0, 2);
        $is_valid = false;
        
        switch ($puzzle_type) {
            case 'pm': // Math
                // Untuk demo, kita asumsikan puzzle ID berisi jawaban setelah "_"
                $parts = explode('_', $puzzle_id);
                if (count($parts) >= 2) {
                    $expected = $parts[1];
                    $is_valid = ($solution === $expected);
                }
                break;
                
            case 'pt': // Text
                // Untuk demo, kita asumsikan puzzle ID berisi jawaban setelah "_"
                $parts = explode('_', $puzzle_id);
                if (count($parts) >= 2) {
                    $expected = $parts[1];
                    $is_valid = (strtolower($solution) === strtolower($expected));
                }
                break;
                
            case 'pi': // Image
                $is_valid = (strlen($solution) >= 4);
                break;
                
            case 'pa': // Audio
                $is_valid = (strlen($solution) >= 3);
                break;
                
            default:
                // Untuk demo, terima solusi dengan panjang >= 3
                $is_valid = (strlen($solution) >= 3);
        }
        
        // Buat proof dummy untuk demo
        $proof = '';
        if ($is_valid) {
            $proof = 'proof_' . md5($puzzle_id . $solution . microtime());
        }
        
        return array(
            'success' => $is_valid,
            'proof' => $proof
        );
    }
    
    /**
     * Memproses hadiah token
     *
     * @param string $wallet_address Alamat wallet pengguna
     * @return bool Sukses atau tidak
     */
    private function process_token_reward($wallet_address) {
        // Di implementasi produksi, di sini kita akan berinteraksi dengan smart contract
        // untuk mentransfer token ke alamat wallet pengguna
        
        // Mendapatkan jumlah hadiah dari pengaturan
        $reward_amount = isset($this->settings['reward_amount']) ? floatval($this->settings['reward_amount']) : 1;
        
        // Simulasi proses reward
        // Dalam implementasi nyata, ini akan memanggil kontrak token ERC-20
        
        // Catat log reward (untuk demo)
        $this->log_reward($wallet_address, $reward_amount);
        
        return true; // Asumsikan selalu berhasil untuk demo
    }
    
    /**
     * Mencatat log hadiah (hanya untuk demo)
     *
     * @param string $wallet_address Alamat wallet
     * @param float $amount Jumlah token
     */
    private function log_reward($wallet_address, $amount) {
        if (!defined('WEB3_CAPTCHA_PATH')) {
            return;
        }
        
        $log_file = WEB3_CAPTCHA_PATH . 'cache/rewards.log';
        
        // Pastikan direktori cache ada
        $cache_dir = WEB3_CAPTCHA_PATH . 'cache';
        if (!file_exists($cache_dir) && function_exists('wp_mkdir_p')) {
            wp_mkdir_p($cache_dir);
        }
        
        // Catat hanya jika direktori ada dan dapat ditulis
        if (is_dir($cache_dir) && is_writable($cache_dir)) {
            $log_entry = date('Y-m-d H:i:s') . " | Wallet: " . $wallet_address . " | Amount: " . $amount . "\n";
            @file_put_contents($log_file, $log_entry, FILE_APPEND);
        }
    }
    
    /**
     * Menghasilkan puzzle demo
     *
     * @param string $type Tipe puzzle
     * @param string $difficulty Tingkat kesulitan
     * @return array Data puzzle
     */
    private function generate_demo_puzzle($type, $difficulty) {
        $puzzle_id = '';
        $data = '';
        $instruction = '';
        
        // Validasi input
        $type = in_array($type, array('image', 'math', 'text', 'audio', '0', '1', '2', '3')) ? $type : 'image';
        $difficulty = in_array($difficulty, array('easy', 'medium', 'hard')) ? $difficulty : 'medium';
        
        switch ($type) {
            case 'math':
            case '1':
                // Matematika: Operasi aritmatika sederhana
                $num1 = mt_rand(1, ($difficulty === 'easy' ? 10 : ($difficulty === 'medium' ? 20 : 50)));
                $num2 = mt_rand(1, ($difficulty === 'easy' ? 10 : ($difficulty === 'medium' ? 20 : 50)));
                $operation = $difficulty === 'easy' ? '+' : ($difficulty === 'medium' ? array('+', '-')[mt_rand(0, 1)] : array('+', '-', '*')[mt_rand(0, 2)]);
                
                $solution = '';
                switch ($operation) {
                    case '+': $solution = $num1 + $num2; break;
                    case '-': $solution = $num1 - $num2; break;
                    case '*': $solution = $num1 * $num2; break;
                }
                
                $puzzle_id = 'pm_' . $solution;
                $data = "{$num1} {$operation} {$num2} = ?";
                $instruction = __('Hitung hasil dari operasi matematika berikut', 'web3-captcha');
                break;
                
            case 'text':
            case '2':
                // Teks: Pertanyaan sederhana
                $questions = array(
                    'easy' => array(
                        array('Apa warna langit di siang hari?', 'biru'),
                        array('Berapa jumlah hari dalam seminggu?', '7'),
                        array('Apa nama planet kita?', 'bumi')
                    ),
                    'medium' => array(
                        array('Berapa hasil dari 3 pangkat 2 ditambah 5?', '14'),
                        array('Apa ibukota Indonesia?', 'jakarta'),
                        array('Berapa jumlah sisi pada kubus?', '6')
                    ),
                    'hard' => array(
                        array('Jika 2x + 3 = 7, berapakah nilai x?', '2'),
                        array('Unsur kimia apa yang dilambangkan dengan H?', 'hidrogen'),
                        array('Apa nama benua terbesar di dunia?', 'asia')
                    )
                );
                
                $question_set = isset($questions[$difficulty]) ? $questions[$difficulty] : $questions['medium'];
                $question_idx = mt_rand(0, count($question_set) - 1);
                
                $puzzle_id = 'pt_' . $question_set[$question_idx][1];
                $data = $question_set[$question_idx][0];
                $instruction = __('Jawab pertanyaan berikut', 'web3-captcha');
                break;
                
            case 'audio':
            case '3':
                // Audio: URL ke file audio (dummy untuk demo)
                $puzzle_id = 'pa_' . md5(microtime());
                $data = 'https://example.com/captcha-audio-' . $difficulty . '.mp3';
                $instruction = __('Dengarkan dan ketik kata yang diucapkan', 'web3-captcha');
                break;
                
            case 'image':
            case '0':
            default:
                // Gambar: URL ke gambar (dummy untuk demo)
                $puzzle_id = 'pi_' . md5(microtime());
                $data = 'https://via.placeholder.com/300x100.png?text=CAPTCHA+' . ucfirst($difficulty);
                $instruction = __('Ketik teks yang terlihat pada gambar', 'web3-captcha');
                break;
        }
        
        return array(
            'id' => $puzzle_id,
            'type' => $this->get_numeric_type($type),
            'data' => $data,
            'instruction' => $instruction,
            'difficulty' => $difficulty
        );
    }
    
    /**
     * Mendapatkan tipe numerik dari string
     *
     * @param string $type Tipe puzzle (string atau numerik)
     * @return int Tipe numerik
     */
    private function get_numeric_type($type) {
        switch ($type) {
            case 'image': return 0;
            case 'math': return 1;
            case 'text': return 2;
            case 'audio': return 3;
            case '0': case '1': case '2': case '3': return intval($type);
            default: return 0; // Default ke image
        }
    }
    
    /**
     * Menghasilkan bukti zero-knowledge (dummy untuk demo)
     *
     * @param string $puzzle_id ID puzzle
     * @param string $solution Solusi yang dimasukkan
     * @return string Proof string
     */
    private function generate_proof($puzzle_id, $solution) {
        // Di implementasi produksi, ini akan menggunakan library zk-SNARKs
        // Untuk demo, kita hanya buat string hash
        return 'zk_proof_' . md5($puzzle_id . $solution . microtime());
    }
}

// Inisialisasi validator
function web3_captcha_validator() {
    return Web3_Captcha_Validator::get_instance();
}

// Mulai validator
web3_captcha_validator(); 