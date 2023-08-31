const hre = require("hardhat");

async function main() {
  // Deploying the EventContract
  const EventContract = await hre.ethers.getContractFactory("EventContract");
  const eventContract = await EventContract.deploy();

  await eventContract.deployed();

  console.log("EventContract deployed to:", eventContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
