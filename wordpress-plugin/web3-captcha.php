<?php

if (!defined('ABSPATH')) {
    exit;
}

// Konstanta plugin
define('WEB3_CAPTCHA_VERSION', '1.0.0');
define('WEB3_CAPTCHA_PATH', plugin_dir_path(__FILE__));
define('WEB3_CAPTCHA_URL', plugin_dir_url(__FILE__));
define('WEB3_CAPTCHA_BASENAME', plugin_basename(__FILE__));

/**
 * Class Web3_Captcha
 * Class utama untuk plugin Web3 CAPTCHA
 */
class Web3_Captcha {
    /**
     * Instance plugin (Singleton)
     *
     * @var Web3_Captcha
     */
    private static $instance = null;

    /**
     * Pengaturan plugin
     *
     * @var array
     */
    private $settings;

    /**
     * Mendapatkan instance plugin
     *
     * @return Web3_Captcha
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

        // Hook plugin
        $this->hooks();

        // Memuat class dan file yang diperlukan
        $this->load_dependencies();
    }

    /**
     * Mendaftarkan hook WordPress
     */
    private function hooks() {
        // Action untuk inisialisasi plugin
        add_action('plugins_loaded', array($this, 'load_textdomain'));
        
        // Hook untuk menambahkan script dan style
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));

        // Filter dan action untuk form WordPress
        $this->setup_form_hooks();

        // Daftarkan shortcode
        add_shortcode('web3_captcha', array($this, 'shortcode_callback'));

        // Hook aktivasi, deaktivasi, dan uninstall
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }

    /**
     * Memuat file dan class yang diperlukan
     */
    private function load_dependencies() {
        // Admin
        if (is_admin()) {
            require_once WEB3_CAPTCHA_PATH . 'admin/settings-page.php';
        }

        // Includes
        if (file_exists(WEB3_CAPTCHA_PATH . 'includes/class-web3-captcha-validator.php')) {
            require_once WEB3_CAPTCHA_PATH . 'includes/class-web3-captcha-validator.php';
        } else {
            // Menambahkan notice jika file tidak ditemukan
            add_action('admin_notices', function() {
                echo '<div class="error"><p>';
                echo esc_html__('Web3 CAPTCHA: File validator tidak ditemukan. Plugin mungkin tidak berfungsi dengan benar.', 'web3-captcha');
                echo '</p></div>';
            });
        }
    }

    /**
     * Memuat file terjemahan
     */
    public function load_textdomain() {
        load_plugin_textdomain('web3-captcha', false, dirname(WEB3_CAPTCHA_BASENAME) . '/languages');
    }

    /**
     * Menyiapkan hook untuk form WordPress
     */
    private function setup_form_hooks() {
        // Form login
        if (isset($this->settings['enable_login']) && $this->settings['enable_login']) {
            add_action('login_form', array($this, 'add_captcha_to_login'));
            add_filter('authenticate', array($this, 'verify_login_captcha'), 10, 3);
        }

        // Form registrasi
        if (isset($this->settings['enable_register']) && $this->settings['enable_register']) {
            add_action('register_form', array($this, 'add_captcha_to_register'));
            add_filter('registration_errors', array($this, 'verify_register_captcha'), 10, 3);
        }

        // Form komentar
        if (isset($this->settings['enable_comment']) && $this->settings['enable_comment']) {
            add_action('comment_form_after_fields', array($this, 'add_captcha_to_comment'));
            add_filter('preprocess_comment', array($this, 'verify_comment_captcha'));
        }

        // Form reset password
        if (isset($this->settings['enable_password_reset']) && $this->settings['enable_password_reset']) {
            add_action('lostpassword_form', array($this, 'add_captcha_to_lostpassword'));
            add_filter('lostpassword_post', array($this, 'verify_lostpassword_captcha'));
        }

        // WooCommerce Checkout
        if (isset($this->settings['enable_woocommerce_checkout']) && $this->settings['enable_woocommerce_checkout'] && class_exists('WooCommerce')) {
            add_action('woocommerce_after_checkout_billing_form', array($this, 'add_captcha_to_woocommerce_checkout'));
            add_action('woocommerce_checkout_process', array($this, 'verify_woocommerce_checkout_captcha'));
        }
    }

    /**
     * Mendaftarkan script dan style frontend
     */
    public function enqueue_scripts() {
        // Jalur file CSS dan JS
        $css_file = WEB3_CAPTCHA_URL . 'assets/css/web3-captcha.css';
        $js_file = WEB3_CAPTCHA_URL . 'assets/js/web3-captcha.js';
        
        // Periksa apakah file ada
        $css_path = WEB3_CAPTCHA_PATH . 'assets/css/web3-captcha.css';
        $js_path = WEB3_CAPTCHA_PATH . 'assets/js/web3-captcha.js';
        
        // Mendaftarkan dan menambahkan CSS jika ada
        if (file_exists($css_path)) {
            wp_register_style(
                'web3-captcha-style',
                $css_file,
                array(),
                WEB3_CAPTCHA_VERSION
            );
            wp_enqueue_style('web3-captcha-style');
        }

        // Mendaftarkan dan menambahkan JavaScript utama jika ada
        if (file_exists($js_path)) {
            wp_register_script(
                'web3-captcha-script',
                $js_file,
                array('jquery'),
                WEB3_CAPTCHA_VERSION,
                true
            );

            // Menyiapkan data localization untuk JavaScript
            $localized_data = array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'contractAddress' => isset($this->settings['contract_address']) ? $this->settings['contract_address'] : '',
                'tokenContractAddress' => isset($this->settings['token_contract_address']) ? $this->settings['token_contract_address'] : '',
                'network' => isset($this->settings['network']) ? $this->settings['network'] : 'goerli',
                'rpcProvider' => isset($this->settings['rpc_provider']) ? $this->settings['rpc_provider'] : '',
                'puzzleType' => isset($this->settings['puzzle_type']) ? $this->settings['puzzle_type'] : 'image',
                'difficulty' => isset($this->settings['difficulty']) ? $this->settings['difficulty'] : 'medium',
                'theme' => isset($this->settings['theme']) ? $this->settings['theme'] : 'light',
                'size' => isset($this->settings['size']) ? $this->settings['size'] : 'normal',
                'rewardAmount' => isset($this->settings['reward_amount']) ? $this->settings['reward_amount'] : '1',
                'nonce' => wp_create_nonce('web3_captcha_nonce'),
                'i18n' => array(
                    'verifyHuman' => __('Verifikasi Anda adalah Manusia', 'web3-captcha'),
                    'loadingPuzzle' => __('Memuat puzzle...', 'web3-captcha'),
                    'walletRequired' => __('Wallet Ethereum diperlukan untuk verifikasi', 'web3-captcha'),
                    'connectWallet' => __('Hubungkan Wallet', 'web3-captcha'),
                    'enterSolution' => __('Masukkan solusi di sini', 'web3-captcha'),
                    'verify' => __('Verifikasi', 'web3-captcha'),
                    'poweredBy' => __('Didukung oleh Web3 CAPTCHA', 'web3-captcha'),
                    'verificationSuccess' => __('Verifikasi berhasil! Anda mendapatkan token.', 'web3-captcha'),
                    'verificationFailed' => __('Verifikasi gagal. Silakan coba lagi.', 'web3-captcha'),
                    'invalidCaptcha' => __('Mohon selesaikan CAPTCHA terlebih dahulu.', 'web3-captcha'),
                ),
            );

            wp_localize_script('web3-captcha-script', 'web3CaptchaParams', $localized_data);
            wp_enqueue_script('web3-captcha-script');
        } else {
            // Log error jika file JS tidak ditemukan
            error_log('Web3 CAPTCHA: File JavaScript tidak ditemukan: ' . $js_path);
        }
    }

    /**
     * Mendaftarkan script dan style admin
     */
    public function admin_enqueue_scripts($hook) {
        // Hanya muat di halaman admin plugin ini
        if ('toplevel_page_web3-captcha-settings' !== $hook) {
            return;
        }

        // Path file CSS admin
        $admin_css_file = WEB3_CAPTCHA_URL . 'admin/styles.css';
        $admin_css_path = WEB3_CAPTCHA_PATH . 'admin/styles.css';

        // Mendaftarkan dan menambahkan CSS admin jika ada
        if (file_exists($admin_css_path)) {
            wp_register_style(
                'web3-captcha-admin-style',
                $admin_css_file,
                array(),
                WEB3_CAPTCHA_VERSION
            );
            wp_enqueue_style('web3-captcha-admin-style');
        } else {
            // Log error jika file admin CSS tidak ditemukan
            error_log('Web3 CAPTCHA: File admin CSS tidak ditemukan: ' . $admin_css_path);
        }
    }

    /**
     * Menambahkan CAPTCHA ke form login
     */
    public function add_captcha_to_login() {
        $this->render_captcha('login');
    }

    /**
     * Menambahkan CAPTCHA ke form registrasi
     */
    public function add_captcha_to_register() {
        $this->render_captcha('register');
    }

    /**
     * Menambahkan CAPTCHA ke form komentar
     */
    public function add_captcha_to_comment() {
        // Lewati jika pengguna sudah login (opsional)
        if (is_user_logged_in() && !isset($this->settings['enable_comment_for_logged_in'])) {
            return;
        }
        $this->render_captcha('comment');
    }

    /**
     * Menambahkan CAPTCHA ke form reset password
     */
    public function add_captcha_to_lostpassword() {
        $this->render_captcha('lostpassword');
    }

    /**
     * Menambahkan CAPTCHA ke form checkout WooCommerce
     * 
     * @param WC_Checkout $checkout Objek checkout WooCommerce
     */
    public function add_captcha_to_woocommerce_checkout($checkout) {
        // Lewati jika pengguna sudah login (opsional)
        if (is_user_logged_in() && !isset($this->settings['enable_checkout_for_logged_in'])) {
            return;
        }
        $this->render_captcha('woocommerce_checkout');
    }

    /**
     * Render CAPTCHA
     * 
     * @param string $form_type Tipe form tempat CAPTCHA ditampilkan
     */
    public function render_captcha($form_type) {
        $container_id = 'web3-captcha-' . $form_type;
        ?>
        <div class="web3-captcha-container">
            <div id="<?php echo esc_attr($container_id); ?>"></div>
        </div>
        <?php
    }

    /**
     * Fungsi untuk verifikasi CAPTCHA
     * @return bool True jika CAPTCHA diverifikasi, false jika tidak
     */
    public function verify_captcha() {
        // Cek apakah CAPTCHA sudah diverifikasi
        if (
            isset($_POST['web3_captcha_verified']) && 
            sanitize_text_field($_POST['web3_captcha_verified']) === 'true'
        ) {
            return true;
        }
        
        return false;
    }

    /**
     * Verifikasi CAPTCHA di form login
     * 
     * @param WP_User|WP_Error $user User atau error object
     * @param string $username Username dari form login
     * @param string $password Password dari form login
     * @return WP_User|WP_Error User jika verifikasi berhasil, error jika gagal
     */
    public function verify_login_captcha($user, $username, $password) {
        // Jangan verifikasi jika username atau password kosong
        if (empty($username) || empty($password)) {
            return $user;
        }

        // Jangan verifikasi jika sudah ada error
        if (is_wp_error($user)) {
            return $user;
        }

        // Verifikasi CAPTCHA
        if (!$this->verify_captcha()) {
            return new WP_Error('captcha_invalid', __('Error: Mohon selesaikan CAPTCHA terlebih dahulu.', 'web3-captcha'));
        }

        return $user;
    }

    /**
     * Verifikasi CAPTCHA di form registrasi
     * 
     * @param WP_Error $errors Error object
     * @param string $sanitized_user_login Username yang telah disanitasi
     * @param string $user_email Email user
     * @return WP_Error Error object dengan error tambahan jika verifikasi gagal
     */
    public function verify_register_captcha($errors, $sanitized_user_login, $user_email) {
        // Verifikasi CAPTCHA
        if (!$this->verify_captcha()) {
            $errors->add('captcha_invalid', __('Error: Mohon selesaikan CAPTCHA terlebih dahulu.', 'web3-captcha'));
        }

        return $errors;
    }

    /**
     * Verifikasi CAPTCHA di form komentar
     * 
     * @param array $commentdata Data komentar
     * @return array Data komentar jika verifikasi berhasil
     */
    public function verify_comment_captcha($commentdata) {
        // Lewati jika pengguna sudah login (opsional)
        if (is_user_logged_in() && !isset($this->settings['enable_comment_for_logged_in'])) {
            return $commentdata;
        }

        // Verifikasi CAPTCHA
        if (!$this->verify_captcha()) {
            wp_die(
                __('Error: Mohon selesaikan CAPTCHA terlebih dahulu.', 'web3-captcha'),
                __('CAPTCHA Tidak Valid', 'web3-captcha'),
                array('back_link' => true)
            );
        }

        return $commentdata;
    }

    /**
     * Verifikasi CAPTCHA di form reset password
     */
    public function verify_lostpassword_captcha() {
        // Verifikasi CAPTCHA
        if (!$this->verify_captcha()) {
            wp_die(
                __('Error: Mohon selesaikan CAPTCHA terlebih dahulu.', 'web3-captcha'),
                __('CAPTCHA Tidak Valid', 'web3-captcha'),
                array('back_link' => true)
            );
        }
    }

    /**
     * Verifikasi CAPTCHA di form checkout WooCommerce
     */
    public function verify_woocommerce_checkout_captcha() {
        // Lewati jika pengguna sudah login (opsional)
        if (is_user_logged_in() && !isset($this->settings['enable_checkout_for_logged_in'])) {
            return;
        }

        // Verifikasi CAPTCHA
        if (!$this->verify_captcha() && function_exists('wc_add_notice')) {
            wc_add_notice(__('Error: Mohon selesaikan CAPTCHA terlebih dahulu.', 'web3-captcha'), 'error');
        }
    }

    /**
     * Callback untuk shortcode
     * 
     * @param array $atts Atribut yang diberikan pada shortcode
     * @return string HTML untuk CAPTCHA widget
     */
    public function shortcode_callback($atts) {
        // Ekstrak atribut shortcode dengan nilai default
        $atts = shortcode_atts(
            array(
                'theme' => isset($this->settings['theme']) ? $this->settings['theme'] : 'light',
                'size' => isset($this->settings['size']) ? $this->settings['size'] : 'normal',
                'puzzle_type' => isset($this->settings['puzzle_type']) ? $this->settings['puzzle_type'] : 'image',
            ),
            $atts,
            'web3_captcha'
        );

        // Buat ID unik untuk container
        $container_id = 'web3-captcha-shortcode-' . wp_rand(1000, 9999);

        // Mulai output buffering
        ob_start();
        ?>
        <div class="web3-captcha-container">
            <div id="<?php echo esc_attr($container_id); ?>" 
                 data-theme="<?php echo esc_attr($atts['theme']); ?>"
                 data-size="<?php echo esc_attr($atts['size']); ?>"
                 data-puzzle-type="<?php echo esc_attr($atts['puzzle_type']); ?>">
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Aktivasi plugin
     */
    public function activate() {
        // Pengaturan default jika belum ada
        if (false === get_option('web3_captcha_settings')) {
            $default_settings = array(
                'contract_address' => '',
                'token_contract_address' => '',
                'network' => 'goerli',
                'puzzle_type' => 'image',
                'difficulty' => 'medium',
                'theme' => 'light',
                'size' => 'normal',
                'reward_amount' => '1',
                'enable_login' => false,
                'enable_register' => false,
                'enable_comment' => false,
                'enable_password_reset' => false,
                'enable_woocommerce_checkout' => false,
            );
            update_option('web3_captcha_settings', $default_settings);
        }

        // Buat folder cache jika diperlukan
        $cache_dir = WEB3_CAPTCHA_PATH . 'cache';
        if (!file_exists($cache_dir) && function_exists('wp_mkdir_p')) {
            wp_mkdir_p($cache_dir);
        }

        // Tambahkan file .htaccess untuk keamanan
        $htaccess_file = $cache_dir . '/.htaccess';
        if (!file_exists($htaccess_file) && is_writable($cache_dir)) {
            $htaccess_content = "# Deny direct access to files\n";
            $htaccess_content .= "<FilesMatch '\\.(json)$'>\n";
            $htaccess_content .= "Order Deny,Allow\n";
            $htaccess_content .= "Deny from all\n";
            $htaccess_content .= "</FilesMatch>\n";
            @file_put_contents($htaccess_file, $htaccess_content);
        }

        // Tambahkan juga file index.php kosong
        $index_file = $cache_dir . '/index.php';
        if (!file_exists($index_file) && is_writable($cache_dir)) {
            @file_put_contents($index_file, '<?php // Silence is golden');
        }

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Deaktivasi plugin
     */
    public function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();
    }
}

// Inisialisasi plugin
function web3_captcha() {
    return Web3_Captcha::get_instance();
}

// Mulai plugin
web3_captcha();

/**
 * Helper function untuk menampilkan CAPTCHA
 * 
 * @param string $form_type Opsional. Tipe form untuk CAPTCHA
 */
function web3_captcha_display($form_type = 'custom') {
    $plugin = web3_captcha();
    $plugin->render_captcha($form_type);
}

/**
 * Helper function untuk memverifikasi CAPTCHA
 * 
 * @return bool True jika CAPTCHA diverifikasi, false jika tidak
 */
function web3_captcha_verify() {
    $plugin = web3_captcha();
    return $plugin->verify_captcha();
}
