require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.28",
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			tags: ["dev"],
		},
		localhost: {
			url: `http://127.0.0.1:8545/`,
			chainId: 31337,
			tags: ["dev"],
		},
		sepolia: {
			url: process.env.SEPOLIA_RPC_URL,
			accounts: [process.env.SEPOLIA_PRIVATE_KEY],
			chainId: 11155111,
			tags: ["testnet"],

			ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // Sepolia ETH/USD price feed
		},
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_KEY,
	},
};
