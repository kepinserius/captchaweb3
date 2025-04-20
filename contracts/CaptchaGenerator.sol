// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title CaptchaGenerator
 * @dev Contract untuk menghasilkan dan memvalidasi puzzle CAPTCHA
 */
contract CaptchaGenerator {
    // Jenis puzzle yang didukung
    enum PuzzleType { IMAGE, MATH, TEXT, AUDIO }
    
    // Struktur data CAPTCHA puzzle
    struct CaptchaPuzzle {
        bytes32 id;
        PuzzleType puzzleType;
        bytes data;
        bytes32 solutionHash; // Hash dari solusi yang benar
        uint256 createdAt;
        bool isUsed;
    }
    
    // Pemetaan dari ID CAPTCHA ke data puzzle
    mapping(bytes32 => CaptchaPuzzle) public puzzles;
    
    // Daftar semua ID puzzle yang aktif
    bytes32[] public activePuzzleIds;
    
    // Pemilik kontrak
    address public owner;
    
    // Masa berlaku puzzle dalam detik (1 jam)
    uint256 public puzzleValidity = 1 hours;
    
    // Event saat puzzle baru dibuat
    event PuzzleCreated(bytes32 indexed puzzleId, PuzzleType puzzleType);
    
    // Event saat puzzle terpakai
    event PuzzleUsed(bytes32 indexed puzzleId);
    
    constructor() {
        owner = msg.sender;
        // Inisialisasi beberapa puzzle awal
        generateInitialPuzzles();
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya owner yang bisa memanggil fungsi ini");
        _;
    }
    
    /**
     * @dev Inisialisasi puzzle awal sebagai contoh
     */
    function generateInitialPuzzles() private {
        // Contoh puzzle matematika
        createMathPuzzle(keccak256(abi.encodePacked("Berapa hasil dari 5 + 7?")), keccak256(abi.encodePacked("12")));
        
        // Contoh puzzle teks
        createTextPuzzle(
            keccak256(abi.encodePacked("Ketik kata yang terlihat dalam gambar")), 
            keccak256(abi.encodePacked("CAPTCHA"))
        );
    }
    
    /**
     * @dev Buat puzzle matematika baru
     * @param _question Hash dari pertanyaan matematika
     * @param _solutionHash Hash dari jawaban yang benar
     */
    function createMathPuzzle(bytes32 _question, bytes32 _solutionHash) public onlyOwner returns (bytes32) {
        bytes32 puzzleId = keccak256(abi.encodePacked(_question, block.timestamp, msg.sender));
        
        puzzles[puzzleId] = CaptchaPuzzle({
            id: puzzleId,
            puzzleType: PuzzleType.MATH,
            data: abi.encodePacked(_question),
            solutionHash: _solutionHash,
            createdAt: block.timestamp,
            isUsed: false
        });
        
        activePuzzleIds.push(puzzleId);
        emit PuzzleCreated(puzzleId, PuzzleType.MATH);
        
        return puzzleId;
    }
    
    /**
     * @dev Buat puzzle teks baru
     * @param _textData Data dari puzzle teks
     * @param _solutionHash Hash dari jawaban yang benar
     */
    function createTextPuzzle(bytes32 _textData, bytes32 _solutionHash) public onlyOwner returns (bytes32) {
        bytes32 puzzleId = keccak256(abi.encodePacked(_textData, block.timestamp, msg.sender));
        
        puzzles[puzzleId] = CaptchaPuzzle({
            id: puzzleId,
            puzzleType: PuzzleType.TEXT,
            data: abi.encodePacked(_textData),
            solutionHash: _solutionHash,
            createdAt: block.timestamp,
            isUsed: false
        });
        
        activePuzzleIds.push(puzzleId);
        emit PuzzleCreated(puzzleId, PuzzleType.TEXT);
        
        return puzzleId;
    }
    
    /**
     * @dev Buat puzzle gambar baru (placeholder, di implementasi sebenarnya ini akan menyimpan referensi ke IPFS)
     * @param _imageHash Hash IPFS dari gambar
     * @param _solutionHash Hash dari jawaban yang benar
     */
    function createImagePuzzle(bytes32 _imageHash, bytes32 _solutionHash) public onlyOwner returns (bytes32) {
        bytes32 puzzleId = keccak256(abi.encodePacked(_imageHash, block.timestamp, msg.sender));
        
        puzzles[puzzleId] = CaptchaPuzzle({
            id: puzzleId,
            puzzleType: PuzzleType.IMAGE,
            data: abi.encodePacked(_imageHash),
            solutionHash: _solutionHash,
            createdAt: block.timestamp,
            isUsed: false
        });
        
        activePuzzleIds.push(puzzleId);
        emit PuzzleCreated(puzzleId, PuzzleType.IMAGE);
        
        return puzzleId;
    }
    
    /**
     * @dev Mendapatkan puzzle acak yang belum digunakan dan masih valid
     * @return puzzleId ID puzzle yang dipilih
     * @return puzzleType Jenis puzzle
     * @return data Data puzzle
     */
    function getRandomPuzzle() public returns (bytes32 puzzleId, PuzzleType puzzleType, bytes memory data) {
        require(activePuzzleIds.length > 0, "Tidak ada puzzle yang aktif");
        
        // Pilih puzzle acak dari yang aktif
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % activePuzzleIds.length;
        bytes32 selectedPuzzleId = activePuzzleIds[randomIndex];
        
        CaptchaPuzzle storage puzzle = puzzles[selectedPuzzleId];
        
        // Cek apakah puzzle masih valid dan belum digunakan
        require(!puzzle.isUsed, "Puzzle sudah digunakan");
        require(block.timestamp <= puzzle.createdAt + puzzleValidity, "Puzzle sudah kadaluarsa");
        
        // Tandai puzzle sebagai terpakai
        puzzle.isUsed = true;
        emit PuzzleUsed(selectedPuzzleId);
        
        // Hapus dari array puzzle aktif
        activePuzzleIds[randomIndex] = activePuzzleIds[activePuzzleIds.length - 1];
        activePuzzleIds.pop();
        
        return (puzzle.id, puzzle.puzzleType, puzzle.data);
    }
    
    /**
     * @dev Verifikasi solusi CAPTCHA
     * @param _puzzleId ID puzzle yang dipecahkan
     * @param _solution Solusi yang diajukan
     * @return isValid Apakah solusi benar
     */
    function verifySolution(bytes32 _puzzleId, string memory _solution) public view returns (bool isValid) {
        CaptchaPuzzle storage puzzle = puzzles[_puzzleId];
        
        // Cek bahwa puzzle ada
        require(puzzle.id == _puzzleId, "Puzzle tidak ditemukan");
        
        // Verifikasi solusi dengan membandingkan hash
        bytes32 solutionHash = keccak256(abi.encodePacked(_solution));
        return solutionHash == puzzle.solutionHash;
    }
    
    /**
     * @dev Mengatur masa berlaku puzzle
     * @param _validity Waktu validitas baru dalam detik
     */
    function setPuzzleValidity(uint256 _validity) public onlyOwner {
        puzzleValidity = _validity;
    }
} 