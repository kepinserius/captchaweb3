<?php
/**
 * Halaman pengaturan admin untuk Web3 CAPTCHA
 */

// Keamanan: Mencegah akses langsung
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Web3_Captcha_Settings
 * Mengelola semua fungsionalitas halaman pengaturan admin
 */
class Web3_Captcha_Settings {
    /**
     * Inisialisasi class
     */
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    /**
     * Menambahkan menu admin
     */
    public function add_admin_menu() {
        add_menu_page(
            'Web3 CAPTCHA', 
            'Web3 CAPTCHA', 
            'manage_options', 
            'web3-captcha-settings', 
            array($this, 'display_settings_page'),
            'dashicons-shield',
            81
        );
    }

    /**
     * Mendaftarkan pengaturan
     */
    public function register_settings() {
        // Bagian pengaturan umum
        add_settings_section(
            'web3_captcha_general_section',
            __('Pengaturan Umum', 'web3-captcha'),
            array($this, 'general_section_callback'),
            'web3-captcha-settings'
        );

        // Bagian pengaturan integrasi
        add_settings_section(
            'web3_captcha_integration_section',
            __('Integrasi', 'web3-captcha'),
            array($this, 'integration_section_callback'),
            'web3-captcha-settings'
        );

        // Bagian pengaturan tampilan
        add_settings_section(
            'web3_captcha_appearance_section',
            __('Tampilan', 'web3-captcha'),
            array($this, 'appearance_section_callback'),
            'web3-captcha-settings'
        );

        // Bagian pengaturan Web3
        add_settings_section(
            'web3_captcha_blockchain_section',
            __('Pengaturan Blockchain', 'web3-captcha'),
            array($this, 'blockchain_section_callback'),
            'web3-captcha-settings'
        );

        // Pengaturan umum
        register_setting('web3-captcha-settings', 'web3_captcha_settings');

        // Field alamat kontrak
        add_settings_field(
            'contract_address',
            __('Alamat Kontrak CAPTCHA', 'web3-captcha'),
            array($this, 'contract_address_callback'),
            'web3-captcha-settings',
            'web3_captcha_blockchain_section',
            array('label_for' => 'contract_address')
        );

        // Field alamat kontrak token
        add_settings_field(
            'token_contract_address',
            __('Alamat Kontrak Token', 'web3-captcha'),
            array($this, 'token_contract_address_callback'),
            'web3-captcha-settings',
            'web3_captcha_blockchain_section',
            array('label_for' => 'token_contract_address')
        );

        // Field jaringan
        add_settings_field(
            'network',
            __('Jaringan Blockchain', 'web3-captcha'),
            array($this, 'network_callback'),
            'web3-captcha-settings',
            'web3_captcha_blockchain_section',
            array('label_for' => 'network')
        );

        // Field URL provider RPC
        add_settings_field(
            'rpc_provider',
            __('URL Provider RPC', 'web3-captcha'),
            array($this, 'rpc_provider_callback'),
            'web3-captcha-settings',
            'web3_captcha_blockchain_section',
            array('label_for' => 'rpc_provider')
        );

        // Field jumlah hadiah
        add_settings_field(
            'reward_amount',
            __('Jumlah Token Hadiah', 'web3-captcha'),
            array($this, 'reward_amount_callback'),
            'web3-captcha-settings',
            'web3_captcha_blockchain_section',
            array('label_for' => 'reward_amount')
        );

        // Field jenis puzzle CAPTCHA
        add_settings_field(
            'puzzle_type',
            __('Jenis Puzzle CAPTCHA', 'web3-captcha'),
            array($this, 'puzzle_type_callback'),
            'web3-captcha-settings',
            'web3_captcha_general_section',
            array('label_for' => 'puzzle_type')
        );

        // Field kesulitan CAPTCHA
        add_settings_field(
            'difficulty',
            __('Tingkat Kesulitan', 'web3-captcha'),
            array($this, 'difficulty_callback'),
            'web3-captcha-settings',
            'web3_captcha_general_section',
            array('label_for' => 'difficulty')
        );

        // Field aktivasi pada form
        add_settings_field(
            'enable_forms',
            __('Aktifkan pada Form', 'web3-captcha'),
            array($this, 'enable_forms_callback'),
            'web3-captcha-settings',
            'web3_captcha_integration_section'
        );

        // Field tema
        add_settings_field(
            'theme',
            __('Tema', 'web3-captcha'),
            array($this, 'theme_callback'),
            'web3-captcha-settings',
            'web3_captcha_appearance_section',
            array('label_for' => 'theme')
        );

        // Field ukuran
        add_settings_field(
            'size',
            __('Ukuran', 'web3-captcha'),
            array($this, 'size_callback'),
            'web3-captcha-settings',
            'web3_captcha_appearance_section',
            array('label_for' => 'size')
        );
    }

