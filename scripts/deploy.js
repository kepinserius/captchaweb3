// Script untuk deployment smart contract

const hre = require("hardhat");

async function main() {
  console.log("Memulai deployment kontrak CAPTCHA Web3...");

  // Deploy CaptchaGenerator
  const CaptchaGenerator = await hre.ethers.getContractFactory(
    "CaptchaGenerator"
  );
  const captchaGenerator = await CaptchaGenerator.deploy();
  await captchaGenerator.waitForDeployment();

  console.log(
    `CaptchaGenerator berhasil di-deploy ke: ${captchaGenerator.target}`
  );

  // Deploy CaptchaValidator
  const CaptchaValidator = await hre.ethers.getContractFactory(
    "CaptchaValidator"
  );
  const captchaValidator = await CaptchaValidator.deploy();
  await captchaValidator.waitForDeployment();

  console.log(
    `CaptchaValidator berhasil di-deploy ke: ${captchaValidator.target}`
  );

  // Deploy DecentralizedCaptcha - kontrak utama
  const DecentralizedCaptcha = await hre.ethers.getContractFactory(
    "DecentralizedCaptcha"
  );
  const decentralizedCaptcha = await DecentralizedCaptcha.deploy(
    captchaGenerator.target,
    captchaValidator.target
  );
  await decentralizedCaptcha.waitForDeployment();

  console.log(
    `DecentralizedCaptcha berhasil di-deploy ke: ${decentralizedCaptcha.target}`
  );

  // Simpan alamat kontrak ke file untuk penggunaan frontend
  const fs = require("fs");
  const contractAddresses = {
    CaptchaGenerator: captchaGenerator.target,
    CaptchaValidator: captchaValidator.target,
    DecentralizedCaptcha: decentralizedCaptcha.target,
  };

  // Buat direktori jika belum ada
  if (!fs.existsSync("./frontend/src/utils")) {
    fs.mkdirSync("./frontend/src/utils", { recursive: true });
  }

  fs.writeFileSync(
    "./frontend/src/utils/contractAddresses.json",
    JSON.stringify(contractAddresses, null, 2)
  );

  console.log(
    "Alamat kontrak berhasil disimpan di ./frontend/src/utils/contractAddresses.json"
  );
}

// Jalankan deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
