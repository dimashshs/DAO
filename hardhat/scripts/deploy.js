const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Deploy the NFT Contract
  const nftContract = await hre.ethers.deployContract("CryptoDevsNFT");
  await nftContract.waitForDeployment();
  console.log("CryptoDevsNFT deployed to:", nftContract.target);

  // Deploy the Fake Marketplace Contract
  const fakeNftMarketplaceContract = await hre.ethers.deployContract(
    "FakeNFTMarketplace"
  );
  await fakeNftMarketplaceContract.waitForDeployment();
  console.log(
    "FakeNFTMarketplace deployed to:",
    fakeNftMarketplaceContract.target
  );

  // Deploy the DAO Contract
  const amount = hre.ethers.parseEther("1"); // You can change this value from 1 ETH to something else
  const daoContract = await hre.ethers.deployContract("CryptoDevsDAO", [
    fakeNftMarketplaceContract.target,
    nftContract.target,
  ], {value: amount,});
  await daoContract.waitForDeployment();
  console.log("CryptoDevsDAO deployed to:", daoContract.target);

  // Sleep for 30 seconds to let Etherscan catch up with the deployments
  await sleep(30 * 1000);

  // Verify the NFT Contract
  await hre.run("verify:verify", {
    address: nftContract.target,
    constructorArguments: [],
  });

  // Verify the Fake Marketplace Contract
  await hre.run("verify:verify", {
    address: fakeNftMarketplaceContract.target,
    constructorArguments: [],
  });

  // Verify the DAO Contract
  await hre.run("verify:verify", {
    address: daoContract.target,
    constructorArguments: [
      fakeNftMarketplaceContract.target,
      nftContract.target,
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


//CryptoDevsNFT deployed to: 0xf0cd1738d63A31572Ba6b3C487C16a721C8E34E1
//FakeNFTMarketplace deployed to: 0x0a24B6894AdFA9E66ce1DDeC085dBB09f7D1171F
//CryptoDevsDAO deployed to: 0x9849f92A02e036d3c03464ABd53A65C9cE5AAe90

//The contract 0xf0cd1738d63A31572Ba6b3C487C16a721C8E34E1 has already been verified.  
//https://sepolia.etherscan.io/address/0xf0cd1738d63A31572Ba6b3C487C16a721C8E34E1#code
//The contract 0x0a24B6894AdFA9E66ce1DDeC085dBB09f7D1171F has already been verified.  
//https://sepolia.etherscan.io/address/0x0a24B6894AdFA9E66ce1DDeC085dBB09f7D1171F#code
//The contract 0x9849f92A02e036d3c03464ABd53A65C9cE5AAe90 has already been verified.  
//https://sepolia.etherscan.io/address/0x9849f92A02e036d3c03464ABd53A65C9cE5AAe90#code