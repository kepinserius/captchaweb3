// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CaptchaToken
 * @dev Token ERC-20 yang digunakan sebagai reward dalam sistem Web3 CAPTCHA
 */
contract CaptchaToken is ERC20, ERC20Burnable, Ownable, Pausable {
    // Alamat validator CAPTCHA yang berwenang mencetak token
    address public captchaValidator;

    // Cap maksimum supply token
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 juta token

    // Jumlah token yang dicetak pada genesis
    uint256 public constant INITIAL_SUPPLY = 10_000_000 * 10**18; // 10 juta token

    // Event saat minter (validator) diubah
    event CaptchaValidatorChanged(address indexed oldValidator, address indexed newValidator);

    // Konstruktor untuk mencetak token awal dan mengatur validator
    constructor(address _captchaValidator) ERC20("CaptchaToken", "CAPTCHA") {
        require(_captchaValidator != address(0), "Validator tidak boleh address 0");
        captchaValidator = _captchaValidator;
        
        // Cetak token inisial ke pemilik kontrak
        _mint(owner(), INITIAL_SUPPLY);
    }

    /**
     * @dev Mengubah alamat validator CAPTCHA
     * @param _newValidator Alamat validator baru
     */
    function setCaptchaValidator(address _newValidator) external onlyOwner {
        require(_newValidator != address(0), "Validator tidak boleh address 0");
        address oldValidator = captchaValidator;
        captchaValidator = _newValidator;
        emit CaptchaValidatorChanged(oldValidator, _newValidator);
    }

    /**
     * @dev Mencetak token reward untuk pengguna yang berhasil verifikasi CAPTCHA
     * @param _to Alamat penerima reward
     * @param _amount Jumlah token yang dicetak
     */
    function mintReward(address _to, uint256 _amount) external whenNotPaused {
        require(msg.sender == captchaValidator, "Hanya validator yang bisa mencetak reward");
        require(_to != address(0), "Penerima tidak boleh address 0");
        require(totalSupply() + _amount <= MAX_SUPPLY, "Melebihi supply maksimum");
        
        _mint(_to, _amount);
    }

    /**
     * @dev Membakar token untuk mengurangi supply (dapat dipanggil oleh siapa saja untuk token mereka)
     * @param _amount Jumlah token yang dibakar
     */
    function burn(uint256 _amount) public override {
        super.burn(_amount);
    }

    /**
     * @dev Jeda fitur minting (hanya owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Lanjutkan fitur minting (hanya owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
} 