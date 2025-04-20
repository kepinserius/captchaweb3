// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./CaptchaGenerator.sol";
import "./CaptchaValidator.sol";

/**
 * @title DecentralizedCaptcha
 * @dev Contract utama yang mengintegrasikan generator puzzle, validator bukti, dan zk-SNARKs
 */
contract DecentralizedCaptcha {
    // Referensi ke kontrak CaptchaGenerator
    CaptchaGenerator public generator;
    
    // Referensi ke kontrak CaptchaValidator
    CaptchaValidator public validator;
    
    // Pemilik kontrak
    address public owner;
    
    // Referensi ke verifier zk-SNARK (placeholder, dalam implementasi nyata ini akan menjadi kontrak terpisah)
    address public zkVerifier;
    
    // Event untuk bukti verifikasi baru
    event VerificationProofSubmitted(address indexed user, bytes32 indexed puzzleId, bool success);
    
    constructor(address _generatorAddress, address _validatorAddress) {
        generator = CaptchaGenerator(_generatorAddress);
        validator = CaptchaValidator(payable(_validatorAddress));
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya owner yang bisa memanggil fungsi ini");
        _;
    }
    
    /**
     * @dev Set alamat verifier zk-SNARK
     * @param _verifierAddress Alamat kontrak verifier
     */
    function setZkVerifier(address _verifierAddress) external onlyOwner {
        zkVerifier = _verifierAddress;
    }
    
    /**
     * @dev Mendapatkan CAPTCHA puzzle acak untuk user
     * @return puzzleId ID dari puzzle
     * @return puzzleType Jenis puzzle
     * @return data Data puzzle
     */
    function getCaptchaPuzzle() external returns (bytes32 puzzleId, uint8 puzzleType, bytes memory data) {
        (bytes32 id, CaptchaGenerator.PuzzleType pType, bytes memory puzzleData) = generator.getRandomPuzzle();
        return (id, uint8(pType), puzzleData);
    }
    
    /**
     * @dev Memeriksa solusi untuk puzzle
     * @param _puzzleId ID puzzle
     * @param _solution Solusi yang diajukan
     * @return isValid Apakah solusi valid
     */
    function checkSolution(bytes32 _puzzleId, string memory _solution) external view returns (bool isValid) {
        return generator.verifySolution(_puzzleId, _solution);
    }
    
    /**
     * @dev Menghasilkan bukti zk-SNARK bahwa solusi benar (frontend/off-chain)
     * @notice Fungsi ini pada implementasi nyata akan berada di sisi klien/off-chain
     * @param _puzzleId ID puzzle yang diselesaikan
     * @param _solution Solusi untuk puzzle
     * @return proof Bukti zk-SNARK (placeholder)
     */
    function generateZkProof(bytes32 _puzzleId, string memory _solution) external pure returns (bytes memory) {
        // Placeholder: Di implementasi nyata, ini akan menjadi fungsi off-chain di frontend
        // yang menghasilkan bukti zk-SNARK bahwa pengguna memiliki solusi yang benar
        // tanpa mengungkapkan solusi itu sendiri
        
        // Kita return dummy proof untuk contoh
        return abi.encodePacked(_puzzleId, keccak256(abi.encodePacked(_solution)));
    }
    
    /**
     * @dev Menyerahkan bukti zk-SNARK untuk verifikasi dan mendapatkan reward
     * @param _proof Bukti zk yang dihasilkan
     */
    function submitProof(bytes memory _proof) external {
        // 1. Verifikasi bukti zk-SNARK (dalam implementasi nyata ini akan memanggil verifier)
        bool isValid = verifyZkProof(_proof);
        
        if (isValid) {
            // 2. Kirim bukti ke validator untuk memperbarui status pengguna dan memberikan reward
            validator.verifyCaptcha(_proof);
            
            // 3. Emit event untuk logging
            emit VerificationProofSubmitted(msg.sender, bytes32(_proof), true);
        } else {
            emit VerificationProofSubmitted(msg.sender, bytes32(_proof), false);
            revert("Bukti tidak valid");
        }
    }
    
    /**
     * @dev Verifikasi bukti zk-SNARK
     * @param _proof Bukti untuk diverifikasi
     * @return isValid Apakah bukti valid
     */
    function verifyZkProof(bytes memory _proof) internal pure returns (bool isValid) {
        // Placeholder: Dalam implementasi nyata, ini akan memanggil verifier zk-SNARK
        // untuk memverifikasi bukti tanpa mengungkapkan solusi
        
        // Untuk contoh, kita anggap bukti valid jika panjangnya > 0
        return _proof.length > 0;
    }
    
    /**
     * @dev Cek apakah alamat sudah membuktikan kemanusiaannya
     * @param _address Alamat yang akan dicek
     * @return isHuman Status verifikasi manusia
     */
    function isHuman(address _address) external view returns (bool) {
        return validator.isVerifiedHuman(_address);
    }
} 