    /**
     * Callback untuk bagian umum
     */
    public function general_section_callback() {
        echo '<p>' . __('Konfigurasikan pengaturan umum untuk Web3 CAPTCHA.', 'web3-captcha') . '</p>';
    }

    /**
     * Callback untuk bagian integrasi
     */
    public function integration_section_callback() {
        echo '<p>' . __('Pilih di mana Web3 CAPTCHA akan ditampilkan di situs Anda.', 'web3-captcha') . '</p>';
    }

    /**
     * Callback untuk bagian tampilan
     */
    public function appearance_section_callback() {
        echo '<p>' . __('Kustomisasi tampilan Web3 CAPTCHA.', 'web3-captcha') . '</p>';
    }

    /**
     * Callback untuk bagian blockchain
     */
    public function blockchain_section_callback() {
        echo '<p>' . __('Konfigurasikan integrasi blockchain untuk Web3 CAPTCHA.', 'web3-captcha') . '</p>';
    }

    /**
     * Callback untuk alamat kontrak
     */
    public function contract_address_callback() {
        $options = get_option('web3_captcha_settings');
        $value = isset($options['contract_address']) ? $options['contract_address'] : '';
        ?>
        <input type="text" id="contract_address" name="web3_captcha_settings[contract_address]" value="<?php echo esc_attr($value); ?>" class="regular-text" />
        <p class="description"><?php _e('Alamat kontrak pintar Web3 CAPTCHA di blockchain.', 'web3-captcha'); ?></p>
        <?php
    }

    /**
     * Callback untuk alamat kontrak token
     */
    public function token_contract_address_callback() {
        $options = get_option('web3_captcha_settings');
        $value = isset($options['token_contract_address']) ? $options['token_contract_address'] : '';
        ?>
        <input type="text" id="token_contract_address" name="web3_captcha_settings[token_contract_address]" value="<?php echo esc_attr($value); ?>" class="regular-text" />
        <p class="description"><?php _e('Alamat kontrak token ERC-20 untuk hadiah.', 'web3-captcha'); ?></p>
        <?php
    }

    /**
     * Callback untuk jaringan
     */
    public function network_callback() {
        $options = get_option('web3_captcha_settings');
        $value = isset($options['network']) ? $options['network'] : 'goerli';
        ?>
        <select id="network" name="web3_captcha_settings[network]">
            <option value="mainnet" <?php selected($value, 'mainnet'); ?>><?php _e('Ethereum Mainnet', 'web3-captcha'); ?></option>
            <option value="goerli" <?php selected($value, 'goerli'); ?>><?php _e('Goerli Testnet', 'web3-captcha'); ?></option>
            <option value="sepolia" <?php selected($value, 'sepolia'); ?>><?php _e('Sepolia Testnet', 'web3-captcha'); ?></option>
            <option value="polygon" <?php selected($value, 'polygon'); ?>><?php _e('Polygon', 'web3-captcha'); ?></option>
            <option value="mumbai" <?php selected($value, 'mumbai'); ?>><?php _e('Mumbai Testnet', 'web3-captcha'); ?></option>
        </select>
        <p class="description"><?php _e('Jaringan blockchain tempat kontrak di-deploy.', 'web3-captcha'); ?></p>
        <?php
    }

    /**
     * Callback untuk URL provider RPC
     */
    public function rpc_provider_callback() {
        $options = get_option('web3_captcha_settings');
        $value = isset($options['rpc_provider']) ? $options['rpc_provider'] : '';
        ?>
        <input type="text" id="rpc_provider" name="web3_captcha_settings[rpc_provider]" value="<?php echo esc_attr($value); ?>" class="regular-text" />
        <p class="description"><?php _e('URL provider RPC untuk terhubung ke blockchain (opsional).', 'web3-captcha'); ?></p>
        <?php
    }

