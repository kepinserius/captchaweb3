// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title CaptchaValidator
 * @dev Contract for validating CAPTCHA proofs dan memberikan rewards
 */
contract CaptchaValidator {
    // Struktur untuk menyimpan status user
    struct UserStatus {
        uint256 successfulVerifications;
        uint256 lastVerificationTime;
        bool isHuman;
    }
    
    // Mapping dari alamat user ke status user
    mapping(address => UserStatus) public userStatuses;
    
    // Event untuk emisi saat verifikasi berhasil
    event VerificationSuccessful(address indexed user, uint256 timestamp);
    
    // Event untuk reward yang diberikan
    event RewardGiven(address indexed user, uint256 amount);
    
    // Jumlah token reward untuk verifikasi
    uint256 public rewardAmount = 1 ether / 100; // 0.01 ETH
    
    // Owner kontrak
    address public owner;
    
    // Minimal waktu antara verifikasi (untuk mencegah spam) - 1 jam
    uint256 public cooldownPeriod = 1 hours;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya owner yang bisa memanggil fungsi ini");
        _;
    }
    
    /**
     * @dev Menerima bukti verifikasi CAPTCHA dan memvalidasi
     * @param _proof Bukti ZK-SNARK terenkripsi (placeholder untuk implementasi sebenarnya)
     */
    function verifyCaptcha(bytes memory _proof) external {
        // Cek cooldown period
        require(
            block.timestamp >= userStatuses[msg.sender].lastVerificationTime + cooldownPeriod || 
            userStatuses[msg.sender].lastVerificationTime == 0,
            "Anda harus menunggu sebelum memverifikasi lagi"
        );
        
        // Placeholder untuk validasi ZK-SNARK proof
        // Pada implementasi sesungguhnya, kita akan menggunakan library ZK-SNARK
        bool isValid = validateProof(_proof);
        require(isValid, "Bukti CAPTCHA tidak valid");
        
        // Update status user
        userStatuses[msg.sender].successfulVerifications++;
        userStatuses[msg.sender].lastVerificationTime = block.timestamp;
        userStatuses[msg.sender].isHuman = true;
        
        // Berikan reward
        giveReward(payable(msg.sender));
        
        emit VerificationSuccessful(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Validasi bukti ZK-SNARK (placeholder)
     * @param _proof Bukti untuk divalidasi
     * @return isValid Status validasi
     */
    function validateProof(bytes memory _proof) internal pure returns (bool isValid) {
        // Placeholder: Implementasi sebenarnya akan menggunakan verifier ZK-SNARK
        // Untuk saat ini, kita asumsikan bukti valid jika panjangnya > 0
        return _proof.length > 0;
    }
    
    /**
     * @dev Berikan reward ke user yang berhasil verifikasi
     * @param _user Alamat user yang akan menerima reward
     */
    function giveReward(address payable _user) internal {
        // Placeholder: Transfer reward ke user
        // Pada implementasi sebenarnya ini akan mentransfer token atau ETH
        
        // Cek saldo kontrak cukup untuk reward
        if (address(this).balance >= rewardAmount) {
            payable(_user).transfer(rewardAmount);
            emit RewardGiven(_user, rewardAmount);
        }
    }
    
    /**
     * @dev Cek apakah alamat adalah manusia terverifikasi
     * @param _address Alamat yang akan dicek
     * @return isHuman Status verifikasi manusia
     */
    function isVerifiedHuman(address _address) external view returns (bool) {
        return userStatuses[_address].isHuman;
    }
    
    /**
     * @dev Set jumlah reward
     * @param _amount Jumlah baru untuk reward
     */
    function setRewardAmount(uint256 _amount) external onlyOwner {
        rewardAmount = _amount;
    }
    
    /**
     * @dev Set periode cooldown
     * @param _period Periode cooldown baru dalam detik
     */
    function setCooldownPeriod(uint256 _period) external onlyOwner {
        cooldownPeriod = _period;
    }
    
    /**
     * @dev Withdraw dana dari kontrak
     * @param _amount Jumlah yang akan ditarik
     */
    function withdraw(uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Saldo tidak cukup");
        payable(owner).transfer(_amount);
    }
    
    // Menerima ETH
    receive() external payable {}
} 