    /**
     * Callback untuk jumlah hadiah
     */
    public function reward_amount_callback() {
        $options = get_option('web3_captcha_settings');
        $value = isset($options['reward_amount']) ? $options['reward_amount'] : '1';
        ?>
        <input type="number" step="0.001" min="0" id="reward_amount" name="web3_captcha_settings[reward_amount]" value="<?php echo esc_attr($value); ?>" class="small-text" />
        <p class="description"><?php _e('Jumlah token yang diberikan sebagai hadiah untuk verifikasi CAPTCHA yang berhasil.', 'web3-captcha'); ?></p>
        <?php
    }

    /**
     * Callback untuk jenis puzzle
     */
    public function puzzle_type_callback() {
        $options = get_option('web3_captcha_settings');
        $value = isset($options['puzzle_type']) ? $options['puzzle_type'] : 'image';
        ?>
        <select id="puzzle_type" name="web3_captcha_settings[puzzle_type]">
            <option value="image" <?php selected($value, 'image'); ?>><?php _e('Gambar', 'web3-captcha'); ?></option>
            <option value="math" <?php selected($value, 'math'); ?>><?php _e('Matematika', 'web3-captcha'); ?></option>
            <option value="text" <?php selected($value, 'text'); ?>><?php _e('Teks', 'web3-captcha'); ?></option>
            <option value="audio" <?php selected($value, 'audio'); ?>><?php _e('Audio', 'web3-captcha'); ?></option>
        </select>
        <p class="description"><?php _e('Jenis puzzle CAPTCHA yang akan ditampilkan kepada pengguna.', 'web3-captcha'); ?></p>
        <?php
    }

    /**
     * Callback untuk tingkat kesulitan
     */
    public function difficulty_callback() {
        $options = get_option('web3_captcha_settings');
        $value = isset($options['difficulty']) ? $options['difficulty'] : 'medium';
        ?>
        <select id="difficulty" name="web3_captcha_settings[difficulty]">
            <option value="easy" <?php selected($value, 'easy'); ?>><?php _e('Mudah', 'web3-captcha'); ?></option>
            <option value="medium" <?php selected($value, 'medium'); ?>><?php _e('Sedang', 'web3-captcha'); ?></option>
            <option value="hard" <?php selected($value, 'hard'); ?>><?php _e('Sulit', 'web3-captcha'); ?></option>
        </select>
        <p class="description"><?php _e('Tingkat kesulitan puzzle CAPTCHA.', 'web3-captcha'); ?></p>
        <?php
    }

    /**
     * Callback untuk aktivasi form
     */
    public function enable_forms_callback() {
        $options = get_option('web3_captcha_settings');
        ?>
        <fieldset>
            <label>
                <input type="checkbox" name="web3_captcha_settings[enable_login]" value="1" <?php checked(isset($options['enable_login']) ? $options['enable_login'] : false); ?> />
                <?php _e('Form Login', 'web3-captcha'); ?>
            </label><br>
            
            <label>
                <input type="checkbox" name="web3_captcha_settings[enable_register]" value="1" <?php checked(isset($options['enable_register']) ? $options['enable_register'] : false); ?> />
                <?php _e('Form Pendaftaran', 'web3-captcha'); ?>
            </label><br>
            
            <label>
                <input type="checkbox" name="web3_captcha_settings[enable_comment]" value="1" <?php checked(isset($options['enable_comment']) ? $options['enable_comment'] : false); ?> />
                <?php _e('Form Komentar', 'web3-captcha'); ?>
            </label><br>
            
            <label>
                <input type="checkbox" name="web3_captcha_settings[enable_password_reset]" value="1" <?php checked(isset($options['enable_password_reset']) ? $options['enable_password_reset'] : false); ?> />
                <?php _e('Form Reset Password', 'web3-captcha'); ?>
            </label><br>
            
            <label>
                <input type="checkbox" name="web3_captcha_settings[enable_woocommerce_checkout]" value="1" <?php checked(isset($options['enable_woocommerce_checkout']) ? $options['enable_woocommerce_checkout'] : false); ?> />
                <?php _e('WooCommerce Checkout', 'web3-captcha'); ?>
            </label>
        </fieldset>
        <p class="description"><?php _e('Pilih form di mana Web3 CAPTCHA akan ditampilkan.', 'web3-captcha'); ?></p>
        <?php
    }

    /**
     * Callback untuk tema
     */
    public function theme_callback() {
        $options = get_option('web3_captcha_settings');
        $value = isset($options['theme']) ? $options['theme'] : 'light';
        ?>
        <select id="theme" name="web3_captcha_settings[theme]">
            <option value="light" <?php selected($value, 'light'); ?>><?php _e('Terang', 'web3-captcha'); ?></option>
            <option value="dark" <?php selected($value, 'dark'); ?>><?php _e('Gelap', 'web3-captcha'); ?></option>
            <option value="auto" <?php selected($value, 'auto'); ?>><?php _e('Otomatis (Mengikuti Tema WordPress)', 'web3-captcha'); ?></option>
        </select>
        <p class="description"><?php _e('Tema untuk widget CAPTCHA.', 'web3-captcha'); ?></p>
        <?php
    }

    /**
     * Callback untuk ukuran
     */
    public function size_callback() {
        $options = get_option('web3_captcha_settings');
        $value = isset($options['size']) ? $options['size'] : 'normal';
        ?>
        <select id="size" name="web3_captcha_settings[size]">
            <option value="compact" <?php selected($value, 'compact'); ?>><?php _e('Kompak', 'web3-captcha'); ?></option>
            <option value="normal" <?php selected($value, 'normal'); ?>><?php _e('Normal', 'web3-captcha'); ?></option>
            <option value="large" <?php selected($value, 'large'); ?>><?php _e('Besar', 'web3-captcha'); ?></option>
        </select>
        <p class="description"><?php _e('Ukuran widget CAPTCHA.', 'web3-captcha'); ?></p>
        <?php
    }

    /**
     * Tampilkan halaman pengaturan
     */
    public function display_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <div class="web3-captcha-admin-header">
                <div class="web3-captcha-logo">
                    <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/images/web3-captcha-logo.png'; ?>" alt="Web3 CAPTCHA Logo" />
                </div>
                <div class="web3-captcha-version">
                    <span><?php echo __('Versi', 'web3-captcha') . ': ' . WEB3_CAPTCHA_VERSION; ?></span>
                </div>
            </div>
            
            <div class="web3-captcha-admin-content">
                <form method="post" action="options.php">
                    <?php
                    settings_fields('web3-captcha-settings');
                    do_settings_sections('web3-captcha-settings');
                    submit_button(__('Simpan Perubahan', 'web3-captcha'));
                    ?>
                </form>
            </div>
            
            <div class="web3-captcha-admin-sidebar">
                <div class="web3-captcha-admin-box">
                    <h3><?php _e('Shortcode', 'web3-captcha'); ?></h3>
                    <p><?php _e('Gunakan shortcode berikut untuk menampilkan Web3 CAPTCHA di halaman atau posting:', 'web3-captcha'); ?></p>
                    <code>[web3_captcha]</code>
                </div>
                
                <div class="web3-captcha-admin-box">
                    <h3><?php _e('Dokumentasi', 'web3-captcha'); ?></h3>
                    <p><?php _e('Untuk informasi lebih lanjut tentang cara menggunakan Web3 CAPTCHA, silakan kunjungi:', 'web3-captcha'); ?></p>
                    <a href="https://web3captcha.com/docs" target="_blank" class="button button-secondary"><?php _e('Lihat Dokumentasi', 'web3-captcha'); ?></a>
                </div>
                
                <div class="web3-captcha-admin-box">
                    <h3><?php _e('Bantuan & Dukungan', 'web3-captcha'); ?></h3>
                    <p><?php _e('Jika Anda memiliki pertanyaan atau masalah, silakan hubungi tim dukungan kami:', 'web3-captcha'); ?></p>
                    <a href="https://web3captcha.com/support" target="_blank" class="button button-secondary"><?php _e('Dapatkan Bantuan', 'web3-captcha'); ?></a>
                </div>
            </div>
        </div>
        <?php
    }
}

// Inisialisasi kelas pengaturan
new Web3_Captcha_Settings(); 